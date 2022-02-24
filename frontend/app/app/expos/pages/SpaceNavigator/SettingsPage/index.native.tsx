import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { createStackNavigator } from '../../../libs/nav/navigators';
import routes from '../../../routes';
import SelectAccountPage from '../../AccountSettings/SelectAccountPage';
import AccountSettingsPage from '../../AccountSettings';
import SettingsMobileMainPage from './SettingsMobileMainPage';
import IntegrationsPage from './Integrations';
import CategoriesPage from './Integrations/Marketplace/CategoriesPage';
import IntegrationsByCategory from './Integrations/Marketplace/IntegrationsByCategory';
import PeoplePage from './People';
import SpaceMenuPage from './Spaces/MenuPage';
import SpaceSettingsPage from './Spaces/SettingsPage';
import UserPolicyPage from './UserPolicyPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TestPage from './TestPage';

const routeConfigMap = {
    [routes.SETTINGS_MAIN]: {
        screen: SettingsMobileMainPage,
    },
    [routes.SETTINGS_ACCOUNT_SELECT]: {
        screen: SelectAccountPage,
    },
    [routes.SETTINGS_ACCOUNT_GENERAL]: {
        screen: AccountSettingsPage,
    },    
    [routes.SETTINGS_SPACE_MENU]: {
        screen: SpaceMenuPage,
    },
    [routes.SETTINGS_SPACE_GENERAL]: {
        screen: SpaceSettingsPage,
    },
    [routes.SETTINGS_SPACE_PEOPLE]: {
        screen: PeoplePage,
    },
    [routes.SETTINGS_SPACE_INTEGRATIONS]: {
        screen: IntegrationsPage,
    },
    [routes.INTEGRATIONS_MARKETPLACE_ALL_CATEGORIES]: {
        screen: CategoriesPage,
    },
    [routes.INTEGRATIONS_MARKETPLACE_CATEGORY]: {
        screen: IntegrationsByCategory,
    },
    [routes.SETTINGS_USER_POLICY]: {
        screen: UserPolicyPage,
    },
    [routes.SETTINGS_PRIVACY_POLICY]: {
        screen: PrivacyPolicyPage,
    },
    [routes.SETTINGS_TEST]: {
        screen: TestPage,
    },
};

const stackConfig = {
    initialRouteName: routes.SETTINGS_MAIN,
    navigationOptions: {
        header: null,
    },
    defaultNavigationOptions: defaultStackNavigationOptions,
};

export default createStackNavigator(routeConfigMap, stackConfig);
