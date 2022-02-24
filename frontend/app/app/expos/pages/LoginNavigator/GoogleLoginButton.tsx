import { GoogleSignin, statusCodes, User as GoogleUser } from '@react-native-community/google-signin';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import messageService from '../../services/message';
import Button from '../../components/UIKit/items/Button';
import { useGoogleLoginFlow } from './controller';
import getGoogleClientId from './google-client-id';

/**
 * Android and iOS version of Google Login button.
 * Note that this component depends on environment variable REACT_APP_GOOGLE_CLIENT_ID_IOS
 * and REACT_APP_GOOGLE_CLIENT_ID_ANDROID being set in both the www and server to the same
 * valid Google web client ID.
 */
const GoogleLoginButton: FunctionComponent<NSLoginNavigator.GoogleLoginButtonProps> = props => {
    const { t } = useTranslation('LoginPage');

    const [inProgress, setInProgress] = useState(false);

    const clientId = getGoogleClientId();
    if (!clientId) {
        console.warn(
            'GoogleLogin',
            'Environment variable REACT_APP_GOOGLE_CLIENT_ID not found.' +
                ' Cannot perform Google Login without this value.'
        );
    }

    // Initialize Google Signin library exactly once.
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: clientId,
            iosClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID_IOS,
        });

        // perform a forced sign-out so that the account selector will always pop up
        try {
            GoogleSignin.signOut();
        } catch (err) {
            // empty
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -- Higher level login logic --
    const googleLoginFlow = useGoogleLoginFlow();

    // -- Event Handlers --

    // Called when the login button is clicked.
    const onLoginPress = async () => {
        setInProgress(true);
        try {
            const hasPlayServices = await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            if (hasPlayServices) {
                const googleUser: GoogleUser = await GoogleSignin.signIn();
                await googleLoginFlow({
                    email: googleUser.user.email,
                    idToken: googleUser.idToken,
                });
            }
        } catch (error) {
            handleLoginError(error);
        } finally {
            setInProgress(false);
        }
    };

    return <Button text={t`Log in with Google`} onPress={onLoginPress} disabled={inProgress} narrow {...props} />;
};

/**
 * Displays a user-friendly error message.
 * @param error An error emitted from the Google Login module or the app's backend.
 *              If the error comes from our backend, it will have one of our error codes in it.
 *              Example: {
 *                  type: 'AuthIdTokenInvalid',
 *                  code:'001-400-0004',
 *                  line: 25064,
 *                  column: 28,
 *                  sourceURL: 'http://path-to-app.com/app:8081/index.bundle?...'
 *              }
 */
async function handleLoginError(error: any) {
    const t = (message: string, ...args: any[]) => i18n.t('LoginPage::' + message, ...args);
    const code = error.code || '';
    switch (code) {
        // OK cases
        case statusCodes.SIGN_IN_CANCELLED:
        case statusCodes.IN_PROGRESS:
            break;

        // Not ok cases.
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Makes sure that Google Play Services are available on this device.
            try {
                await GoogleSignin.hasPlayServices({
                    showPlayServicesUpdateDialog: true,
                });
                // google services are available
            } catch (err) {
                messageService.sendError(t('Google Services are currently not available'));
            }
            break;

        default:
            console.error('GoogleLogin', 'Login with Google error:', error);
            messageService.sendError(t('Unable to log in with Google.'));
            break;
    }
}

export default GoogleLoginButton;
