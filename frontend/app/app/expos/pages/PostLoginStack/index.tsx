import { createStackNavigator } from '../../libs/nav/navigators';
import routes from '../../routes';
import SettingsPage from '../AccountSettings';
import SpaceNavigator from '../SpaceNavigator';
import ChangeEmailPage from '../AccountSettings/ChangeEmailPage';
import ItemPickerPage from '../GeneralPurposeModals/ItemPickerPage';
import IntegrationsConsoleStack from '../IntegrationsConsoleStack';

/**
 * PostLoginStack acts like a wrapper navigation to allow pages that exist
 * outside of SpaceNavigator but exist as a modal to alloow it to popup as
 * a modal above SpaceNavigator pages (most of our main pages).
 */
const PostLoginStack = createStackNavigator(
    {
        // -- Modals --
        [routes.SETTINGS_ACCOUNT_GENERAL_MODAL]: {
            screen: SettingsPage,
            path: 'account',
        },
        [routes.CHANGE_EMAIL]: {
            screen: ChangeEmailPage,
            path: 'email-change',
        },

        // Integration Console
        [routes.INTEGRATIONS_CONSOLE]: {
            screen: IntegrationsConsoleStack,
            path: 'integrations/console',
            navigationOptions: {
                // Hide the header for this navigation for this route.  The
                // screens of this navigator provide their own headers.
                header: null,
            },
        },

        // General Purpose Modals
        // This modal needs to be added to the stack so it's available to <Select> component.
        [routes.ITEM_PICKER]: {
            screen: ItemPickerPage,
            navigationOptions: ItemPickerPage.navigationOptions,
        },

        // This route must be last since it has most general matcher.
        [routes.MAIN]: {
            screen: SpaceNavigator,
            path: ':slug',
            navigationOptions: {
                // Hide the header for this navigation for this route.  The
                // screens of this navigator provide their own headers.
                header: null,
            },
        },
    },
    // Stack Nav options.
    {
        headerMode: 'screen',
        mode: 'modal',
        initialRouteName: routes.MAIN,
    }
);

// @ts-ignore
PostLoginStack.path = ''; // override path for better web URLs

export default PostLoginStack;
