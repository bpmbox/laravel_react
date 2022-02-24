import React, { useCallback, useContext, useEffect, useState } from 'react';
import useListener from '../../../../libs/use-listener';
import chatService, { CHAT_EVENTS } from '../../../../services/chat';
import spaceService from '../../../../services/space';
import { SpaceContext } from '../../SpaceContext';
import ChatContext from './ChatContext';
import ChatNavigator from './navigator';
import AuthStore from '../../../../store/auth';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
//import gql from 'graphql-tag';
import defaultTo from 'lodash/defaultTo';

//global から取得に変更
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * This component implements the ChatContext provider.
 * It keeps track of the overall list of chat conversations and memberships for the space.
 * It serves as the "one source of truth" for information about chat conversations.
 */
const ChatNavigatorWithContext = props => {
    const { space } = useContext(SpaceContext);
    const { currentUser, isAuthenticated } = AuthStore.useContainer();

    const [activeConversation, setActiveConversation] = useState<NSChat.Conversation>();
    let [conversations, setConversations] = useState<NSChat.Conversation[]>([]);
    const [memberships, setMemberships] = useState<SpaceServiceTypes.MembershipWithChat[]>([]);
    const [myMembership, setMyMembership] = useState<SpaceServiceTypes.MembershipWithChat>(null);
    const [isLoadingConversations, setLoadingConversations] = useState<boolean>(true);
    const [isLoadingMemberships, setLoadingMemberships] = useState<boolean>(true);
    const [missingUserIDs, setMissingUserIDs] = useState<Set<string>>(new Set());
 //   const client = new ApolloClient({
 //       link: createHttpLink({ uri: defaultTo(process.env.REACT_APP_GRAPHQL_URL, 'http://localhost:8000/graphql') }),
 //       cache: new InMemoryCache(),
 //   });

    /**
     * comment out bcos application is crashed by graphql loop
     * check 211
     */

    /*
    for (let x in conversations) {
        let _imgUrl = '';

        let res = client
            .query({
                query: gql`
      query{
  getmeta(name:"${conversations[x].id}")
}
`,
            })
            .then(result => {
                res = result.data.getmeta.imgUrl;
                console.log('chat/index.tsx');
                console.log(result.data.getmeta);
                let jso = result.data.getmeta.replace(/'/g, '"');
                jso = JSON.parse(jso);
                console.log(jso.imgUrl);
                _imgUrl = jso.imgUrl;
                let teamName = jso.teamName;

                conversations[x].avatarUrl = _imgUrl;
                const c1 = conversations[x].name.split(',');
                const results = conversations[x].name.substr(0, 16);
                //const cname = conversations[x].name
                if (teamName !== '') {
                    conversations[x].name = 'Team ' + teamName + '(' + c1.length + ')';
                } else {
                    if (conversations[x].name.length > 10) {
                        conversations[x].name = results + '(' + c1.length + ')';
                    }
                }

                //console.log(conversations[x]._metadata)
                // this.setState({isShowingText: _imgUrl});
                //console.log(jso)
                return _imgUrl;
            });
    }
*/

    /**
     * Make sure that every conversation in the given array has a valid perspective,
     * meaning that its inner state representing members, avatars, etc. are up to date
     * and have valid names and URLs based on our objects rather than Sendbird's
     */
    // スペースを取得していてるのだからMETAをみている？
    const ensurePerspectives = useCallback(
        async (allConversations: NSChat.Conversation[]) => {
            if (!isAuthenticated || !allConversations) {
                return allConversations;
            }

            // figure out which conversations need perspective
            const rawConversations = allConversations.filter(conv => !conv.hasPerspective);

            const existingChatMemberIds = new Set();
            memberships.forEach(m => {
                existingChatMemberIds.add(m.chat.userId);
            });

            // get all user IDs that are displayed in the chats that we don't have yet
            const neededChatMemberIds: Set<string> = new Set(
                rawConversations
                    .filter(conversation => conversation.members)
                    .map(conversation =>
                        conversation.members.filter(
                            user => !existingChatMemberIds.has(user.id) && !missingUserIDs.has(user.id)
                        )
                    )
                    .reduce((accumulator, users) => accumulator.concat(users), [])
                    .map(user => user.id)
            );

            // fetch memberships (if we don't already have all the ones we need)
            let allMemberships = memberships;
            let myCurrentMembership = myMembership;
            if (neededChatMemberIds.size > 0) {
                setLoadingMemberships(true);
                const newMemberships: SpaceServiceTypes.MembershipWithChat[] = await spaceService.getMembers(
                    space,
                    Array.from(neededChatMemberIds)
                );
                allMemberships = memberships.concat(newMemberships);

                // any user IDs that are still missing are marked as missing,
                // so we won't wait forever for them to resolve
                let foundMissingUser = false;
                allMemberships.forEach(m => {
                    if (m.chat) {
                        neededChatMemberIds.delete(m.chat.userId);
                        if (missingUserIDs.has(m.chat.userId)) {
                            // previously missing user is now present;
                            // user was possibly re-added to space
                            missingUserIDs.delete(m.chat.userId);
                            foundMissingUser = true;
                        }
                    }
                });
                if (foundMissingUser || neededChatMemberIds.size > 0) {
                    const newMissingUserIDs = new Set([
                        ...Array.from(missingUserIDs),
                        ...Array.from(neededChatMemberIds),
                    ]);
                    setMissingUserIDs(newMissingUserIDs);
                }

                // store 'my' membership so I can be excluded from chat conversation names
                if (myMembership === null) {
                    myCurrentMembership = allMemberships.find(
                        (m: SpaceServiceTypes.MembershipWithChat) => m.member.id === currentUser.id
                    );
                    setMyMembership(myCurrentMembership);
                }
                setMemberships(allMemberships);
            }

            // fill in perspective info for the raw conversations that need it
            const fixPerspectiveIfNeeded = (conversation: NSChat.Conversation) => {
                if (conversation.hasPerspective || conversation.isChannel) {
                    return conversation; // TODO
                } else {
                    return chatService.setConversationPerspective(
                        conversation as NSChat.Conversation,
                        allMemberships,
                        myCurrentMembership ? myCurrentMembership.member : null
                    );
                }
            };

            const convsWithPerspectives = allConversations.map(fixPerspectiveIfNeeded);
            setLoadingMemberships(false);
            return convsWithPerspectives;
        },
        [currentUser, missingUserIDs, isAuthenticated, memberships, myMembership, space]
    );

    /**
     * Downloads all chat conversations for current user and then fetches/merges
     * membership data from the backend into those conversations.
     */
    const fetchAllConversations = useCallback(async () => {
        setLoadingConversations(true);
        try {
            // NOTE: for now, we don't fetch last message snippets from open channels
            // to save on server roundtrips
            const rawConversations: NSChat.Conversation[] = await chatService.getConversationList(space, false);
            const conversationsWithPerspectives = await ensurePerspectives(rawConversations);
            setConversations(conversationsWithPerspectives);
        } catch (err) {
            console.error('Unable to load conversations. Error:', err);
        }
        setLoadingConversations(false);
    }, [ensurePerspectives, space]);

    /**
     * Forces the chat context to completely reinitialize itself, downloading
     * all conversations and messages and memberships again.
     * This is costly but can help to resync the state of the chat service with what
     * is found in Sendbird in some edge cases.
     */
    const forceChatRefresh = useCallback(async () => {
        await fetchAllConversations();
    }, [fetchAllConversations]);

    /**
     * Update the current conversation when a new message is sent or received.
     * Most importantly we need to update the last message sent date/snippet and
     * the count of unread messages.
     */
    const updateConversation = useCallback(
        async args => {
            const argConversation: NSChat.Conversation = args.conversation;
            const argMessage: NSChat.Message = args.message;
            let updatedConversation: NSChat.Conversation = conversations.find(
                conversation => conversation.id === argConversation.id
            );
            if (!updatedConversation) {
                updatedConversation = Object.assign({}, argConversation);
            }

            // fill in conversation perspective if absent
            // (typically for newly created conversations)
            if (!updatedConversation.hasPerspective) {
                const convsWithPerspectives = await ensurePerspectives([updatedConversation]);
                if (convsWithPerspectives && convsWithPerspectives.length > 0) {
                    updatedConversation = convsWithPerspectives[0];
                }
            }

            const hasNewMessage =
                updatedConversation.createdAt === 0 ||
                (argMessage && argMessage.createdAt !== updatedConversation.createdAt);

            // copy the conversation and fill in the newly updated info
            updatedConversation = Object.assign({}, updatedConversation);
            updatedConversation.createdAt = argConversation.createdAt;
            updatedConversation.lastMessage = argConversation.lastMessage;
            updatedConversation.unreadMessageCount = argConversation.unreadMessageCount;
            if (argMessage) {
                updatedConversation.lastMessage = argMessage;
            }

            // if conversation is new, it will not be in the existing list
            const exists = !!conversations.find(conv => conv.id === updatedConversation.id);

            if (hasNewMessage || !exists) {
                // move to top of list
                const rest = conversations.filter(conversation => conversation.id !== updatedConversation.id);
                setConversations([updatedConversation, ...rest]);
            } else {
                // retain same order but replace the modified conversation
                const updatedConversations = conversations.map(conv =>
                    conv.id === updatedConversation.id ? updatedConversation : conv
                );
                setConversations(updatedConversations);
            }
        },
        [conversations, ensurePerspectives]
    );

    /**
     * Called when a conversation is deleted.
     * Removes that conversation from the list.
     */
    const conversationDeleted = useCallback(
        async args => {
            // remove from list
            const argConversation: NSChat.Conversation = args.conversation;
            const otherConversations = conversations.filter(conversation => conversation.id !== argConversation.id);
            setConversations(otherConversations);
        },
        [conversations]
    );

    // initialization code
    useEffect(() => {
        if (!currentUser || !isAuthenticated) {
            return;
        }

        fetchAllConversations();
    }, [currentUser, fetchAllConversations, isAuthenticated]);

    useListener(chatService, CHAT_EVENTS.CONVERSATION_CREATED, updateConversation);
    useListener(chatService, CHAT_EVENTS.CONVERSATION_DELETED, conversationDeleted);
    useListener(chatService, CHAT_EVENTS.MESSAGE_SENT, updateConversation);
    useListener(chatService, CHAT_EVENTS.MESSAGE_RECEIVED, updateConversation);
    useListener(chatService, CHAT_EVENTS.CONVERSATION_STATE_CHANGED, updateConversation);

    let contextValue: NSChat.ChatContext = {
        activeConversation,
        setActiveConversation,
        memberships,
        myMembership,
        isChatContextReady: !isLoadingConversations && !isLoadingMemberships,
        conversations,
        forceChatRefresh,
    };
    /*
    try {
        for (let x in conversations) {
            let _imgUrl = '';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let teamid = '';

            client
                .query({
                    query: gql`
          query{
      getmeta(name:"${conversations[x].id}")
    }
    `,
                })
                .then(result => {
                    _imgUrl = result.data.getmeta.imgUrl;
                    teamid = result.data.getmeta.teamId;
                    if (_imgUrl != '') {
                        console.log('chat/index.tsx');
                        console.log(result.data.getmeta);
                        let jso = result.data.getmeta.replace(/'/g, '"');
                        //jso = JSON.parse(jso);
                        console.log(jso.imgUrl);
                        _imgUrl = jso.imgUrl;
                        const teamName = jso.teamName;

                        conversations[x].avatarUrl = _imgUrl;
                        const c1 = conversations[x].name.split(',');
                        const results = conversations[x].name.substr(0, 20);
                        //const cname = conversations[x].name

                        if (teamName !== '' && teamName !== undefined) {
                            conversations[x].name = '' + teamName + '(' + c1.length + ')';
                        } else {
                            if (conversations[x].name.length > 20) {
                                conversations[x].name = results + '(' + c1.length + ')';
                            }
                        }
                    }
                    //console.log(conversations[x]._metadata)
                    // this.setState({isShowingText: _imgUrl});
                    //console.log(jso)
                    return _imgUrl;
                });
        }
    } catch (e) {}
*/
    return (
        <ChatContext.Provider value={contextValue}>
            <ChatNavigator navigation={props.navigation} />
        </ChatContext.Provider>
    );
};

ChatNavigatorWithContext.router = ChatNavigator.router;
ChatNavigatorWithContext.path = 'chat';

export default ChatNavigatorWithContext;
