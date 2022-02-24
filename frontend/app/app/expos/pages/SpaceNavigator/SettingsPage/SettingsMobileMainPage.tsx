import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { IconId } from '../../../assets/native/svg-icons';
import { createNavigationOptions, ModalButtonType } from '../../../components/Navigation/NavButtons';
import SectionHeading from '../../../components/UIKit/items/SectionHeading';
import SimpleListItem from '../../../components/UIKit/items/SimpleListItem';
import Divider from '../../../components/UIKit/items/Divider';
import Text from '../../../components/UIKit/items/Text';
import Page from '../../../components/UIKit/Layout/Page';
import i18n from '../../../i18n';
import { isMobilePlatform } from '../../../libs/platform';
import routes from '../../../routes';
import historyService from '../../../services/history';
import { appVersion } from '../../../libs/version';

/**
 * This page is the Settings menu page we see when a user clicks on the settings icon on mobile.
 */
const SettingsMobileMainPage: FunctionComponent<NavigationInjectedProps> = props => {
    const { t } = useTranslation('SettingsMainPage');

    historyService.setNavigation(props.navigation);

    const openWhatsNew = () => { Linking.openURL('https://www.notion.so/withtree/Changelog-0db269bf680a4c81aaf9d38cd023fddd') }
    // const openPrivacy = () => { Linking.openURL('https://www.withtree.com/privacy/') }
    // const openTwitter = () => { Linking.openURL('https://twitter.com/withtree') }
    const openAccounts = () => {
        historyService.push(routes.SETTINGS_ACCOUNT_SELECT);
    };

    const openSystemSettings = () => {
        Linking.openSettings();
    };

    const openContact = () => {
        Linking.openURL('mailto:tree@mitsuifudosan.co.jp?subject=Tree%20Feedback');
    };

    const openUserPolicy = () => {
        historyService.push(routes.SETTINGS_USER_POLICY);
    };

    const openPrivacyPolicy = () => {
        historyService.push(routes.SETTINGS_PRIVACY_POLICY);
    };

    const openTest = () => {
        historyService.push(routes.SETTINGS_TEST);
    };

    return (
        <Page scrollable>
            <SimpleListItem
                testID="AccountsMenuItem"
                text={t`Accounts`}
                iconId={IconId.feather_profile_filled_success}
                onPress={openAccounts}
            />

            {isMobilePlatform && (
                <>
                    <SectionHeading text={t`Preferences`} />
                    <SimpleListItem
                        text={t`System Authorizations`}
                        iconId={IconId.feather_settings_filled_success}
                        onPress={openSystemSettings}
                    />
                </>
            )}
            <SectionHeading text={t`Support`} />
            {/* Temporary hide this section because the current info is Workwell and some features do not exist in Tree anymore.
            TODO: Reactive once we have new content
            Ref: https://www.notion.so/withtree/Transitions-to-Tree-Temporary-hide-What-s-new-link-in-Support-section-181776a07dc44043a8cd3a22f26c8682
            */}
            <SimpleListItem text={t`What's new`} iconId={IconId.feather_star_filled_success} onPress={openWhatsNew} />
            <SimpleListItem text={t`利用規約`} iconId={IconId.feather_exclamation_filled_success} onPress={openUserPolicy} />
            <SimpleListItem text={t`プライバシーポリシー`} iconId={IconId.feather_lock_filled_success} onPress={openPrivacyPolicy} />
            <SimpleListItem text={t`Send Feedback`} iconId={IconId.feather_send_filled_success} onPress={openContact} />
            <SimpleListItem text={t`テスト`} iconId={IconId.feather_test_filled_success} onPress={openTest} />
            {/* <SimpleListItem text={t`Terms and Privacy`} iconId={IconId.feather_file_filled_success} onPress={openPrivacy} /> */}
            {/* <SimpleListItem text={t`Twitter @withtree`} iconId={IconId.feather_twitter_filled_success} onPress={openTwitter} /> */}
            {!!appVersion && <Text text={t('Version: {{version}}', { version: appVersion })} center light small />}
        </Page>
    );
};

// @ts-ignore
SettingsMobileMainPage.navigationOptions = createNavigationOptions(
    i18n.t('SettingsMainPage::Settings'),
    ModalButtonType.close
);

export default withNavigation(SettingsMobileMainPage);
