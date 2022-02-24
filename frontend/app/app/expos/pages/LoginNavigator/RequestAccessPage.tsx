import React, { FunctionComponent, useCallback } from 'react';
import { Platform, StyleSheet, View, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavigationInjectedProps } from 'react-navigation';
import { withNavigation } from '@react-navigation/core';
import Icon from '../../components/UIKit/Icon';
import Page from '../../components/UIKit/Layout/Page';
import Center from '../../components/UIKit/Layout/Center';
import Bottom from '../../components/UIKit/Layout/Bottom';
import Button from '../../components/UIKit/items/Button';
import Spacer from '../../components/UIKit/items/Spacer';
import i18n from '../../i18n';
import { IconId } from '../../assets/native/svg-icons';
import { ButtonType, FontSize, IconSize, ItemHeight, ItemWidth } from '../../theme.style';
import { createNavigationOptions } from '../../components/Navigation/NavButtons';
import Text from '../../components/UIKit/items/Text';
import { isMobilePlatform } from '../../libs/platform';


const DesktopLayout = ({ header, buttons, subtext }) => (
    <Page>
        <Center>
            {header}
            <Spacer height={ItemHeight.small} />
            <View style={{ maxWidth: ItemWidth.xnarrow.valueOf(), width: '100%' }}>
                {buttons}
            </View>

            <Text text={subtext} mini light center />
        </Center>
    </Page>
);

const MobileLayout = ({ header, buttons, subtext }) => (
    <Page>
        <Center style={styles.loginPage}>{header}</Center>
        <Bottom>
            {buttons}
            <Text text={subtext} mini light center />
            <Spacer />
        </Bottom>
    </Page>
);

const RequestAccessPage: FunctionComponent<NavigationInjectedProps> = props => {
    const { t } = useTranslation('RequestAccessPage', { i18n });

    const gotoRequestAccessForm = useCallback(() => {
        const typeformUrl = 'https://withtree.typeform.com/to/yM6Mhm';
        if (isMobilePlatform) {
            Linking.openURL(typeformUrl)
        } else {
            window.open(typeformUrl, '_blank');
        }
    }, []);

    const header = (
        <>
            <Icon
                svgIconId={IconId.logo_tree_logo_border_sunrise}
                iconSize={IconSize.large}
            />
            <Spacer height={ItemHeight.small} />
            <Text
                text={t('Tree is currently in closed beta.')}
                textSize={FontSize.h4}
                center
                narrow
            />
        </>
    );

    const subtext = t('We will notify you once ready.');

    const buttons = (
        <>
            <Button
                testID="RequestAccessButton"
                onPress={gotoRequestAccessForm}
                text={t('Request Early Access')}
                type={ButtonType.success}
                narrow
                desktopWidth={ItemWidth.narrow}
                desktopCenterItem={true}
            />
        </>
    );

    return Platform.select({
        web: () => <DesktopLayout header={header} buttons={buttons} subtext={subtext} />,
        ios: () => <MobileLayout header={header} buttons={buttons} subtext={subtext} />,
        android: () => <MobileLayout header={header} buttons={buttons} subtext={subtext} />,
    })();
};

const styles = StyleSheet.create({
    loginPage: {
        flex: 9,
        marginBottom: 80,
    },
});

// @ts-ignore
RequestAccessPage.navigationOptions = createNavigationOptions(
    i18n.t('RequestAccessPage::Request Access'),
    null,
    { hideHeaderOnDesktop: true },
    false
);

export default withNavigation(RequestAccessPage);
