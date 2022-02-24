import React from 'react';
import { createNavigator, SwitchRouter } from '@react-navigation/core';
import { View } from 'react-native';
import routes from '../../../../routes';
import ChatSplitPage from './ChatSplitPage';
import ConversationPage from './ConversationPage';
import ConversationSettingsPage from './ConversationSettingsPage';
import EmptyConversationPage from './EmptyConversationPage';
import LastConversationPage from './LastConversationPage';
import DesktopPageHeader from '../../../../components/UIKit/items/DesktopPageHeader';
import { PARAM_CONVERSATION } from '../../../../constants';

const ChatTab = createNavigator(
    ChatSplitPage,
    SwitchRouter({
        [routes.TAB_CHAT_LAST_CONVERSATION]: {
            screen: LastConversationPage,
            path: '',
        },
        [routes.TAB_CHAT_EMPTY_CONVERSATION]: {
            screen: EmptyConversationPage,
            path: '',
        },
        [routes.TAB_CHAT_CONVERSATION_SETTINGS]: {
            screen: ConversationSettingsPage,
            path: `:${PARAM_CONVERSATION}/settings`,
        },
        [routes.TAB_CHAT_CONVERSATION]: {
            screen: ConversationPage,
            navigationOptions: (props: any) => {
                return {
                    headerLeft: () => <DesktopPageHeader title={props.navigationOptions.title} />,
                    headerTitle: () => <View />,
                };
            },
            path: `:${PARAM_CONVERSATION}`,
        },
    }),
    {
        initialRouteName: routes.TAB_CHAT_LAST_CONVERSATION,
    }
);

export default ChatTab;
