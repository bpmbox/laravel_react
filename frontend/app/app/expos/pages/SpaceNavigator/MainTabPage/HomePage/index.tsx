import { createNavigator, SwitchRouter } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import DesktopPageHeader from '../../../../components/UIKit/items/DesktopPageHeader';
import routes from '../../../../routes';
import DesktopContainerPage from './DesktopContainerPage';
import NativeIntegrationPage from './NativeIntegrationPage';

const HomePage = createNavigator(
    DesktopContainerPage,
    SwitchRouter(
        {
            // Note: 2 routes, with different paths, but same screen.  This is to support
            // optionality in the pageId parameter.  We can have an index page '/home'
            // or we could be viewing a child page '/home/:pageId'.
            [routes.INTEGRATIONS_NATIVE_INDEX]: {
                screen: NativeIntegrationPage,
                navigationOptions: (props: any) => {
                    return ({
                        headerLeft: () => <DesktopPageHeader title={props.navigationOptions.title} />,
                        headerTitle: () => <View />,
                    })
                },
                path: 'home',
                // Note: both set to the same key in order to update when child page
                // events are handled.
                key: routes.INTEGRATIONS_NATIVE,
            },
            [routes.INTEGRATIONS_NATIVE]: {
                screen: NativeIntegrationPage,
                navigationOptions: (props: any) => {
                    return ({
                        headerLeft: () => <DesktopPageHeader title={props.navigationOptions.title} />,
                        headerTitle: () => <View />,
                    });
                },
                path: 'home/:pageId',
                key: routes.INTEGRATIONS_NATIVE,
            }
        }
    ),
    {
        initialRouteName: routes.INTEGRATIONS_NATIVE_INDEX,
    }
);

// @ts-ignore
HomePage.path = 'view'; //override path for better web URLs

export default HomePage;
