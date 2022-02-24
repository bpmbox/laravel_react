import React, { useCallback, useEffect } from 'react';

import AuthStore from '../../store/auth';
import routes from '../../routes';
import historyService from '../../services/history';
import routingService from '../../services/routing';
import FullPageLoading from '../General/FullPageLoading';
import HomePage from '../Public/HomePage';
import { isMobilePlatform } from '../../libs/platform';
import { PARAM_REDIRECT } from '../../constants';

//import { log } from './services/log/log';
//global["lg"] = new log();

const AppEntryPoint = (props: any) => {
    const { isAuthenticated, currentUser, isLoading } = AuthStore.useContainer();

    const initApp = useCallback(async () => {
        if (isLoading) {
            return;
        }
global["lg"].sendTeams("AppEntorypoint .tsx","line 28 start ")

        // historyService.push(routes.DOCUMENTATION);
        // historyService.push("_gallery");
        // return;

        // If user is not detected then goto login page
        if (!isAuthenticated || !currentUser) {
            // - On Mobile platform, we redirect user to login page if not user is not authenticated
            // - If we have redirect param then go to login directly
            const redirect = routingService.getQueryParam(null, PARAM_REDIRECT);

global["lg"].sendTeams("AppEntorypoint .tsx",PARAM_REDIRECT)



            if (isMobilePlatform || redirect) {
                console.log('User not found => goto LoginPage');
                const params = redirect ? { redirect } : {};

global["lg"].sendTeams("AppEntorypoint .tsx",PARAM_REDIRECT)


                // historyService.navigateAsRoot does not work well when
                // - redirected from subdomain
                // - login user
                // - logout user
                // => So I keep .push for now
                historyService.push(routes.LOGIN, params);
            } else {
                // On Desktop platform we will handle the Home view instead of Login
                // and this is handled by returned result of this component
global["lg"].sendTeams("AppEntorypoint .tsx",PARAM_REDIRECT)

                console.log('User not found => display HomePage');
            }
            return;
        }

        // If user detected and not onboarded yet so goto the onboarding page
        if (!currentUser.givenName) {
global["lg"].sendTeams("AppEntorypoint .tsx",PARAM_REDIRECT)

            console.log('User has not been onboarded yet => goto Onboarding page');
            historyService.push(routes.ONBOARDING_ACCOUNT);
            return;
        }

        // User are on-boarded then redirect to spaceRedirect page
        historyService.push(routes.MAIN_SPACE_REDIRECT);
        
        global["lg"].sendTeams("pages/entorypoint .tsx","line 28 start "+routes.MAIN_SPACE_REDIRECT)

    }, [isAuthenticated, currentUser, isLoading]);

    useEffect(() => {
global["lg"].sendTeams("AppEntorypoint .tsx",PARAM_REDIRECT)
    
        initApp();
    }, [initApp]);

    if (!isMobilePlatform && !isLoading && !isAuthenticated) {
global["lg"].sendTeams("AppEntorypoint .tsx",PARAM_REDIRECT)

        return <HomePage />;
    }

    return <FullPageLoading />;
};

// @ts-ignore
AppEntryPoint.path = '';

export default AppEntryPoint;
