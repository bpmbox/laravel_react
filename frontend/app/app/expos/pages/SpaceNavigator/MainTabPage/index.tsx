import {
    createNavigator,
    SwitchRouter,
    getActiveChildNavigationOptions
} from '@react-navigation/core';
import routes from '../../../routes';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import Calendar from './Calender';

import WorkspacePage from './WorkspacePage';
import SettingsPage from '../SettingsPage';
import SideBarNavView from './SideBarNavView';

const MainTab = createNavigator(
    SideBarNavView,
    SwitchRouter({
        [routes.TAB_HOME]: HomePage,        
        [routes.TAB_CHAT]: ChatPage,
        [routes.TAB_WORKSPACE]: WorkspacePage,
        [routes.TAB_SPACE_SETTINGS]: SettingsPage,

        // This is a work around to allow us to click on the 'Home' icon
        // to return back to entry page.
        [routes.TAB_HOME + '_']: HomePage,
    }, {
        initialRouteName: routes.TAB_HOME,
    }), {
        navigationOptions: ({navigation, screenProps}) => {
            const options = getActiveChildNavigationOptions(navigation, screenProps);
            return { title: options.title };
        }
    }
);

export default MainTab;
