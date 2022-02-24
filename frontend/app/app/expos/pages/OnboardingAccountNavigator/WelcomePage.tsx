import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import Button from '../../components/UIKit/items/Button';
import Heading from '../../components/UIKit/items/Heading';
import Spacer from '../../components/UIKit/items/Spacer';
import Text from '../../components/UIKit/items/Text';
import Bottom from '../../components/UIKit/Layout/Bottom';
import Center from '../../components/UIKit/Layout/Center';
import Page from '../../components/UIKit/Layout/Page';
import routes from '../../routes';
import { ButtonType, ItemHeight, ItemWidth } from '../../theme.style';
import authService from '../../services/auth';
import historyService from '../../services/history';
import messageService from '../../services/message';
import { isMobilePlatform } from '../../libs/platform';
//import i18n from '../../i18n';
//import { createNavigationOptions } from '../../components/Navigation/NavButtons';

const DesktopLayout = ({ header, buttons }) => (
    <Page>
        <Center>
            {header}
            <Spacer height={ItemHeight.large} />
            <View style={styles.desktopLayoutView}>{buttons}</View>
        </Center>
    </Page>
);

const MobileLayout = ({ header, buttons }) => (
    <Page>
        <Center>{header}</Center>
        <Bottom>
            {buttons}
            <Spacer height={ItemHeight.small} />
        </Bottom>
    </Page>
);

const WelcomePage = () => {
    const { t } = useTranslation('OnboardingAccountIndexPage');
    const gotoNextPage = () => {
        if(isMobilePlatform){
            historyService.push(routes.ONBOARDING_ACCOUNT_AGREEMENT);
        }else{
            historyService.push(routes.ONBOARDING_ACCOUNT_ENTER_DETAILS);
        }
    };

    const handleLogOut = async () => {
        try {
            await authService.logout();
            historyService.navigateAsRoot(routes.LOGIN_HOME);
        } catch (err) {
            messageService.sendError(t`Error logging out.`);
        }
    };

    const header = (
        <>
            {/* <Icon svgIconId={IconId.illustrations_balloons_blue_centered} iconSize={IconSize.xxlarge} /> */}
            <Heading text={t`Welcome!`} h1 center tall desktopWidth={ItemWidth.narrow} desktopCenterItem={true} />
            <Spacer height={ItemHeight.xsmall} />
            <Text
                text={t`Before we get started,\ntell us a bit about yourself`}
                light
                small
                center
                narrow
                desktopWidth={ItemWidth.narrow}
                desktopCenterItem={true}
            />
            <Spacer />
        </>
    );

    const buttons = (
        <>
            <Button
                onPress={gotoNextPage}
                text={t`Set up My Account`}
                narrow
                desktopWidth={ItemWidth.narrow}
                desktopCenterItem={true}
            />
            <Button
                onPress={handleLogOut}
                text={t('Switch Account')}
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
    desktopLayoutView: {
        maxWidth: ItemWidth.narrow.valueOf(),
        width: '100%',
    },
});

WelcomePage.navigationOptions = () => ({
    header: null,
});

// @ts-ignore
WelcomePage.path = 'welcome'; //override path for better web URLs

export default WelcomePage;
