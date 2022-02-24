import get from 'lodash/get';
import React, { FunctionComponent } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import i18n from '../../i18n';
import { View } from 'react-native';
import Button from '../../components/UIKit/items/Button';
import messageService from '../../services/message';
import { useGoogleLoginFlow } from './controller';
import getGoogleClientId from './google-client-id';

/**
 * Web version of Google Login button.
 * Note that this component depends on environment variable REACT_APP_GOOGLE_CLIENT_ID_WEB
 * being set in both the www and server to the same valid Google web client ID.
 */
const GoogleLoginButton: FunctionComponent<NSLoginNavigator.GoogleLoginButtonProps> = props => {
    const { t } = useTranslation('LoginPage');

    const clientId = getGoogleClientId();
    if (!clientId) {
        console.warn(
            'GoogleLogin',
            'Environment variable REACT_APP_GOOGLE_CLIENT_ID_WEB not found.' +
                ' Cannot perform Google Login without this value.'
        );
    }
    const googleLoginFlow = useGoogleLoginFlow();

    const googleLoginSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        try {
            const idToken = get(response, 'tokenId', null);
            const email = get(response, 'profileObj.email', null);

            if (!email) {
                return messageService.sendError(t('Unable to log in with Google (Cannot get email)'), t`Error`);
            }

            if (!idToken) {
                // This case should rarely happen.  This probably meant there was tampering in 3 way handshake.
                console.error('GoogleLogin', 'Google login error, missing ID token', JSON.stringify(response));
                return messageService.sendError(t('Unable to log in with Google.'), t`Error`);
            }

            // Create a pseudo GoogleUser object with just the properties we need.
            await googleLoginFlow({
                email,
                idToken,
            });
        } catch (err) {
            googleLoginError(err);
        }
    };

    return (
        <GoogleLogin
            clientId={clientId}
            render={(renderProps): React.ReactElement => (
                <View style={styles.buttonContainer}>
                    <Button
                        text={t`Log in with Google`}
                        onPress={renderProps.onClick}
                        disabled={renderProps.disabled}
                        narrow
                        {...props}
                    />
                </View>
            )}
            prompt="select_account"
            accessType="online" // Default value
            responseType="permission" // Default value
            onSuccess={googleLoginSuccess}
            onFailure={googleLoginError}
            cookiePolicy={'single_host_origin'}
        />
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
    },
});

/**
 * Displays a user-friendly error message.
 * @param error An object that generally contains the following members:
 * - error (string): an error code identifier such as 'idpiframe_initialization_failed'
 * - details (string): a text error message such as 'Not a valid origin for the client: ...'
 */
async function googleLoginError(error: any) {
    const t = (message: string, ...args: any[]) => i18n.t('LoginPage::' + message, ...args);

    // for list of error codes, see:
    // https://developers.google.com/identity/sign-in/web/reference#error_codes
    if (error.error === 'popup_closed_by_user') {
        // user canceled the flow; not a real error
        return;
    }

    console.error('GoogleLogin', 'Login with Google error:', error);
    messageService.sendError(t('Unable to log in with Google.'));
}

export default GoogleLoginButton;
