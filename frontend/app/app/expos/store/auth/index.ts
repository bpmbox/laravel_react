import { useEffect, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import authService, { AUTH_EVENTS, LOGIN_EVENT, LoginState } from '../../services/auth';
import { AuthServiceTypes } from '../../services/auth/types';
import userService, { USER_UPDATED_EVENT } from '../../services/user';
import { UserServiceTypes } from '../../services/user/types';

const _initAuthState: AuthStoreTypes.AuthStateType = {
    isAuthenticated: true, // Start with authenticated route so we don't redirect to login upon first load.
    isLoading: true,
    currentUser: null,
};

type AuthStoreActions =
    | { type: 'login'; user: User }
    | { type: 'init-logged-in'; user: User }
    | { type: 'init-logged-out' }
    | { type: 'logout' }
    | { type: 'user-updated'; userProps: object };

function authReducer(state: AuthStoreTypes.AuthStateType, action: AuthStoreActions): AuthStoreTypes.AuthStateType {
    switch (action.type) {
        case 'login':
            return {
                isAuthenticated: true,
                isLoading: false,
                currentUser: action.user,
            };
        case 'logout':
            return {
                isAuthenticated: false,
                isLoading: false,
                currentUser: null,
            };
        case 'user-updated':
            const updatedUser = Object.assign({}, state.currentUser, action.userProps);
            return {
                isAuthenticated: true,
                isLoading: false,
                currentUser: updatedUser,
            };

        // Default case not needed, all events must be defined.
    }
    // istanbul ignore next (should never hit this statement under any circumstances.)
    throw new Error('Invalid action.type');
}

/**
 * DO NOT USE DIRECTLY - This is exposed mainly for unit tests
 *
 * @param initAuthState
 */
export function __useAuthStore(initAuthState: AuthStoreTypes.AuthStateType | null = null) {
    const [state, dispatch] = useReducer(authReducer, initAuthState || _initAuthState);

    // Init code that runs upon first loading a route that uses authentication.
    useEffect(() => {
        // If already logged in, we need to fetch the user.
        // However, if we are passing in initial skip this init to keep unit test simple.
        // This avoides having to mock 3 different dependent services for testing components
        // that use AuthStore
        if (!initAuthState) {
            switch (authService.getLoginState()) {
                case LoginState.LOGGED_IN:
                    userService
                        .getAccount()
                        .then(user => {
                            dispatch({
                                type: 'login',
                                user,
                            });
                        })
                        .catch(err => {
                            console.error('AuthStore: Error fetching current user.', err);
                        });
                    break;

                case LoginState.LOGGED_OUT:
                    dispatch({ type: 'logout' });
                    break;
                default:
                    // AuthService still initializing
                    break;
            }
        }

        // Adding listeners to handle changes in Auth status.
        // Adding in UseEffect since we only want to run this once.
        const destructors: (() => void)[] = initEventListeners(dispatch);

        return () => {
            // Destructor to remove event event listeners.  This should match up with
            destructors.forEach(destructor => destructor());
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // using empty list as watch so it runs only once upon first init.

    return {
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        isLoading: state.isLoading,
    };
}

/**
 * Initializes event listeners.
 *
 * Event listeners subscribe to events that change the authentication/authorization status,
 * then dispatches actions for the authStore reducer to derive the state.
 *
 * @param setState
 */
function initEventListeners(dispatch: React.Dispatch<AuthStoreActions>) {
    // Use array to each listener we need to remove.
    const destructors: (() => void)[] = [];

    const logoutListener = () => {
        dispatch({ type: 'logout' });
    };
    authService.addListener(AUTH_EVENTS.LOGOUT, logoutListener);
    destructors.push(() => {
        authService.removeListener(AUTH_EVENTS.LOGOUT, logoutListener);
    });

    const authUpdateListener = (loginData: LOGIN_EVENT) => {
        dispatch({
            type: 'login',
            user: loginData.user,
        });
    };
    authService.addListener(AUTH_EVENTS.LOGIN, authUpdateListener);
    destructors.push(() => {
        authService.removeListener(AUTH_EVENTS.LOGIN, authUpdateListener);
    });

    // Update info in the 'currentUser' when user updates their profile info.
    const profileUpdateListener = (userUpdate: UserServiceTypes.IUserUpdateEventPayload) => {
        dispatch({
            type: 'user-updated',
            userProps: userUpdate,
        });
    };
    userService.addListener(USER_UPDATED_EVENT, profileUpdateListener);
    destructors.push(() => {
        userService.removeListener(USER_UPDATED_EVENT, profileUpdateListener);
    });

    // Update emal in currentUser when email is updated.
    const userUpdatedListener = (updates: AuthServiceTypes.IAuthUpdate) => {
        dispatch({
            type: 'user-updated',
            userProps: {
                ...updates,
            },
        });
    };
    authService.addListener(AUTH_EVENTS.USER_UPDATED, userUpdatedListener);
    destructors.push(() => {
        authService.removeListener(AUTH_EVENTS.USER_UPDATED, userUpdatedListener);
    });

    return destructors;
}

export default createContainer(__useAuthStore);
