import { createNavigator, SwitchRouter } from '@react-navigation/core';
import { defaultWebStackNavigationOptions } from '../../../libs/nav/config';
import { createStackNavigator } from '../../../libs/nav/navigators';
import routes from '../../../routes';
import IntegrationsPage from './Integrations';
import PeoplePage from './People';
import SettingsPage from './Spaces/SettingsPage';
import SpaceSettingsMenu from './SpaceSettingsMenu';

const getScreen = (baseRoute: any, screen: { path: any }) => {
    return {
        [`${baseRoute}`]: {
            screen: createStackNavigator(
                {
                    [`${baseRoute}/main`]: {
                        screen: screen,
                        navigationOptions: (_props: any) => {
                            return {
                                header: null,
                            };
                        },
                        path: 'edit',
                    },
                },
                {
                    initialRouteName: `${baseRoute}/main`,
                    defaultNavigationOptions: defaultWebStackNavigationOptions,
                }
            ),
            path: screen.path,
        },
    };
};

const SettingsTab = createNavigator(
    SpaceSettingsMenu,
    SwitchRouter({
        ...getScreen(routes.TAB_SPACE_SETTINGS_GENERAL, SettingsPage),
        ...getScreen(routes.TAB_SPACE_SETTINGS_PEOPLE, PeoplePage),
        ...getScreen(routes.TAB_SPACE_SETTINGS_INTEGRATIONS, IntegrationsPage),
    }),
    {
        initialRouteName: routes.TAB_SPACE_SETTINGS_GENERAL,
    }
);

// @ts-ignore
SettingsTab.path = 'settings'; //override path for better web URLs

export default SettingsTab;
