// TODO: move this file to chat service dir.

declare namespace NSChat {
    interface ChatContext {
        activeConversation: Conversation;
        setActiveConversation: (activeConversation: Conversation) => void;
        memberships: SpaceServiceTypes.MembershipWithChat[];
        conversations: Conversation[];
        isChatContextReady: boolean;
        myMembership: SpaceServiceTypes.MembershipWithChat;
        forceChatRefresh: () => Promise<void>;
    }

    interface ChatEventPayload {
        conversation: NSChat.Conversation;
        message?: NSChat.Message;
    }

    /**
     * Represents a conversation or open channel.
     *
     * A conversation represents a private communication between two or more users.
     * Represented internally by a Sendbird GroupChannel.
     *
     * An open channel is one users can join or leave to have a shared conversation,
     * similar to a channel like #developers or #general on Slack.
     * Represented internally by a Sendbird OpenChannel.
     */
    interface Conversation {
        id: string; // a URL
        description: string;
        avatarUrl?: string;
        createdAt: number;
        hasPerspective: boolean; // whether Channel has been filled in with info from WW backend memberships
        isChannel: boolean;
        isPrivate: boolean; // TODO: move up
        lastMessage?: Message;
        members: User[];
        name: string;
        unreadMessageCount: number;
        _sbChannel?: any; // internal Sendbird channel object; not to be used by clients
        _metadata?: any; // internal Sendbird metadata object; not to be used by clients
    }

    interface Message {
        id: string;
        conversationId?: string; // Sendbird channel URL
        type: string; // 'message' | 'image'
        sender?: User;
        createdAt: number; // Unix timestamp
        message: string; // message text (if message) or image URL (if image)
        hasPerspective: boolean; // whether Message has been filled in with info from WW backend memberships
        _sbMessage?: any; // internal Sendbird message object; not to be used by clients
    }

    interface User {
        id: string;
        avatarUrl?: string;
        connectionStatus: string;
        fullName: string;
        isActive: boolean;
        lastSeenAt: string;
        _sbUser?: any; // internal Sendbird user object; not to be used by clients
    }
}
