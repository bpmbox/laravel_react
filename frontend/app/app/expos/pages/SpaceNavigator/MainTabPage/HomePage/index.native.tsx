import get from 'lodash/get';
import React from 'react';
import { NavHeaderSpaceSwitcher } from '../../../../components/Navigation/NavButtons';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { createStackNavigator } from '../../../../libs/nav/navigators';
import { isMobilePlatform } from '../../../../libs/platform';
import routes from '../../../../routes';
import NativeIntegrationPage from './NativeIntegrationPage';

const navigationOptions = isMobilePlatform ? {
    navigationOptions: ({ navigation }: any) => {
        return get(navigation, 'state.params.pageId', '') === '' ?
            {
                // We have to use headerLeft to set the whole header bar for being able to handle long space name
                headerLeft: () => <NavHeaderSpaceSwitcher navigation={navigation} />
            } : {}
        }
    } : {};

const routeConfigMap = {
    [routes.INTEGRATIONS_NATIVE]: {
        screen: NativeIntegrationPage,
        ...navigationOptions
    },
};

const stackConfig = {
    initialRouteName: routes.INTEGRATIONS_NATIVE,
    defaultNavigationOptions: defaultStackNavigationOptions
};

export default createStackNavigator(
    routeConfigMap,
    stackConfig
);
