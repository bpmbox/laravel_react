import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RefreshControl, View } from 'react-native';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { NavHeaderPlusButton, NavHeaderSpaceSwitcher } from '../../../../components/Navigation/NavButtons';
import InboxItem from '../../../../components/UIKit/items/InboxItem';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Page from '../../../../components/UIKit/Layout/Page';
import { isMobilePlatform } from '../../../../libs/platform';
import { PARAM_CONVERSATION, PARAM_ON_SELECTION_DONE } from '../../../../constants';
import routes from '../../../../routes';
import { ItemHeight } from '../../../../theme.style';
import { SpaceContext } from '../../SpaceContext';
import chatService from '../../../../services/chat';
import AuthStore from '../../../../store/auth';
import { log } from '../../../../services/log/log';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import EmptyPage from '../../../General/EmptyPage';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FullPageLoading from '../../../General/FullPageLoading';
import ChatContext from './ChatContext';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import gql from 'graphql-tag';
import defaultTo from 'lodash/defaultTo';

const InboxPage: FunctionComponent<any> = props => {
    const { t } = useTranslation('Chat::InboxPage');
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    const { currentUser } = AuthStore.useContainer();
    const [refreshing, setRefreshing] = React.useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const client = new ApolloClient({
        link: createHttpLink({
            uri: defaultTo(process.env.REACT_APP_GRAPHQL_URL, 'http://localhost:8000/graphql'),
        }),
        cache: new InMemoryCache(),
    });

    let { activeConversation, setActiveConversation, isChatContextReady, conversations, forceChatRefresh } = useContext(
        ChatContext
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const createChatConversation = useCallback(
        //ここでTEAMI名があればいい
        async (users: User[]) => {
            let conversation = await chatService.createConversationWithUsers(space, currentUser, users);
            const lg = new log();
            lg.updatemeta(conversation.id, global['teamName'], global['img']);
            console.log('create chate members data in this point ');
            //lg.se
            /*
            await client
                .query({
                    query: gql`
      query{
  getmeta(name:"${conversation.id}")
}
`,
                })
                .then(result => {
                    result.data.getmeta.imgUrl;
                    console.log(result.data.getmeta);
                    let jso = result.data.getmeta.replace(/'/g, '"');
                    //global.lg.sendBirdLog("sss",jso)
                    jso = JSON.parse(jso);
                    console.log(jso.imgUrl);
                    let _imgUrl = jso.imgUrl;

                    conversation.avatarUrl = _imgUrl;
                    console.log(conversation.avatarUrl);

                    console.log(jso);
                    return _imgUrl;
                });
*/

            setActiveConversation(conversation);

            // navigate convaer sation with id
            //ここで return site
            navigation.navigate(routes.TAB_CHAT_CONVERSATION, {
                [PARAM_CONVERSATION]: conversation.id,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentUser, space]
    );

    useEffect(() => {
        const onPressDirectMessage = () => {
            //Alert.alert('onPressDirectMessage people.picker');
            navigation.navigate(routes.PEOPLE_PICKER, {
                allowMulti: true,
                excludedUsers: [currentUser],
                [PARAM_ON_SELECTION_DONE]: (selection: User[]) => {
                    //Alert.alert('INbox 96 create User from now');
                    // Selected Peaple create Chat
                    // where selection
                    if (selection && selection.length > 0) {
                        createChatConversation(selection);
                    }
                },
                title: t`チャット作成`,
            });
        };

        const navPlusIcon = <NavHeaderPlusButton onPress={onPressDirectMessage} />;

        navigation.setParams({
            icons: navPlusIcon,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const gotoChatConversationPage = useCallback(
        async (conversation: NSChat.Conversation) => {
            if (conversation.isChannel) {
                // make sure current user is a member of the channel
                await chatService.channelAddMember(conversation, currentUser);
            }

            setActiveConversation(conversation);
            //console.log(conversation.id);
            navigation.navigate(routes.TAB_CHAT_CONVERSATION, {
                [PARAM_CONVERSATION]: conversation.id,
            });
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentUser]
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await forceChatRefresh();
        setRefreshing(false);
    }, [forceChatRefresh]);

    if (conversations.length === 0) {
        if (!isChatContextReady || refreshing) {
            //   return <FullPageLoading />;
        } else {
            //   return <EmptyPage message={t`No conversations.`} />;
        }
    }
    /*
    for (let x in conversations) {
        try {
            let _imgUrl = '';

            client
                .query({
                    query: gql`
                query{
                    getmeta(name:"${conversations[x].id}")
                }
                `,
                })
                .then(result => {
                    try {
                        //let res = result.data.getmeta.imgUrl;
                        let jso = result.data.getmeta.replace(/'/g, '"');
                        //global.lg.sendBirdLog("sss",jso)
                        jso = JSON.parse(jso);
                        _imgUrl = jso.imgUrl;

                        conversations[x].avatarUrl = _imgUrl;
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        //this.setState(state => ({
                        //    counter2: this.state.counter2 + 1,
                        //}));
                    } catch (e) {
                        console.log('Data Err 177 Inbox');
                    }
                    return _imgUrl;
                });
        } catch (e) {}
    }
    */
    // @ts-ignore
    return (
        // @ts-ignore
        <Page scrollable async refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {conversations.map((conversation: NSChat.Conversation) => {
                const leftIconInitial: string = conversation.isChannel ? '#' : null;
                const selected = !isMobilePlatform && activeConversation && conversation.id === activeConversation.id;
                // console.dir(conversation)
                let name = conversation.name;
                //if (!isMobilePlatform && conversation.isChannel) {
                    name = 'ここで#' + name + '======';
                //}
                let snippet = '';
                let date: Date = null;
                if (conversation.lastMessage) {
                    if (conversation.lastMessage.type === 'image') {
                        snippet = t`Image sent`;
                    } else {
                        snippet = conversation.lastMessage.message;
                    }
                    date = new Date(conversation.lastMessage.createdAt);
                }

                console.log('InboxPage' + conversation.id);

                //const {counter1, counter2} = this.state;
                return (
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: 340 }}>
                                <InboxItem
                                    key={conversation.id}
                                    name={name}
                                    snippet={snippet}
                                    date={date}
                                    unreadCount={conversation.unreadMessageCount}
                                    avatarUrl={conversation.avatarUrl}
                                    leftIconInitial={leftIconInitial}
                                    selected={selected}
                                    onPress={() => gotoChatConversationPage(conversation)}
                                />
                            </View>
                        </View>
                    </View>
                );
            })}
            <Spacer height={ItemHeight.xsmall} />
        </Page>
    );
};

// @ts-ignore
InboxPage.navigationOptions = ({ navigation }: any) => ({
    ...defaultStackNavigationOptions,
    // We have to use headerLeft to set the whole header bar for being able to handle long space name
    headerLeft: () => <NavHeaderSpaceSwitcher navigation={navigation} icons={navigation.getParam('icons')} />,
});

// @ts-ignore
export default withNavigation(InboxPage);
