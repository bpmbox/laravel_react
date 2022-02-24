/* istanbul ignore file */

import SendBird, {
    BaseChannel,
    BaseMessageInstance,
    ChannelHandler,
    FileMessage,
    GroupChannel,
    GroupChannelListQuery,
    OpenChannel,
    OpenChannelListQuery,
    PreviousMessageListQuery,
    SendBirdError,
    SendBirdInstance,
    User as SendBirdUser,
    UserMessage,
} from 'sendbird';
import { EventEmitter } from 'events';
import { Notification } from 'react-native-firebase/notifications';
import find from 'lodash/find';
import i18n from '../../i18n';
import authService, { AUTH_EVENTS } from '../auth';
import spaceService from '../space';
import { formatDisplayName, formatDisplayNameBare } from '../../libs/user-utils';
//import userService from '../user';

/**
 * Constants representing different types of events that can be emitted
 * by the service.
 */
export const CHAT_EVENTS = {
    CONNECTED: 'CONNECTED',
    CONVERSATION_CREATED: 'CONVERSATION_CREATED',
    CONVERSATION_DELETED: 'CONVERSATION_DELETED',
    CONVERSATION_STATE_CHANGED: 'CONVERSATION_STATE_CHANGED',
    DISCONNECTED: 'DISCONNECTED',
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
    MESSAGE_SENT: 'MESSAGE_SENT',
    STATE_UPDATED: 'STATE_UPDATED',
};

/**
 * an empty User object that can be used when user info is unavailable
 */
export const STUB_USER: NSChat.User = {
    id: '',
    avatarUrl: '',
    connectionStatus: '',
    fullName: '?',
    isActive: false,
    lastSeenAt: '',
    _sbUser: null,
};

/**
 * default number of messages max to receive in a previous-messages query
 */
export const MESSAGE_LIMIT_DEFAULT = 30;

/**
 * The chat service itself.
 * This is extended by ChatService in index / index.native.ts to implement various
 * platform-specific behavior.
 */
export class BaseChatService extends EventEmitter {
    __sb: SendBirdInstance | null = null; // reference to Sendbird library; not to be used by clients
    __connectionPromise: Promise<any> = null;
    __channelHandler: ChannelHandler = null;
    __connected: boolean = false;

    /**
     * Chat service is not connected until connect() / waitForConnection() are called.
     */
    constructor() {
        super();
        this.__sb = new SendBird({
            appId: process.env.REACT_APP_SENDBIRD_APP_ID,
        });
        this.__channelHandler = new this.__sb.ChannelHandler();

        authService.addListener(AUTH_EVENTS.LOGOUT, this.disconnect);
    }

    async channelAddMember(channel: NSChat.Conversation, user: User): Promise<void> {
        // Note: This function's current implementation is misleading.
        // Sendbird's API actually does not allow us to "add" another user other
        // than the current user to a channel; the user must "enter" it themselves.
        // So currently this function ignores the 'user' parameter and always
        // implicitly adds the current user as the member to the channel.
        // We should revisit this once we have more clarity on Sendbird open channels.
        if (!channel || !channel._sbChannel || !channel.isChannel || !user) {
            return;
        }
        const sbOpenChannel = channel._sbChannel as OpenChannel;
        sbOpenChannel.enter((response: OpenChannel, error: SendBirdError) => {
            if (error) {
                throw error;
            } else {
                // TODO: emit event?
            }
        });
    }

    async channelRemoveMember(channel: NSChat.Conversation, user: User): Promise<void> {
        if (!channel || !channel._sbChannel || !channel.isChannel || !user) {
            return;
        }
        const sbOpenChannel = channel._sbChannel as OpenChannel;
        sbOpenChannel.exit((response: OpenChannel, error: SendBirdError) => {
            if (error) {
                throw error;
            } else {
                // TODO: emit event?
            }
        });
    }

    /**
     * Connects to the chat server backend if not already connected.
     * Note that the connection will not be completed until the caller waits for the
     * returned promise to resolve; use waitForConnection() if you need this.
     * Notifies listeners of CONNECTED on completion.
     */
    async connect(userId: string, accessToken: string): Promise<NSChat.User> {
        this.__connectionPromise = new Promise((resolve, reject) => {
            if (!userId) {
                console.error('ChatService', 'UserID is required.');
                reject(i18n.t('UserID is required.'));
                return;
            }

            this.__sb.connect(userId, accessToken, (sbUser: SendBirdUser, error: SendBirdError) => {
                if (error) {
                    console.error('ChatService', 'Login failed:', error);
                    reject(i18n.t('Login failed.'));
                } else {
                    this.__connected = true;
                    const user = this._sbUserToUser(sbUser);
                    resolve(user);
                    this.emit(CHAT_EVENTS.CONNECTED, {
                        user: user,
                    });
                }
            });
        });

        return this.__connectionPromise;
    }

    /**
     * Creates a new open chat channel with the given name, and returns it.
     * If a channel already exists with that name, that same channel is returned.
     * Notifies listeners of CONVERSATION_CREATED on completion.
     */
    async createChannel(
        space: Space,
        name: string,
        description: string,
        isPrivate: boolean,
        operatorUserIdList: string[]
    ): Promise<NSChat.Conversation> {
        await this.waitForConnection();
        const that = this;

        // NOTE: all metadata values MUST be type string, else Sendbird will throw exception
        const metadata = {
            description: description,
            isPrivate: String(isPrivate),
            spaceId: space.id,
            spaceSlug: space.slug,
            spaceName: space.name,
        };

        // Use space ID as channel's "custom type"; this is used as a filter later.
        // Without this, queries to get channels will include all channels from ALL spaces!
        const channelType = space.id;

        return new Promise((resolve, reject) => {
            this.__sb.OpenChannel.createChannelWithOperatorUserIds(
                name,
                '',
                null,
                operatorUserIdList,
                channelType,
                (sbChannel: OpenChannel, error: SendBirdError) => {
                    if (error) {
                        reject(error);
                    } else {
                        // store isPrivate and space info as metadata in Sendbird channel object
                        sbChannel.updateMetaData(
                            metadata,
                            /* upsertIfNotExist */ true,
                            (_response, mdError: SendBirdError) => {
                                if (mdError) {
                                    reject(mdError);
                                } else {
                                    const channel = that._sbOpenChannelToConversation(sbChannel, metadata);
                                    resolve(channel);
                                    that.emit(CHAT_EVENTS.CONVERSATION_CREATED, {
                                        conversation: channel,
                                    });
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    /**
     * Creates a new chat conversation for the given users, and returns the conversation.
     * If a conversation already exists for these users, that same conversation is returned.
     * Notifies listeners of CONVERSATION_CREATED on completion.
     */
    async createConversation(space: Space, inviteUserIdList: string[]): Promise<NSChat.Conversation> {
        await this.waitForConnection();
        const that = this;

        // NOTE: all metadata values MUST be type string, else Sendbird will throw exception
        const metadata = {
            spaceId: space.id,
            spaceSlug: space.slug,
            spaceName: space.name,
        };

        return new Promise((resolve, reject) => {
            this.__sb.GroupChannel.createChannelWithUserIds(
                inviteUserIdList,
                /* isDistinct */ true,
                (sbChannel: GroupChannel, error: SendBirdError) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (space) {
                            // store space info in Sendbird channel object
                            sbChannel.updateMetaData(
                                metadata,
                                /* upsertIfNotExist */ true,
                                (_response, mdError: SendBirdError) => {
                                    if (mdError) {
                                        reject(mdError);
                                    } else {
                                        const conversation = that._sbGroupChannelToConversation(sbChannel);
                                        resolve(conversation);
                                        that.emit(CHAT_EVENTS.CONVERSATION_CREATED, {
                                            conversation: conversation,
                                        });
                                    }
                                }
                            );
                        }
                    }
                }
            );
        });
    }

    /**
     * Creates a new chat conversation for the given users, and returns the conversation.
     * This is similar to the above createConversation function, except we use the given
     * User objects to create and populate the conversation and fill in the perspective.
     * If a conversation already exists for these users, that same conversation is returned.
     * Notifies listeners of CONVERSATION_CREATED on completion.
     */
    async createConversationWithUsers(space: Space, currentUser: User, users: User[]): Promise<NSChat.Conversation> {
        users = users.concat(currentUser);

        // BUG: spaceService.getMembers doesn't seem to work when passed a list of user IDs?
        // const memberships: SpaceServiceTypes.MembershipWithChat[] = await spaceService.getMembers(
        //     space,
        //     users.map(user => user.id)
        // );

        // TODO: REMOVE
        let memberships: SpaceServiceTypes.MembershipWithChat[] = await spaceService.getMembers(space);
        const userIdSet = new Set(users.map(user => user.id));
        memberships = memberships.filter(member => userIdSet.has(member.member.id));
        // TODO: REMOVE end

        const myMembership = memberships.filter(member => member.member.id === currentUser.id)[0];
        if (!myMembership) {
            console.warn('Cannot get my membership');
        }

        let conversation = await this.createConversation(
            space,
            memberships.map(member => member.chat.userId)
        );
        conversation = this.setConversationPerspective(conversation, memberships, currentUser);

        return conversation;
    }

    /**
     * Deletes the given conversation.
     * Notifies listeners of CONVERSATION_DELETED on completion.
     * Note that actual deletion of conversations cannot be done in Sendbird except
     * through their web management console; instead, we "hide" the conversation, which
     * makes it impossible to send messages to it and hides it from Sendbird's list
     * of group channels that are returned by other API calls.
     */
    async deleteConversation(conversation: NSChat.Conversation): Promise<any> {
        if (!conversation._sbChannel.isGroupChannel()) {
            return;
        }
        const gc = conversation._sbChannel as GroupChannel;
        return new Promise((resolve, reject) => {
            gc.hide(/* hidePreviousMessages */ true, /* allowAutoUnhide */ true, (response, error: SendBirdError) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                    this.emit(CHAT_EVENTS.CONVERSATION_DELETED, {
                        conversation: conversation,
                    });
                }
            });
        });
    }

    /**
     * Disconnects from the chat server if connected.
     * Notifies listeners of DISCONNECTED on completion.
     */
    async disconnect() {
        if (this.__connected) {
            this.removeAllListeners(CHAT_EVENTS.MESSAGE_RECEIVED);
            this.__sb.removeAllChannelHandlers();

            this.__connectionPromise = null;
            await this.__sb.disconnect();
            this.__connected = false;
            this.emit(CHAT_EVENTS.DISCONNECTED);
        }
    }

    /**
     * Returns the open chat channel with the given ID,
     * or null if the ID is not found.
     */
    async getChannelById(channelId: string, shouldGetMetadata?: boolean): Promise<NSChat.Conversation> {
        await this.waitForConnection();
        const that = this;
        return new Promise((resolve, reject) => {
            const sb = SendBird.getInstance();
            sb.OpenChannel.getChannel(channelId, (sbChannel: OpenChannel, error: SendBirdError) => {
                if (error) {
                    return reject(error);
                } else if (shouldGetMetadata) {
                    sbChannel.getAllMetaData((metadata, mdError) => {
                        if (mdError) {
                            reject(mdError);
                        } else {
                            const channel = that._sbOpenChannelToConversation(sbChannel, metadata);
                            resolve(channel);
                        }
                    });
                } else {
                    const channel = that._sbOpenChannelToConversation(sbChannel);
                    resolve(channel);
                }
                const channel = that._sbOpenChannelToConversation(sbChannel);
                resolve(channel);
            });
        });
    }

    /**
     * Returns the chat conversation with the given ID,
     * or null if the ID is not found.
     */
    async getConversationById(conversationId: string, shouldGetMetadata?: boolean): Promise<NSChat.Conversation> {
        await this.waitForConnection();
        const that = this;
        return new Promise((resolve, reject) => {
            const sb = SendBird.getInstance();
            sb.GroupChannel.getChannel(conversationId, (sbChannel: GroupChannel, error: SendBirdError) => {
                if (error) {
                    return reject(error);
                } else if (shouldGetMetadata) {
                    sbChannel.getAllMetaData((metadata, mdError) => {
                        if (mdError) {
                            reject(mdError);
                        } else {
                            const conversation = that._sbGroupChannelToConversation(sbChannel, metadata);
                            resolve(conversation);
                        }
                    });
                } else {
                    const conversation = that._sbGroupChannelToConversation(sbChannel);
                    resolve(conversation);
                }
                const conversation = that._sbGroupChannelToConversation(sbChannel);
                resolve(conversation);
            });
        });
    }

    getConversationIdFromNotification(notification: Notification): string | null {
        // TODO: payload.sendbird.channel cannot exist because payload.sendbird is a string?
        let payload: any = notification.data;
        if (payload.sendbird && payload.sendbird.channel && payload.sendbird.channel.channel_url) {
            return payload.sendbird.channel.channel_url;
        } else {
            return null;
        }
    }

    /**
     * Fetches and returns the list of all available conversations and channels in the given space.
     * If the ensureLastMessages parameter is passed and set to true, this call will also retrieve
     * the last message sent to each conversation, suitable for preview in an inbox page list.
     * Doing so requires additional roundtrips to the server, which is why we make it optional here.
     */
    async getConversationList(space: Space, ensureLastMessages?: boolean): Promise<NSChat.Conversation[]> {
        await this.waitForConnection();
        const groupChannelList: GroupChannel[] = await this._sbGetGroupChannelList(this._sbQueryGroupChannelList());
        const customType = space.id;
        const openChannelList: OpenChannel[] = await this._sbGetOpenChannelList(
            this._sbQueryOpenChannelList(customType)
        );

        // filter out multiple conversations with same members
        // (fixes a bug that showed duplicate conversations)
        const uniqueConversations = new Set();
        const channelUrls = new Set();
        for (const channel of groupChannelList) {
            const membersStr = channel.members
                .map(m => m.userId)
                .sort()
                .join(',');
            if (!uniqueConversations.has(membersStr)) {
                uniqueConversations.add(membersStr);
                channelUrls.add(channel.url);
            }
        }
        let conversationList: NSChat.Conversation[] = groupChannelList
            .filter(channel => channelUrls.has(channel.url))
            .map(this._sbGroupChannelToConversation.bind(this));

        if (openChannelList.length > 0) {
            // process open channels in conversation list
            // BUGBUG: filter out channels that do not belong to this space
            // TODO: change this to filter on Sendbird server
            const channelList: NSChat.Conversation[] = openChannelList
                .filter(channel => channel.customType === customType)
                .map(this._sbOpenChannelToConversation.bind(this));

            if (ensureLastMessages) {
                // fetch last message for every open channel
                await Promise.all(
                    channelList.map(async (channel: NSChat.Conversation) => {
                        await this.getLastMessage(channel);
                        return channel;
                    })
                );
                channelList.sort(this._compareConversations);
            }

            conversationList = conversationList.concat(channelList);
        }

        return conversationList;
    }

    /**
     * Returns a user/space-specific chat mailbox ID suitable for listening
     * using the underlying Sendbird chat implementation.
     */
    getInboxUniqueId(userId: string, spaceId: string): string {
        return `SpaceNavigator_${userId}_${spaceId}`;
    }

    /**
     * Fetches and returns the list of all available open channels.
     */
    async getOpenChannelList(): Promise<NSChat.Conversation[]> {
        await this.waitForConnection();
        const openChannelList: OpenChannel[] = await this._sbGetOpenChannelList(this._sbQueryOpenChannelList());
        return openChannelList.map(this._sbOpenChannelToConversation.bind(this));
    }

    /**
     * Fetches and returns the most recent previous message in the given conversation, if any.
     * Also sets the message as the lastMessage property of the conversation.
     * If the conversation has no messages, returns null.
     */
    async getLastMessage(conversation: NSChat.Conversation, memberships?: Membership[]): Promise<NSChat.Message> {
        const messageList = await this.getPreviousMessageList(conversation, memberships, 1);
        if (messageList && messageList.length > 0) {
            const lastMessage = messageList[0];
            conversation.lastMessage = lastMessage;
            return lastMessage;
        } else {
            return null;
        }
    }

    /**
     * Fetches and returns an array of the 30 most recent previous messages
     * in the given conversation.
     */
    async getPreviousMessageList(
        conversation: NSChat.Conversation,
        memberships?: Membership[],
        messageLimit?: number
    ): Promise<NSChat.Message[]> {
        await this.waitForConnection();
        const sbChannel = conversation._sbChannel as BaseChannel;
        const query = sbChannel.createPreviousMessageListQuery();
        if (typeof messageLimit === 'undefined') {
            messageLimit = MESSAGE_LIMIT_DEFAULT;
        }
        const sbMessages = await this._sbGetMessageList(messageLimit, query);
        let messages: NSChat.Message[] = sbMessages.map(this._sbMessageToMessage.bind(this));
        if (memberships && memberships.length > 0) {
            const setPerspective = this.setMessagePerspective.bind(this);
            messages = messages.map(msg => setPerspective(msg, memberships));
        }
        return messages;
    }

    /**
     * Perform any necessary processing for when a user joins a new space.
     * Specifically, the user must be added as a member to any open channels in the space.
     */
    async handleJoinSpace(space: Space, user: User) {
        // add user as a member of all open channels in space
        const channels = await this.getOpenChannelList();
        await channels.forEach(async channel => {
            if (!channel.isPrivate) {
                await this.channelAddMember(channel, user);
            }
        });
    }

    /**
     * Perform any necessary processing for when a user leaves a space.
     * Specifically, the user must be removed as a member from any open channels in the space.
     */
    async handleLeaveSpace(space: Space, user: User) {
        // add user as a member of all open channels in space
        const channels = await this.getOpenChannelList();
        await channels.forEach(async channel => {
            await this.channelRemoveMember(channel, user);
        });
    }

    /**
     * Returns true if the chat service has finished connecting to the chat server.
     * To halt until the connection is ready, use waitForConnection().
     */
    isConnected(): boolean {
        return this.__connected;
    }

    listenOnMessageReceived(inboxUniqueId: string) {
        const that = this;
        this.__channelHandler.onMessageReceived = (sbChannel, sbMessage) => {
            const conversation = sbChannel.isGroupChannel()
                ? that._sbGroupChannelToConversation(sbChannel as GroupChannel)
                : that._sbOpenChannelToConversation(sbChannel as OpenChannel);
            const message = that._sbMessageToMessage(sbMessage);
            that.emit(CHAT_EVENTS.MESSAGE_RECEIVED, {
                conversation: conversation,
                message: message,
            });
        };

        // Add this channel event handler to the SendBird object.
        this.__sb.addChannelHandler(inboxUniqueId, this.__channelHandler);

        this.listenOnMessageReceivedNative(inboxUniqueId);
    }

    /**
     * Performs any native-specific inbox listening.
     */
    listenOnMessageReceivedNative(_inboxUniqueId: string) {
        // nothing to do in base class
    }

    /**
     * Marks all messages in the given conversation as read.
     * Notifies listeners of CONVERSATION_STATE_CHANGED on completion.
     */
    async markConversationAsRead(conversation: NSChat.Conversation) {
        await this.waitForConnection();
        if (conversation._sbChannel.isGroupChannel && conversation._sbChannel.isGroupChannel()) {
            const sbChannel = conversation._sbChannel as GroupChannel;
            sbChannel.markAsRead();
        }
        conversation.unreadMessageCount = 0;
        this.emit(CHAT_EVENTS.CONVERSATION_STATE_CHANGED, {
            conversation: conversation,
        });
    }

    /**
     * Send an image as a message to the given conversation.
     * Notifies listeners of MESSAGE_SENT on completion.
     */
    async sendImage(conversation: NSChat.Conversation, imageUrl: string): Promise<NSChat.Message> {
        await this.waitForConnection();
        const sbChannel = conversation._sbChannel as BaseChannel;
        if (sbChannel.isGroupChannel()) {
            const sbGroupChannel = conversation._sbChannel as GroupChannel;
            sbGroupChannel.endTyping();
        }

        const that = this;
        return new Promise((resolve, reject) => {
            sbChannel.sendFileMessage(imageUrl, (sbMessage: BaseMessageInstance, error: SendBirdError) => {
                if (error) {
                    reject(error);
                } else {
                    const sbFileMessage = sbMessage as FileMessage;
                    const message = that._sbMessageToMessage(sbFileMessage);
                    conversation.createdAt = message.createdAt;
                    conversation.lastMessage = message;
                    if (message.sender && message.sender.avatarUrl) {
                        conversation.avatarUrl = message.sender.avatarUrl;
                    }
                    resolve(message);
                    that.emit(CHAT_EVENTS.MESSAGE_SENT, {
                        conversation: conversation,
                        message: message,
                    });
                }
            });
        });
    }

    /**
     * Send a message with the given text to the given conversation.
     * Notifies listeners of MESSAGE_SENT on completion.
     */
    async sendMessage(conversation: NSChat.Conversation, messageText: string): Promise<NSChat.Message> {
        await this.waitForConnection();
        const sbChannel = conversation._sbChannel as BaseChannel;
        if (sbChannel.isGroupChannel()) {
            const sbGroupChannel = conversation._sbChannel as GroupChannel;
            sbGroupChannel.endTyping();
        }

        const that = this;
        return new Promise((resolve, reject) => {
            sbChannel.sendUserMessage(messageText, (sbMessage: BaseMessageInstance, error: SendBirdError) => {
                if (error) {
                    reject(error);
                } else {
                    const message = that._sbMessageToMessage(sbMessage);
                    conversation.createdAt = message.createdAt;
                    conversation.lastMessage = message;
                    if (message.sender.avatarUrl) {
                        conversation.avatarUrl = message.sender.avatarUrl;
                    }
                    resolve(message);
                    that.emit(CHAT_EVENTS.MESSAGE_SENT, {
                        conversation: conversation,
                        message: message,
                    });
                }
            });
        });
    }

    /**
     * Puts the app into "background" state so that notifications will be shown.
     */
    setBackgroundState() {
        this.__sb.setBackgroundState();
    }

    /**
     * Puts the app into "foreground" state so that notifications will be not be shown.
     */
    setForegroundState() {
        this.__sb.setForegroundState();
    }

    /**
     * Fills in the given conversation and its member data with correct name/avatar
     * information from the given collection of space memberships.
     * This is needed because the Sendbird chat library has its own notion of user
     * names and avatars, which are not the same as those stored in the Tree backend.
     */
    setConversationPerspective(
        conversation: NSChat.Conversation,
        memberships: SpaceServiceTypes.MembershipWithChat[],
        user?: User
    ): NSChat.Conversation {
        if (!conversation.members || conversation.members.length === 0) {
            // membership info not available; return conversation as-is
            return conversation;
        }

        // make a copy of the conversation to return
        conversation = Object.assign({}, conversation);

        // exclude current user
        // (keep all other existing users, and also all missing members,
        // ones for which _getMembershipByChatId will return null, so that
        // we can display them as deactivated)
        if (user) {
            conversation.members = conversation.members.filter(member => {
                const membership = this._getMembershipByChatId(memberships, member.id);
                return !membership || membership.member.id !== user.id;
            });
        }

        // merge info from Membership into NSChat.User object (name, avatar)
        conversation.members = conversation.members.map(member => {
            const membership = this._getMembershipByChatId(memberships, member.id);

            if (membership) {
                member.fullName = formatDisplayName(membership.member);
                member.avatarUrl = membership.member.avatarUrl || '';
            } else {
                // use Sendbird 'isActive' flag to indicate missing membership in space
                member.isActive = false;
            }
            return member;
        });

        const avatars = conversation.members.map(({ avatarUrl }) => avatarUrl);
        const firstAvatar = avatars.length > 0 ? avatars[0] : '';

        // set conversation's visible name to be a concatenation of the members' names,
        // not including the current user, separated by commas
        const newConversationName = conversation.members
            .map((member: NSChat.User) => {
                if (member.isActive) {
                    return member.fullName;
                } else {
                    return i18n.t('{{memberName}} (deactivated)', {
                        memberName: member.fullName,
                    });
                }
            })
            .join(', ');

        // modify the other appropriate properties
        conversation.avatarUrl = firstAvatar;
        conversation.name = newConversationName;
        conversation.hasPerspective = true;
        return conversation;
    }

    /**
     * Fills in the given message with correct name/avatar information from the
     * matching user in the given collection of space memberships.
     * This is needed because the Sendbird chat library has its own notion of user
     * names and avatars, which are not the same as those stored in the Tree backend.
     */
    setMessagePerspective(
        message: NSChat.Message,
        memberships: SpaceServiceTypes.MembershipWithChat[]
    ): NSChat.Message {
        if (!message) {
            return null;
        }

        if (!message.sender) {
            message.sender = Object.assign({}, message.sender);
        }

        const membership = memberships.find(m => m.chat.userId === message.sender.id);
        if (membership) {
            message = Object.assign({}, message);
            message.sender.fullName = formatDisplayName(membership.member);
            message.sender.avatarUrl = membership.member.avatarUrl;
            message.hasPerspective = true;
        } else {
            if (message.sender) {
                message.sender.isActive = false;
            }
        }
        return message;
    }

    unlistenOnMessageReceived() {
        this.removeAllListeners(CHAT_EVENTS.MESSAGE_RECEIVED);
        this.__sb.removeAllChannelHandlers();
    }

    /**
     * Informs Sendbird backend of a change to the current user's information.
     */
    async updateCurrentUserInfo(newUserInfo: any): Promise<any> {
        await this.waitForConnection();
        const fullName: string =
            newUserInfo.fullName || formatDisplayNameBare(newUserInfo.givenName, newUserInfo.familyName);
        const avatarUrl: string = newUserInfo.avatarUrl || '';
        return new Promise((resolve, reject) => {
            this.__sb.updateCurrentUserInfo(fullName, avatarUrl, (result: SendBird.User, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /*
     * Block until chat service has finished connecting to the chat back-end.
     */
    async waitForConnection() {
        if (this.__connected) {
            return; // already connected
        }
        if (!this.__connectionPromise) {
            throw new Error('ChatService: No connection to wait');
        }

        try {
            return await this.__connectionPromise;
        } catch (err) {
            console.error('ChatService', 'Error connecting to chat server:', err);
            throw new Error(i18n.t('Error when connecting to chat server'));
        }
    }
    
     async nativeOnlyRegisterAnalitics(title:any,space:any,integration:any,pageid:any){
        //const loggedInUser = await userService.getAccount();
        //console.log("Google Analitics"+data+"/"+loggedInUser.id)
        //console.log(loggedInUser)
        // Nothing to do for RN Web
    }
    
    async nativeOnlyRegisterAnalitics_event(data:any,data1:any,data2:any,data3:any) {
        console.log("Google Analitics"+data)
        // Nothing to do for RN Web
    }
    

    async nativeOnlyRegisterPushToken() {
        // Nothing to do for RN Web
    }

    async nativeOnlySendSystemNotification(_conversation: NSChat.Conversation, _message: NSChat.Message, _data?: any) {
        // Nothing to do for RN Web
    }

    // PRIVATE SENDBIRD-SPECIFIC METHODS

    /**
     * Compares conversations based on last-message date/time, breaking ties by name/id.
     * Used to re-sort channels based on last message sent, if any.
     */
    _compareConversations(convA: NSChat.Conversation, convB: NSChat.Conversation) {
        // compare last-message-sent time,
        // breaking ties by conversation-created time,
        // then by name, and then lastly by ID
        const lastA = convA.lastMessage ? convA.lastMessage.createdAt : 0;
        const lastB = convB.lastMessage ? convB.lastMessage.createdAt : 0;
        if (lastA !== lastB) {
            return lastB - lastA;
        }
        if (convA.createdAt !== convB.createdAt) {
            return convA.createdAt - convB.createdAt;
        }
        if (convA.name !== convB.name) {
            return convA.name < convB.name ? -1 : 1;
        }
        return convA.id < convB.id ? -1 : 1;
    }

    _getMembershipByChatId(memberships: SpaceServiceTypes.MembershipWithChat[], chatId: string): Membership {
        return find(memberships, m => m.chat.userId === chatId);
    }

    _sbGroupChannelToConversation(sbGroupChannel: GroupChannel, metadata?: object): NSChat.Conversation {
        if (!sbGroupChannel) {
            return null;
        }
        let members: NSChat.User[] = [];
        if (sbGroupChannel.members && sbGroupChannel.members.length > 0) {
            members = sbGroupChannel.members.map(this._sbUserToUser.bind(this));
        }
        const unreadMessageCount = sbGroupChannel.unreadMessageCount;
        let lastMessage = this._sbMessageToMessage(sbGroupChannel.lastMessage);

        return {
            id: sbGroupChannel.url,
            description: '',
            avatarUrl: '',
            createdAt: sbGroupChannel.createdAt,
            hasPerspective: false,
            isChannel: false,
            isPrivate: true,
            lastMessage: lastMessage,
            members: members,
            name: sbGroupChannel.name,
            unreadMessageCount: unreadMessageCount,
            _sbChannel: sbGroupChannel,
            _metadata: metadata,
        };
    }

    _sbOpenChannelToConversation(sbOpenChannel: OpenChannel, metadata?: object): NSChat.Conversation {
        if (!sbOpenChannel) {
            return null;
        }

        return {
            id: sbOpenChannel.url,
            description: (metadata && (metadata as any).description) || '',
            avatarUrl: '',
            createdAt: sbOpenChannel.createdAt,
            isChannel: true,
            isPrivate: !!(metadata && (metadata as any).isPrivate === 'true'),
            hasPerspective: false,
            lastMessage: null,
            members: [], // TODO
            name: sbOpenChannel.name,
            unreadMessageCount: 0,
            _sbChannel: sbOpenChannel,
            _metadata: metadata,
        };
    }

    _sbMessageToMessage(sbMessage: BaseMessageInstance): NSChat.Message {
        if (!sbMessage) {
            return null;
        }

        let messageText = '';
        let messageType = 'message';
        let sender = null;
        if (sbMessage.isUserMessage && sbMessage.isUserMessage()) {
            const userMessage = sbMessage as UserMessage;
            sender = this._sbUserToUser(userMessage.sender);
            messageText = userMessage.message;
        } else if (sbMessage.isFileMessage && sbMessage.isFileMessage()) {
            const fileMessage = sbMessage as FileMessage;
            sender = this._sbUserToUser(fileMessage.sender);
            messageType = 'image';
            messageText = fileMessage.url; // url field stores URL where image was uploaded
        }

        return {
            id: String(sbMessage.messageId),
            conversationId: sbMessage.channelUrl,
            type: messageType,
            sender: sender,
            createdAt: sbMessage.createdAt,
            message: messageText,
            hasPerspective: false,
            _sbMessage: sbMessage,
        };
    }

    // example payload:
    // {
    //     "data": {
    //         "message": "John Smith: hello there!",
    //         "sendbird": "{\"custom_type\":\"\",\"channel\":{\"custom_type\":\"\",\"name\":\"Group Channel\",\"channel_url\":\"sendbird_group_channel_25778855_cc962b61b88b0e666b8bcebeb2bc5fcc8523f3e4\"},\"created_at\":1583954529368,\"message_id\":265173331,\"message\":\"Hello there\",\"type\":\"MESG\",\"unread_message_count\":8,\"audience_type\":\"only\",\"sender\":{\"profile_url\":\"https:\\/\\/s3.ap-northeast-1.amazonaws.com\\/dev-uploads.withtree.com\\/user\\/avatar\\/62123467-078e-4e54-929b-0143e882f48d-1574722286.jpg\",\"name\":\"John Smith\",\"id\":\"54af5b3c-5da3-4507-82c3-799fcf712345\"},\"push_sound\":\"default\",\"translations\":{},\"recipient\":{\"name\":\"Jane Smith\",\"push_template\":\"default\",\"id\":\"3d6b553c-5950-464c-b91c-4eed38bb123e\"},\"files\":[],\"category\":\"messaging:offline_notification\",\"channel_type\":\"messaging\",\"mentioned_users\":[],\"app_id\":\"50ED52A9-6334-4503-A0FE-791652982893\"}"
    //     },
    //     "from": "1036637834439",
    //     "messageId": "0:1583954529559874%70953eadf9fd7ecd",
    //     "sentTime": 1583954529551,
    //     "ttl": 2419200
    // }
    async _sbNotificationParse(payload: any) {
        if (payload.data && payload.data.sendbird) {
            const sendbirdData = JSON.parse(payload.data.sendbird);
            const message = this._sbNotificationMessageToMessage(sendbirdData);
            if (!message) {
                return;
            }

            const conversation = await this.getConversationById(message.conversationId, true);
            if (!conversation) {
                return;
            }

            this.nativeOnlySendSystemNotification(conversation, message);
        }
    }

    // loosely typed notification object
    // https://docs.sendbird.com/javascript/push_notifications#3_step_3_receive_fcm_notification_messages
    _sbNotificationMessageToMessage(sbMessage: any): NSChat.Message {
        if (!sbMessage) {
            return null;
        }

        let messageType = 'message';
        let messageText = sbMessage.message;
        if (String(sbMessage.type).toLowerCase() === 'file') {
            messageType = 'image';
            if (sbMessage.files && sbMessage.files.length > 0) {
                // for image/video messages, media are represented as 'files' in an array of the following format:
                // files= [{"mentioned_user_ids":[],"req_id":"843275096","size":0,"edge_ts":38476098708432,"custom":"","name":"",
                //          "mention_type":"users","thumbnails":[],"type":"","channel_id":90670179,
                //          "url":"https://..."}]
                messageText = sbMessage.files[0].url || '';
            }
        }

        return {
            id: String(sbMessage.message_id),
            conversationId: sbMessage.channel ? sbMessage.channel.channel_url : '',
            type: messageType,
            sender: this._sbNotificationUserToUser(sbMessage.sender),
            createdAt: sbMessage.created_at,
            message: messageText,
            hasPerspective: false,
            _sbMessage: sbMessage,
        };
    }

    _sbNotificationUserToUser(sbUser: any): NSChat.User {
        if (!sbUser) {
            return null;
        }

        return {
            id: sbUser.id,
            avatarUrl: sbUser.profile_url,
            connectionStatus: 'nonavailable',
            fullName: sbUser.name,
            isActive: false,
            lastSeenAt: '',
            _sbUser: sbUser,
        };
    }

    _sbUserToUser(sbUser: SendBirdUser): NSChat.User {
        if (!sbUser) {
            return null;
        }
        return {
            id: sbUser.userId,
            avatarUrl: sbUser.profileUrl,
            connectionStatus: sbUser.connectionStatus,
            fullName: sbUser.nickname,
            isActive: sbUser.isActive,
            lastSeenAt: sbUser.lastSeenAt,
            _sbUser: sbUser,
        };
    }

    _sbGetGroupChannel(channelUrl: string): Promise<GroupChannel> {
        return new Promise((resolve, reject) => {
            this.__sb.GroupChannel.getChannel(channelUrl, (channel: GroupChannel, error: SendBirdError) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(channel);
                }
            });
        });
    }

    _sbGetGroupChannelList(query: GroupChannelListQuery): Promise<GroupChannel[]> {
        return new Promise((resolve, reject) => {
            query.next((sbChannels, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(sbChannels);
                }
            });
        });
    }

    _sbGetOpenChannelList(query: OpenChannelListQuery): Promise<OpenChannel[]> {
        return new Promise((resolve, reject) => {
            query.next((sbChannels, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(sbChannels);
                }
            });
        });
    }

    _sbGetMessageList(
        messageLimit: number,
        previousMessageListQuery: PreviousMessageListQuery
    ): Promise<BaseMessageInstance[]> {
        const reverse = true;
        return new Promise((resolve, reject) => {
            previousMessageListQuery.load(messageLimit, reverse, (sbMessages, error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(sbMessages);
                }
            });
        });
    }

    _sbQueryGroupChannelList(): GroupChannelListQuery {
        let query = this.__sb.GroupChannel.createMyGroupChannelListQuery();
        query.includeEmpty = true;
        query.order = 'latest_last_message';
        return query;
    }

    _sbQueryOpenChannelList(customType?: string): OpenChannelListQuery {
        let query = this.__sb.OpenChannel.createOpenChannelListQuery();
        if (customType) {
            query.customType = customType;
        }
        return query;
    }

    _sbQueryPreviousMessageList(conversation: NSChat.Conversation): PreviousMessageListQuery {
        const sbChannel = conversation._sbChannel as BaseChannel;
        return sbChannel.createPreviousMessageListQuery();
    }
}
