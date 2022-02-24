import IntegrationsConsolePage from "./IntegrationsConsolePage";
import routes from "../../routes";
import SelectRestrictedSpacesPage from "./SelectRestrictedSpacesPage";
import CreateIntegrationPage from "./CreateIntegrationPage";
import EditIntegrationPage from "./EditIntegrationPage";
import { createStackNavigator } from "../../libs/nav/navigators";

const IntegrationsConsoleStack = createStackNavigator(
    {
        [routes.INTEGRATIONS_CONSOLE_MAIN]: {
            screen: IntegrationsConsolePage,
            path: '',
            navigationOptions: IntegrationsConsolePage.navigationOptions,
        },
        [routes.INTEGRATIONS_CONSOLE_EDIT]: {
            screen: EditIntegrationPage,
            path: 'edit',
            navigationOptions: EditIntegrationPage.navigationOptions,
        },
        [routes.INTEGRATIONS_CONSOLE_CREATE]: {
            screen: CreateIntegrationPage,
            path: 'new',
            navigationOptions: CreateIntegrationPage.navigationOptions,
        },        
        [routes.INTEGRATIONS_CONSOLE_SELECT_SPACES]: {
            screen: SelectRestrictedSpacesPage,
            path: 'spaces',
            navigationOptions: SelectRestrictedSpacesPage.navigationOptions,
        },
    },
    // Stack Nav options.
    {
        headerMode: 'screen',
        mode: 'modal',
        initialRouteName: routes.INTEGRATIONS_CONSOLE_MAIN,        
    }
);

// @ts-ignore
IntegrationsConsoleStack.path = 'integrations/console'; // override path for better web URLs

export default IntegrationsConsoleStack;