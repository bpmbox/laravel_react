import { EventEmitter } from 'events';

declare namespace AuthServiceTypes {
    type AuthToken = string;
    type RefreshToken = AuthToken;
    type AccessToken = AuthToken;

    interface IAuthService extends EventEmitter {
        initFromSavedSession: () => Promise<void>;
        loginWithApple: (appleToken: string) => Promise<LoginData>;
        loginWithGoogle: (idToken: string, email: string) => Promise<LoginData>;
        loginWithCode: (email: string, code: string) => Promise<LoginData>;
        requestEmailCode: (email: string) => Promise<boolean>;
        updateEmail: (newEmail: string, code: string) => Promise<void>;
        getLoginState: () => LoginState;
        logout: () => Promise<void>;
        impersonate: (accessToken: string) => Promise<void>;
    }

    interface IAuthData {
        user: User;
        isOnboarded: boolean;
        accessToken: AccessToken;
        refreshToken: RefreshToken;
    }

    interface IAuthUpdate {
        user?: User;
        accessToken?: AccessToken;
        refreshToken?: RefreshToken;
    }

    interface IUserUpdate {
        givenName?: string;
        familyName?: string;
        email?: string;
        avatarUrl?: string;
    }

    interface ITokenUpdate {
        accessToken: AccessToken;
        refreshToken: RefreshToken;
    }
}
