import React from 'react';
import { NavHeaderSpaceSwitcher } from '../../../../components/Navigation/NavButtons';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { createStackNavigator } from '../../../../libs/nav/navigators';
import routes from '../../../../routes';
import IntegrationsListPage from './IntegrationsListPage';
import NativeIntegrationPage from './NativeIntegrationPage';

const routeConfigMap = {
    [routes.INTEGRATIONS_LIST]: {
        screen: IntegrationsListPage,
        navigationOptions: ({navigation}: any) => ({
            // We have to use headerLeft to set the whole header bar for being able to handle long space name
            headerLeft: () => <NavHeaderSpaceSwitcher navigation={navigation} />
        })
    },
    [routes.INTEGRATIONS_NATIVE_INDEX]: {
        screen: NativeIntegrationPage,
        path: '',
    },
    [routes.INTEGRATIONS_NATIVE_SELECTED_INTEGRATION]: {
        screen: NativeIntegrationPage,
        path: ':integrationId',
    },
    [routes.INTEGRATIONS_NATIVE]: {
        screen: NativeIntegrationPage,
        path: ':integrationId/:pageId',
    }
};

const stackConfig = {
    initialRouteName: routes.INTEGRATIONS_LIST,
    defaultNavigationOptions: defaultStackNavigationOptions
};

export default createStackNavigator(
    routeConfigMap,
    stackConfig
);
