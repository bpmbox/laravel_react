import { withNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { PARAM_ACCESS_TOKEN } from '../constants';
import routes from '../routes';
import authService from '../services/auth';
import historyService from '../services/history';
import messageService from '../services/message';
import userService from '../services/user';
import ErrorPage from './General/ErrorPage';
import FullPageLoading from './General/FullPageLoading';

const ImpersonatePage = ({ navigation }) => {
    const accessToken = navigation.getParam(PARAM_ACCESS_TOKEN);
    const [isError, setIsError] = useState(false);


    useEffect(() => {
        if (!accessToken) {
            return;
        }

        (async () => {
            try {
                console.debug('Impersonating');
                await authService.impersonate(accessToken);
                const user = await userService.getAccount();
                
                // using name prop as approximation for onboarded.
                const isOnboarded = !!user.familyName;

                console.debug('Impersonation complete, redirecting to entry');
                if(isOnboarded) {
                    historyService.navigateAsRoot(routes.MAIN_SPACE_REDIRECT);
                } else {
                    historyService.navigateAsRoot(routes.ONBOARDING_ACCOUNT);
                }
                messageService.sendMessage(`Now impersonating: ${user.givenName} ${user.familyName}`);
            } catch {
                setIsError(true);
            }
        })();

    }, [accessToken]);

    if (isError) {
        return <ErrorPage />;
    }

    return <FullPageLoading />;
};

// @ts-ignore
ImpersonatePage.path = '~impersonate'; //override path for better web URLs

export default withNavigation(ImpersonatePage);
