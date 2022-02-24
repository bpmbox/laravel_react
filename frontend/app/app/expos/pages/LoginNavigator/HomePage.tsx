import React, { useCallback } from 'react';
import { FunctionComponent } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavigationInjectedProps } from 'react-navigation';
import { withNavigation } from '@react-navigation/core';
import Icon from '../../components/UIKit/Icon';
import Heading from '../../components/UIKit/items/Heading';
import Page from '../../components/UIKit/Layout/Page';
import Center from '../../components/UIKit/Layout/Center';
import Bottom from '../../components/UIKit/Layout/Bottom';
import Button from '../../components/UIKit/items/Button';
import Spacer from '../../components/UIKit/items/Spacer';
import i18n from '../../i18n';
import routes from '../../routes';
import { IconId } from '../../assets/native/svg-icons';
import { PARAM_REDIRECT } from '../../constants';
import { IconSize, ItemWidth, ItemHeight, ButtonType } from '../../theme.style';
import GoogleLoginButton from './GoogleLoginButton';
import AppleLoginButton, { isAppleLoginSupported } from './AppleLoginButton';
import { createNavigationOptions } from '../../components/Navigation/NavButtons';
import routingService from '../../services/routing';


const DesktopLayout = ({ header, buttons }) => (
    <Page>
        <Center>
            {header}
            <Spacer height={ItemHeight.small} />
            <View style={{ maxWidth: ItemWidth.xnarrow.valueOf(), width: '100%' }}>
                {buttons}
            </View>
        </Center>
    </Page>
);

const MobileLayout = ({ header, buttons }) => (
    <Page>
        <Center style={styles.loginPage}>{header}</Center>
        <Bottom>
            {buttons}
            <Spacer />
        </Bottom>
    </Page>
);

const HomePage: FunctionComponent<NavigationInjectedProps> = props => {
    const { t } = useTranslation('HomePage', { i18n });
    const { navigation } = props;

    // Get the redirect so we can pass it to the next screen.
    const redirect = routingService.getQueryParam(navigation, PARAM_REDIRECT);

    const gotoLoginEnterEmailPage = useCallback(() => {
        navigation.navigate(routes.LOGIN_ENTER_EMAIL, { redirect });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redirect]);

    const header = (
        <>
            <Icon
                svgIconId={IconId.logo_tree_logo_border_sunrise}
                iconSize={IconSize.large}
            />
            <Heading text={t('Log In')} h2 tall center />
        </>
    );

    const buttons = (
        <>
            {
            // Note: we still have to check if AppleLogin is supported
            // to support unit tests.
            isAppleLoginSupported() && (
                <AppleLoginButton testID="AppleLoginButton" />
            )}
            <GoogleLoginButton
                testID="GoogleLoginButton"
                desktopWidth={ItemWidth.narrow}
                desktopCenterItem={true}
            />
            <Button
                testID="EmailLoginButton"
                onPress={gotoLoginEnterEmailPage}
                text={t('Log in with Email')}
                type={ButtonType.text}
                narrow
                desktopWidth={ItemWidth.narrow}
                desktopCenterItem={true}
            />
        </>
    );

    return Platform.select({
        web: () => <DesktopLayout header={header} buttons={buttons} />,
        ios: () => <MobileLayout header={header} buttons={buttons} />,
        android: () => <MobileLayout header={header} buttons={buttons} />,
    })();
};

const styles = StyleSheet.create({
    loginPage: {
        flex: 9,
        marginBottom: 80,
    },
});

// @ts-ignore
HomePage.navigationOptions = createNavigationOptions(
    i18n.t('HomePage::Log In'),
    null,
    null,
    false
);

// @ts-ignore
HomePage.path = ''; //override path for better web URLs

export default withNavigation(HomePage);
