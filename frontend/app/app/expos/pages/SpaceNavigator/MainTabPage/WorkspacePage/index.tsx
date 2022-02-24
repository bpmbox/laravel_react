import { createNavigator, SwitchRouter } from '@react-navigation/core';
import get from 'lodash/get';
import React from 'react';
import { View } from 'react-native';
import DesktopPageHeader from '../../../../components/UIKit/items/DesktopPageHeader';
import routes from '../../../../routes';
import IntegrationsSplitPage from './IntegrationsSplitPage';
import NativeIntegrationPage from './NativeIntegrationPage';

const WorkspacePage = createNavigator(
    IntegrationsSplitPage,
    SwitchRouter(
        {
            [routes.INTEGRATIONS_NATIVE_INDEX]: {
                screen: NativeIntegrationPage,
                navigationOptions: ({ navigation }: any) => {
                    return ({
                        headerLeft: () => <DesktopPageHeader title={navigation.navigationOptions.title} />,
                        headerTitle: () => <View />,
                    });
                },
                path: '',
                // Note: all 3 set to the same key in order to trigger rerender when
                // switching integrations.
                key: routes.INTEGRATIONS_NATIVE,
            },
            [routes.INTEGRATIONS_NATIVE_SELECTED_INTEGRATION]: {
                screen: NativeIntegrationPage,
                navigationOptions: ({ navigation }: any) => {
                    return ({
                        headerLeft: () => <DesktopPageHeader title={navigation.navigationOptions.title} />,
                        headerTitle: () => <View />,
                    });
                },
                path: ':integrationId',
                key: routes.INTEGRATIONS_NATIVE,
            },
            [routes.INTEGRATIONS_NATIVE]: {
                screen: NativeIntegrationPage,
                navigationOptions: ({ navigation }: any) => {
                    const title = get(navigation, 'navigationOptions.title', '');
                    return ({
                        headerLeft: () => <DesktopPageHeader title={title} />,
                        headerTitle: () => <View />,
                    });
                },
                path: ':integrationId/:pageId',
                key: routes.INTEGRATIONS_NATIVE,
            }
        }
    ),
    {
        initialRouteName: routes.INTEGRATIONS_NATIVE_INDEX,
    }
);

// @ts-ignore
WorkspacePage.path = 'workspace';

export default WorkspacePage;
