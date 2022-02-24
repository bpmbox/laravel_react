/* istanbul ignore file */
import React, { FunctionComponent, Component } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { withNavigation } from '@react-navigation/core';
import historyService from '../../../services/history';
import i18n from '../../../i18n';
import { Dimensions } from 'react-native';
import WebView from '../../../components/UIKit/items/WebView';

const deviceHeight = Dimensions.get('screen').height;

const TestPage: FunctionComponent<NavigationInjectedProps> = () => {
    return (
        <WebView
            sourceUri={'https://www.google.com/'}
            height={deviceHeight-50}
        />
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('TestPage::テスト'),
    };
};

// @ts-ignore
TestPage.navigationOptions = navigationOptions;

// @ts-ignore
TestPage.path = 'test'; //override path for better web URLs

export default withNavigation(TestPage);
