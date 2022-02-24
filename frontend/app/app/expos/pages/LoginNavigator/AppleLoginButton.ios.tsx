import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useAppleLoginFlow } from './controller';
import { isSimulator } from '../../libs/platform';
import messageService from '../../services/message';
import theme, {
    FontSize,
    FontWeight,
    IconSize,
    VerticalOffset,
    FontWeightType,
} from '../../theme.style';
import AppleAuth, {
    AppleButton,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
    AppleAuthError,
} from '@invertase/react-native-apple-authentication';

const AppleLoginButton: FunctionComponent<NSLoginNavigator.AppleLoginButtonProps> = () => {
    const { t } = useTranslation('LoginPage');

    const [inProgress, setInProgress] = useState(false);

    const loginHandler = useAppleLoginFlow();

    // Displays an onscreen error message when login fails.
    const handleLoginError = async (error: any) => {
        let message = '';
        switch (error.code) {
            case AppleAuthError.CANCELED:
                // don't show an error here; just let the user cancel naturally
                break;
            case AppleAuthError.INVALID_RESPONSE:
                message = t`Received an invalid response from the login server.`;
                break;
            default:
                message = t`Login has failed.`;
                break;
        }

        if (message) {
            console.warn(message, error);
            messageService.sendError(message, t`Apple Login Error`);
        }
        setInProgress(false);
    };

    // Called when the login button is clicked.
    async function onLoginPress() {
        if (await isSimulator()) {
            messageService.sendError('Apple login does not work on the iOS simulator. Please try again on a physical device.');
            return;
        }

        setInProgress(true);
        try {
            // performs login request
            const authResponse = await AppleAuth.performRequest({
                requestedOperation: AppleAuthRequestOperation.LOGIN,
                requestedScopes: [
                    AppleAuthRequestScope.EMAIL,
                    AppleAuthRequestScope.FULL_NAME,
                ],
            });

            // get current authentication state for user
            const appleToken: string = authResponse.identityToken;
            const credentialState = await AppleAuth.getCredentialStateForUser(
                authResponse.user
            );

            // use credentialState response to ensure the user is authenticated
            if (credentialState !== AppleAuthCredentialState.AUTHORIZED) {
                // TODO: handle error
                handleLoginError({
                    code: AppleAuthError.FAILED,
                });
                return;
            }

            loginHandler(appleToken);
        } catch (error) {
            handleLoginError(error);
        }
        setInProgress(false);
    }

    // TODO: Move this to Account settings page where we perform logout.
    // async function onLogout() {
    //     try {
    //         // performs logout request
    //         const authResponse = await AppleAuth.performRequest({
    //             requestedOperation: AppleAuthRequestOperation.LOGOUT,
    //         });

    //         // get current authentication state for user
    //         const appleToken = authResponse.user;
    //         const credentialState = await AppleAuth.getCredentialStateForUser(
    //             appleToken
    //         );

    //         // use credentialState response to ensure the user credential's have been revoked
    //         if (credentialState !== AppleAuthCredentialState.REVOKED) {
    //             console.warn('Apple auth not properly revoked');
    //             return;
    //         }

    //         // TODO: contact GraphQL backend
    //     } catch (error) {
    //         handleLoginError(error);
    //     }
    // }

    const buttonStyle = 'Black';
    const buttonType = 'SignIn';

    return (
        <AppleButton
            style={styles.appleButton}
            buttonStyle={buttonStyle}
            buttonType={buttonType}
            disabled={inProgress}
            onPress={onLoginPress}
        />
    );
};

const styles = StyleSheet.create({
    appleButton: {
        fontFamily: FontWeight.medium.valueOf() as FontWeightType,
        fontSize: FontSize.normal.valueOf(),
        height: IconSize.medium.valueOf(),
        marginHorizontal: 3 * theme.rem, // taken to match UIKit Item getTextCoontainerStyle
        marginVertical: VerticalOffset.small.valueOf(),
    },
});

/**
 * Used by LoginNavigator/HomePage to check whether or not to display this button.
 */
export const isAppleLoginSupported = () => {
    // Note: we cannot simply return true because this will cause unit tests to fail.
    return AppleAuth.isSupported;
};

export default AppleLoginButton;
