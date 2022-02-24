/* istanbul ignore file */
import React, { FunctionComponent} from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { withNavigation } from '@react-navigation/core';
import historyService from '../../../services/history';
import i18n from '../../../i18n';
import { Dimensions } from 'react-native';
import WebView from '../../../components/UIKit/items/WebView';

const deviceHeight = Dimensions.get('screen').height;

const UserPolicyPage: FunctionComponent<NavigationInjectedProps> = () => {
    return (
        <WebView
            sourceUri={'https://treelabs2.github.io/tree-documents/#/tree-tos'}
            height={deviceHeight-50}
        />
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('UserPolicyPage::利用規約'),
    };
};

// @ts-ignore
UserPolicyPage.navigationOptions = navigationOptions;

// @ts-ignore
UserPolicyPage.path = 'userpolicy'; //override path for better web URLs

export default withNavigation(UserPolicyPage);
