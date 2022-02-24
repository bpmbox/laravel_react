/**
 * This file contains details of the more complicated flow logic used in the login
 * page such as Google Login.
 */
import { useContext } from 'react';
import { NavigationContext } from 'react-navigation';
import { PARAM_REDIRECT } from '../../constants';
import routes from '../../routes';
import authService from '../../services/auth';
import { AuthServiceTypes } from '../../services/auth/types';
import routingService from '../../services/routing';
import { TreeError } from '../../libs/convert-graphql-error';

/**
 * Handles the details of the login flow using Google auth response.
 * Returns a custom hook that wraps the Google login flow.
 */
export function useGoogleLoginFlow() {
    const navContext = useContext(NavigationContext);

    /**
     * Handle Google login flow given Google UserType.
     */
    return async (loginParams: NSLoginNavigator.LoginWithGoogleResponseParams) => {
        let authData: AuthServiceTypes.IAuthData = null;
        let error: TreeError = null;

        try {
            authData = await authService.loginWithGoogle(loginParams.idToken, loginParams.email);
        } catch (e) {
            console.debug('useGoogleLoginFlow: error=', e);
            error = e;
        }

        return __handleRedirect(error, authData, navContext);
    };
}

/**
 * Handles the details of the login flow using Google auth response.
 * Returns a custom hook that wraps the Google login flow.
 */
export function useAppleLoginFlow() {
    const navContext = useContext(NavigationContext);

    /**
     * Handle Apple login flow given Apple auth success result.
     */
    return async (appleLoginToken: string) => {
        let authData: AuthServiceTypes.IAuthData = null;
        let error: TreeError = null;

        try {
            authData = await authService.loginWithApple(appleLoginToken);
        } catch (e) {
            console.debug('useAppleLoginFlow: error=', e);
            error = e;
        }

        return __handleRedirect(error, authData, navContext);
    };
}

/**
 * Returns a custom hook that wraps the email login flow.
 */
export function useEmailLoginFlow() {
    const navContext = useContext(NavigationContext);

    /**
     * Returns a function to handle redirecting to correct location post email login.
     */
    return async (email: string, code: string): Promise<void> => {
        let authData: AuthServiceTypes.IAuthData = null;
        let error: TreeError = null;

        try {
            authData = await authService.loginWithCode(email, code);
        } catch (e) {
            error = e;
        }

        return __handleRedirect(error, authData, navContext);
    };
}

async function __handleRedirect(
    error: TreeError,
    authData: AuthServiceTypes.IAuthData,
    navigation: any
): Promise<void> {
    // If error, then we handle the direct directly
    if (error) {
        if (error.type === 'AuthNotWhitelisted') {
            navigation.navigate(routes.LOGIN_REQUEST_ACCESS);
            return;
        }

        if (!authData) {
            // was not logged in successfully;
            // we would reach this case if e.g. Google/Apple login fails
            throw error;
        }
    }

    // If user is not onboarded then redirect user to onboarding page
    if (!authData || !authData.isOnboarded) {
        navigation.navigate(routes.ONBOARDING_ACCOUNT);
        return;
    }

    // If the user is onboarded but was landed via universal link. So
    // we redirect back to the post login page.
    const redirect = routingService.getQueryParam(navigation, PARAM_REDIRECT);
    if (redirect) {
        routingService.goToRoute(redirect);
        return;
    }

    // If we are already onboarded, go to space redirect page for it to handle
    // if we get redirected to last saved space or not.
    navigation.navigate(routes.MAIN_SPACE_REDIRECT);
}
