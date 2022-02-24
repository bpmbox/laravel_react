declare namespace NSLoginNavigator {
    type AppleLoginButtonProps = {
        testID?: string;
        redirect?: string;
    };

    type GoogleLoginButtonProps = {
        testID?: string;
        redirect?: string;
    } & ItemProps;

    type LoginWithGoogleResponseParams = {
        email: string;
        idToken: string;
    };
}
