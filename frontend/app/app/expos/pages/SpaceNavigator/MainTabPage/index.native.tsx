import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { IconId } from '../../../assets/native/svg-icons';
import Icon from '../../../components/UIKit/Icon';
import routes from '../../../routes';
import { Color, IconSize, IconType } from '../../../theme.style';
import ChatPage from './ChatPage';
import HomePage from './HomePage';
import WorkspacePage from './WorkspacePage';
import Calender from './Calender';


/**
 * Tabbed stack for handling sub pages.
 */
const MainTab = createBottomTabNavigator(
    {
        [routes.TAB_HOME]: HomePage,
        [routes.TAB_CHAT]: ChatPage,
        [routes.TAB_WORKSPACE]: WorkspacePage,
    },
    {
        navigationOptions: {
            header: null,
        },
        //ナビゲーションからデータの取得
        defaultNavigationOptions: ({ navigation }: any) => {
            let tabBarVisible = true;
            let currentRouteName = navigation.state.routes[navigation.state.index].routeName;
            if (currentRouteName === routes.TAB_CHAT_CONVERSATION) {
                tabBarVisible = false;
            }

            return {
                tabBarIcon: ({ focused }: any) => {
                    const { routeName } = navigation.state;

                    if (routeName === routes.TAB_HOME) {
                        return (
                            <Icon
                                svgIconId={
                                    focused ? IconId.feather_home_filled_black : IconId.feather_home_stroke_accent4
                                }
                                iconType={IconType.plain}
                                iconSize={IconSize.medium}
                            />
                        );
                    } else if (routeName === routes.TAB_CHAT) {
                        return (
                            <Icon
                                svgIconId={
                                    focused ? IconId.feather_chat_filled_black : IconId.feather_chat_stroke_accent4
                                }
                                iconType={IconType.plain}
                                iconSize={IconSize.medium}
                            />
                        );
                    } else if (routeName === routes.TAB_WORKSPACE) {
                        return (
                            <Icon
                                svgIconId={
                                    focused ? IconId.feather_grid_filled_black : IconId.feather_grid_stroke_accent4
                                }
                                iconType={IconType.plain}
                                iconSize={IconSize.medium}
                            />
                        );
                    }
                },
                tabBarVisible: tabBarVisible,
            };
        },
        tabBarOptions: {
            showLabel: false,
            style: {
                borderTopColor: Color.white.valueOf(),
            },
            inactiveTintColor: Color.accent4.valueOf(),
        },
        initialRouteName: routes.TAB_HOME,
    }
);

export default MainTab;
