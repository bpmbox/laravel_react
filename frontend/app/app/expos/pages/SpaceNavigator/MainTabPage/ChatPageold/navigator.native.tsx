import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { createStackNavigator } from '../../../../libs/nav/navigators';
import routes from '../../../../routes';
import ConversationPage from './ConversationPage';
import CreateChannelPage from './CreateChannelPage';
import ConversationSettingsPage from './ConversationSettingsPage';
import InboxPage from './InboxPage';

// It's quite tricky here, with item in tabbar we can handle header,
// so we create Stack which contains 1 page here for being able to control header
const routeConfigMap = {
    [routes.TAB_CHAT_INBOX]: InboxPage,
    [routes.TAB_CHAT_CONVERSATION]: ConversationPage,
    [routes.TAB_CHAT_CREATE_CHANNEL]: CreateChannelPage,
    [routes.TAB_CHAT_CONVERSATION_SETTINGS]: ConversationSettingsPage,
};

const stackConfig = {
    initialRouteName: routes.TAB_CHAT_INBOX,
    defaultNavigationOptions: defaultStackNavigationOptions,
    navigationOptions: ({ navigation }: any) => {
        // Because here, the ChatPage still belongs to TabNav
        // so we can handle the visibility of bottom tab
        let tabBarVisible = true;
        let currentRouteName = navigation.state.routes[navigation.state.index].routeName;
        if (currentRouteName === routes.TAB_CHAT_CONVERSATION) {
            tabBarVisible = false;
        }

        return {
            tabBarVisible,
        };
    },
};

const ChatStack = createStackNavigator(routeConfigMap, stackConfig);

export default ChatStack;
