import graphqlService from '../graphql';
import {
    LOGIN_WITH_APPLE,
    LOGIN_WITH_GOOGLE,
    REQUEST_EMAIL_CODE,
    VERIFY_EMAIL_AUTH_CODE,
    UPDATE_EMAIL_WITH_CODE,
    AUTH_REFRESH_TOKEN,
    AUTH_REVOKE_REFRESH_TOKEN,
} from './queries';
import { AuthServiceTypes } from './types';
import { EventEmitter } from 'events';
import decode from 'jwt-decode';
import userService from '../user';
import storageService from '../storage';
import truncate from 'lodash/truncate';
import messageService from '../message';
import i18n from '../../i18n';

const LOCALSTORAGE_REFRESH_TOKEN_KEY = 'refreshToken';
const LOCALSTORAGE_REFRESH_EXP_KEY = 'refreshExp';

/**
 * Events corresponding to key changes in auth state.  These events are consumed by Stores,
 * such as the AuthStore, to track application auth state.
 */
export const AUTH_EVENTS = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    USER_UPDATED: 'user-updated',
};

/**
 * Scheduled token refresh ocurrs in a decay interval of 1/2, until we hit a minimum
 * rate in order to prevent thrashing.
 */
const MIN_TOKEN_REFRESH_RATE = 60000;

/** If init fails due to network connection, retry in */
const INIT_NETWORK_ERROR_RETRY_INTERVAL = 20000;

const OFFLINE_MESSAGE = i18n.t('AuthService::Your device appears to be offline.');

/**
 * Default refresh token exp.  It is used to determin when to give up scheduling a refresh.
 */
const DEFAULT_REFRESH_TOKEN_EXP = 15552000000;

export type LOGIN_EVENT = {
    user: User;
};

/**
 * Login state of the current user.
 */
export enum LoginState {
    UNKNOWN, // auth service has not completed init yet.
    LOGGED_IN,
    LOGGED_OUT,
}

/**
 * Implementation for AuthService.
 */
export class AuthService extends EventEmitter implements AuthServiceTypes.IAuthService {
    /**
     * Current refresh token for this session.
     */
    __refreshToken: AuthServiceTypes.RefreshToken | null = null;

    /**
     * Refresh expiration
     */
    __refreshExp: Number | null = null;

    // Tracks our login state.
    __sessionInitialized: boolean = false;

    // Reference to Storage Service used to store auth refresh token info.
    __storage: NSStorageService.StorageServiceType;

    // Tracks if we have a pending refresh/init
    __refreshTimeout: ReturnType<typeof setTimeout>;

    constructor(storage: NSStorageService.StorageServiceType) {
        super();

        this.__storage = storage;
    }

    /**
     * Makes call to login with information from Apple Login
     * @param appleToken: identity token from Apple Auth
     * @returns User with auth data if already onboarded, otherwise null.
     */
    async loginWithApple(appleToken: string): Promise<AuthServiceTypes.IAuthData> {
        const result = await graphqlService.mutate({
            mutation: LOGIN_WITH_APPLE,
            variables: {
                appleToken,
            },
            fetchPolicy: 'no-cache',
        });

        return this.__loginUser(
            (result.data as { authLoginWithApple: object }).authLoginWithApple as AuthServiceTypes.IAuthData
        );
    }

    /**
     * Makes call to login with information from GoogleAuth
     * @param idToken: IDToken from GoogleAuth
     * @param email: Email from GoogleAuth
     * @returns User with auth data if already onboarded, otherwise null.
     */
    async loginWithGoogle(idToken: string, email: string): Promise<AuthServiceTypes.IAuthData> {
        const result = await graphqlService.mutate({
            mutation: LOGIN_WITH_GOOGLE,
            variables: {
                idToken,
                email,
            },
            fetchPolicy: 'no-cache',
        });

        return this.__loginUser(
            (result.data as { authLoginWithGoogle: object }).authLoginWithGoogle as AuthServiceTypes.IAuthData
        );
    }

    /**
     * Login with code
     * @param email
     * @param code
     */
    async loginWithCode(email: string, code: string): Promise<AuthServiceTypes.IAuthData> {
        const result = await graphqlService.mutate({
            mutation: VERIFY_EMAIL_AUTH_CODE,
            variables: {
                email,
                code,
            },
            fetchPolicy: 'no-cache',
        });

        return this.__loginUser(
            (result.data as { authLoginWithCode: Object }).authLoginWithCode as AuthServiceTypes.IAuthData
        );
    }

    /**
     * Makes request email verification code.
     * @param email
     */
    async requestEmailCode(email: string): Promise<boolean> {
        console.debug('Called requestEmailCode with email:', email);

        await graphqlService.mutate({
            mutation: REQUEST_EMAIL_CODE,
            variables: {
                email,
            },
            fetchPolicy: 'no-cache',
        });

        return true;
    }

    /**
     * Update email address for account.
     * @param newEmail
     * @param code
     * @returns token
     *
     * DevNote: updateEmail is under authService because changing the email invalidates the current authToken,
     * so auth needs to be updated with new auth token.
     */
    async updateEmail(newEmail: string, code: string): Promise<void> {
        const result = await graphqlService.mutate({
            mutation: UPDATE_EMAIL_WITH_CODE,
            variables: {
                newEmail: newEmail,
                code: code,
            },
            fetchPolicy: 'no-cache',
        });

        // Update tokens because the old tokens are invalidated after user unique key change.
        const { accessToken, refreshToken } = (result.data as {
            currentUser: {
                updateEmailWithCode: {
                    accessToken: string;
                    refreshToken: string;
                };
            };
        }).currentUser.updateEmailWithCode;
        graphqlService.setAccessToken(accessToken);
        this.__refreshToken = refreshToken;

        this.emit(AUTH_EVENTS.USER_UPDATED, {
            email: newEmail,
        });
    }

    /**
     * Logs out user by removing access tokens and transitioning to pre-login state.
     */
    async logout(): Promise<void> {
        // copy the refresh token to another var so we can clear the session locally then send the
        // revoke request.
        const logoutToken = this.__refreshToken;

        // Regardless if the logout succeeded on the server side, we want to remote tokens from
        // localstorage and transition to logout state.
        await this.__storage.removeItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);
        await this.__storage.removeItem(LOCALSTORAGE_REFRESH_EXP_KEY);
        // Clear AccessToken
        graphqlService.setAccessToken('');
        this.__refreshToken = null;
        this.__refreshExp = null;

        // Call server to revoke refresh token, to ensure if refresh token was maliciously copied,
        // it cannot be used.
        try {
            if (logoutToken) {
                await graphqlService.mutate({
                    mutation: AUTH_REVOKE_REFRESH_TOKEN,
                    variables: {
                        refreshToken: logoutToken,
                    },
                    fetchPolicy: 'no-cache',
                });
            }
        } catch (err) {
            // Session could already been revoked already (such as deleting an account)
            console.warn('Error logging out', err);
        } finally {
            // Clear in-memory cache
            graphqlService.clearInMemoryCache();

            // Emit logout event so authStore can transition to logout state.
            this.emit(AUTH_EVENTS.LOGOUT);
        }
    }

    /**
     * Returns if the user is logged in or not by checking their refreshToken is still valid.
     */
    getLoginState(): LoginState {
        if (!this.__sessionInitialized) {
            return LoginState.UNKNOWN;
        }

        if (this.__refreshToken && this.__refreshExp && this.__refreshExp > Date.now()) {
            return LoginState.LOGGED_IN;
        }
        return LoginState.LOGGED_OUT;
    }

    /**
     * Login user flow, for this moment it's simple, just set the accessToken
     * @param authData
     * @private
     */
    async __loginUser(authData: AuthServiceTypes.IAuthData): Promise<AuthServiceTypes.IAuthData> {
        console.debug('Authenticated user:', authData.user.email);

        graphqlService.setAccessToken(authData.accessToken);
        this.__refreshToken = authData.refreshToken;
        await this.__storage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, authData.refreshToken);
        await this.__setRefreshExpiration();

        this.emit(AUTH_EVENTS.LOGIN, {
            user: authData.user,
        });

        this.__scheduleTokenRefresh(authData.accessToken);

        return authData;
    }

    async impersonate(accessToken: string) {
        // Clear out any session items related to any user that might be currrently logged in.
        await this.__storage.removeItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);
        await this.__storage.removeItem(LOCALSTORAGE_REFRESH_EXP_KEY);
        await graphqlService.clearInMemoryCache();
        // Note: even though we set this later, we want to make sure we clear this just in case
        // impersonate fails.
        graphqlService.setAccessToken('');

        this.__refreshToken = null;
        this.__refreshExp = null;

        // Stop any scheduled token refreshes.
        clearTimeout(this.__refreshTimeout);
        this.emit(AUTH_EVENTS.LOGOUT);

        // Set our impersonated token.
        graphqlService.setAccessToken(accessToken);
        try {
            const user = await userService.getAccount();

            this.emit(AUTH_EVENTS.LOGIN, {
                user: user,
            });
        } catch (err) {
            console.error('Impersonation failed', err);
            // Make sure we clear the token if impersonation fails.
            graphqlService.setAccessToken('');
            throw err;
        }
    }

    /**
     * If we have a saved refreshToken, initialize the session using the saved refresh token.
     */
    async initFromSavedSession(): Promise<void> {
        clearTimeout(this.__refreshTimeout);

        console.debug('AuthService: init from saved session');
        const savedRefreshToken = await this.__storage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);
        const savedRefreshExp = await this.__storage.getItem(LOCALSTORAGE_REFRESH_EXP_KEY);
        console.debug(
            'AuthService: saved auth data',
            `token: ${truncate(savedRefreshToken, { length: 8 })}`,
            `exp: ${new Date(savedRefreshExp)}`
        );

        // Check refesh token is not expired.
        const tokenExpired = !savedRefreshExp || Date.now() > Number(savedRefreshExp);
        if (!savedRefreshToken || tokenExpired) {
            console.debug(
                'AuthService: Exiting initFromSavedSession. Reason',
                `TokenExists: ${!!savedRefreshToken}, TokenExpired: ${tokenExpired}`
            );

            this.emit(AUTH_EVENTS.LOGOUT);
            this.__sessionInitialized = true;
            return;
        }

        // Set the refresh token for this session.
        this.__refreshToken = savedRefreshToken;
        this.__refreshExp = Number(savedRefreshExp);

        try {
            await this.__refreshTokens();
            console.debug('AuthService: auth successful, fetching account info');
            const loggedInUser = await userService.getAccount();

            console.debug('Detected user:', loggedInUser);

            this.emit(AUTH_EVENTS.LOGIN, {
                user: loggedInUser,
            });
        } catch (err) {
            console.debug('Token refresh on init failed.', err);

            // If network error, try to init again.            
            if (err.networkError) {
                messageService.sendWarning(OFFLINE_MESSAGE);
                this.__refreshTimeout = setTimeout(() => {
                    console.debug('AuthService: Attempting to retry init.');
                    this.initFromSavedSession();
                }, INIT_NETWORK_ERROR_RETRY_INTERVAL);
                return;
            }

            this.__refreshToken = null;
            this.__refreshExp = null;
            this.emit(AUTH_EVENTS.LOGOUT);
        }
        this.__sessionInitialized = true;
    }

    /**
     * Retreives a new set of access and refresh tokens using the current refresh token.
     * It will also schedule next token refresh.
     */
    async __refreshTokens(): Promise<void> {
        console.debug('AuthService: refreshing tokens');
        const result = await graphqlService.mutate(
            {
                mutation: AUTH_REFRESH_TOKEN,
                variables: {
                    refreshToken: this.__refreshToken,
                },
                fetchPolicy: 'no-cache',
            },
            false
        );

        const { accessToken, refreshToken } = (result.data as {
            authRefreshToken: {
                accessToken: string;
                refreshToken: string;
            };
        }).authRefreshToken;

        console.debug(
            'AuthService: received token pair',
            truncate(accessToken, { length: 8 }),
            truncate(refreshToken, { length: 8 })
        );
        graphqlService.setAccessToken(accessToken);
        this.__refreshToken = refreshToken;

        // TODO: figure out how to make server not expire refresh tokens so can write tokens to
        // local storage only on login.  This will allow us to support multiple sessions in different
        // tabs.
        await this.__storage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshToken);
        await this.__setRefreshExpiration();

        console.debug('AuthService: refreshing tokens SUCCESSFUL');

        this.__scheduleTokenRefresh(accessToken);
    }

    /**
     * Will try to intelligently schedule token refresh based on when access token expiration.
     *
     * To ensure tokens are refreshed on time, we'll use try to refresh the token when 1/2 of the
     * remaining expiration time is consumed, then at 1 minute intervals after the expiration has
     * been reached (to avoid pinging the server with too many requests).
     * @param accessToken
     */
    __scheduleTokenRefresh(accessToken: AuthServiceTypes.AccessToken) {
        clearTimeout(this.__refreshTimeout);

        // Decode token claims to get token expiration.
        const claims = decode(accessToken);
        const millisecRemaining = claims.exp * 1000 - Date.now();

        // Schedule next refresh in 1/2 the remaining lifetime of current access token.
        const nextRefresh =
            millisecRemaining / 2 > MIN_TOKEN_REFRESH_RATE ? millisecRemaining / 2 : MIN_TOKEN_REFRESH_RATE;

        console.debug('AuthService: scheduling token refresh in', new Date(Date.now() + nextRefresh));

        this.__refreshTimeout = setTimeout(async (): Promise<void> => {
            console.debug('AuthService: scheduled token refresh starting');
            const tokenExists = !!this.__refreshToken;
            const tokenExpired = !this.__refreshExp || Date.now() > this.__refreshExp;
            if (!tokenExists || tokenExpired) {
                console.debug(
                    'AuthService: Exiting scheduled refresh. Reason',
                    `TokenExists: ${tokenExists}, TokenExpired: ${tokenExpired}`
                );
                return;
            }

            try {
                await this.__refreshTokens();
            } catch (err) {
                // If network error, try to refresh token later.
                if (err.networkError) {
                    messageService.sendWarning(OFFLINE_MESSAGE);
                    console.debug('Token failed to refresh, rescheduling token refresh.', err);

                    this.__scheduleTokenRefresh(accessToken);
                    return;
                }

                // otherwise, there is probably something wrong with this token. Logout.
                console.log('Failed to re-authenticate, logging out', err);
                this.logout();
            }
        }, nextRefresh);
    }

    async __setRefreshExpiration() {
        // Get expiration time period from config.
        // istanbul ignore next
        const configuredExp = Number(process.env.REACT_APP_REFRESH_EXPIRATION);
        // istanbul ignore next
        const estExp = Date.now() + (configuredExp || DEFAULT_REFRESH_TOKEN_EXP); // use config or default to 6 months.
        console.debug('AuthService: Setting token expiration to ', new Date(estExp));

        await this.__storage.setItem(LOCALSTORAGE_REFRESH_EXP_KEY, estExp.toString());
        this.__refreshExp = estExp;
    }
}

const authService: AuthServiceTypes.IAuthService = new AuthService(storageService);

export default authService;
