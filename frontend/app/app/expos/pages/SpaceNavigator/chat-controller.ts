import React, { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import i18n from '../../i18n';
import { formatDisplayName } from '../../libs/user-utils';
import routes from '../../routes';
import chatService, { CHAT_EVENTS } from '../../services/chat';
import historyService from '../../services/history';
import messageService from '../../services/message';
import spaceService from '../../services/space';
import { SpaceContextState } from './index';

/**
 * Displays alert message when a new chat message is received when the app is in the foreground.
 */
function withDisplayChatNotification(spaceContextState: SpaceContextState) {
    // This is actually a higher order hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(
        async (chatPayload: NSChat.ChatEventPayload) => {
            const conversation: NSChat.Conversation = chatPayload.conversation;
            const message: NSChat.Message = chatPayload.message;
            // Check that we have a valid space.
            if (!spaceContextState.space) {
                return;
            }
            let currentRoute = historyService.currentRouteName;

            if (
                currentRoute === routes.TAB_CHAT_CONVERSATION ||
                currentRoute === routes.TAB_CHAT_EMPTY_CONVERSATION ||
                currentRoute === routes.TAB_CHAT_LAST_CONVERSATION ||
                currentRoute === routes.TAB_CHAT_INBOX
            ) {
                // We don't display inApp notification if the current screen is the inbox
                // or the conversation linked to the incoming message
                return;
            }

            if (!message) {
                return;
            }

            let chatSenderId: string = message.sender ? message.sender.id : '';
            const chatMemberIds = conversation.members.map(user => user.id);
            try {
                const members = await spaceService.getMembers(spaceContextState.space, chatMemberIds);
                const senderMembership: Membership = members.find(
                    (m: SpaceServiceTypes.MembershipWithChat) => m.chat.userId === chatSenderId
                );
                if (senderMembership) {
                    messageService.sendMessage(i18n.t('ChatController::{{name}}: {{message}}', {
                        name: formatDisplayName(senderMembership.member),
                        message: message.message,
                    }));
                }
            } catch (err) {
                console.error('error sending in-app notification:', err);
            }
        },
        [spaceContextState.space]
    );
}

/**
 * Initializes the chat service.
 * Makes a connection to the chat backend for the given user and space.
 */
export function withInitChat(
    spaceContextState: SpaceContextState,
    t: typeof i18n.t,
    currentUser: User,
    setIsChatServiceReady: React.Dispatch<React.SetStateAction<boolean>>
) {
    const spaceId = spaceContextState.space ? spaceContextState.space.id : null;
    const displayChatNotification = withDisplayChatNotification(spaceContextState);

    // This is actually a higher order hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(async (): Promise<void> => {
        if (!spaceId) {
            return;
        }

        const spaceInfo = await spaceService.getInfoById(spaceId);
        const chatInfo = spaceInfo.chat;
        if (!chatInfo) {
            console.error('Unable to find chat info');
            messageService.sendError(t('Unable initialize the chat'));
            return;
        }
        try {
            chatService.disconnect();
            chatService.connect(chatInfo.userId, chatInfo.accessToken);
            const inboxUniqueId = chatService.getInboxUniqueId(currentUser.id, spaceId);
            // Start to listen for chat messages
            chatService.listenOnMessageReceived(inboxUniqueId);
            chatService.addListener(CHAT_EVENTS.MESSAGE_RECEIVED, displayChatNotification);
            chatService.nativeOnlyRegisterPushToken();
            //chatService.nativeOnlyRegisterAnalitics("chatController")
            setIsChatServiceReady(true);
        } catch (err) {
            console.error('Unable to login to chat service. Error:', err);
            messageService.sendError(t('Unable to login to chat service'));
        }
    }, [currentUser, displayChatNotification, setIsChatServiceReady, spaceId, t]);
}

// TODO: I belive this could be moved into App.native.tsx, with a tiny bit
// of refactoring.  -- DL
export function withInitChatHandleAppState() {
    const handleAppStateChange = (state: AppStateStatus) => {
        if (state === 'active') {
            chatService.setForegroundState();
        } else if (state === 'background') {
            chatService.setBackgroundState();
        }
    };

    // This is actually a higher order hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Listener should be added only once!
        AppState.addEventListener('change', handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);
}
