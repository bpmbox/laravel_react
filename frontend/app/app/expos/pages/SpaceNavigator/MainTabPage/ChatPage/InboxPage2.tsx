import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    RefreshControl, Text, View, Button, StyleSheet,
    TouchableOpacity,
    Alert,
    Image, TextInput
} from 'react-native';
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
import EmptyPage from '../../../General/EmptyPage';
import FullPageLoading from '../../../General/FullPageLoading';
import ChatContext from './ChatContext';
import ImagePicker from '../../../../components/UIKit/ImagePicker';
import SectionHeading from "../../../../components/UIKit/items/SectionHeading";

const InboxPage: FunctionComponent<any> = props => {
    const { t } = useTranslation('Chat::InboxPage');
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    const { currentUser } = AuthStore.useContainer();
    const [refreshing, setRefreshing] = React.useState(false);

    const {
        activeConversation,
        setActiveConversation,
        isChatContextReady,
        conversations,
        forceChatRefresh,
    } = useContext(ChatContext);

    const createChatConversation = useCallback(
        async (users: User[]) => {
            const conversation = await chatService.createConversationWithUsers(space, currentUser, users);
            setActiveConversation(conversation);
            navigation.navigate(routes.TAB_CHAT_CONVERSATION, {
                [PARAM_CONVERSATION]: conversation.id,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentUser, space]
    );

    // set up the '+' top-right icon for creating a new chat conversation
    useEffect(() => {
        // Called when the user presses Direct Message.
        // Pops up a people picker to help create a new conversation.
        const onPressDirectMessage = () => {
            navigation.navigate(routes.PEOPLE_PICKER, {
                allowMulti: true,
                excludedUsers: [currentUser],
                [PARAM_ON_SELECTION_DONE]: (selection: User[]) => {
                    if (selection && selection.length > 0) {
                     //   createChatConversation(selection);
                    }
                },
                title: t`New Messageinbox`,
            });
        };

        const navPlusIcon = (
            <NavHeaderPlusButton onPress={onPressDirectMessage} />
        );

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
            console.log(conversation.id)
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

    const onPressDirectMessage = useCallback(() => {
        console.log(routes.PEOPLE_PICKER)
        navigation.navigate(routes.PEOPLE_PICKER, {
            allowMulti: true,
            excludedUsers: [currentUser],
            [PARAM_ON_SELECTION_DONE]: async (users: User[]) => {
                if (!users || users.length === 0) {
                    return;
                }
                const conversation = await chatService.createConversationWithUsers(space, currentUser, users);
                setActiveConversation(conversation);
                navigation.navigate(routes.TAB_CHAT_CONVERSATION, {
                    [PARAM_CONVERSATION]: conversation.id,
                });
            },
            title: t`InboxPage New sssMessage`+"Team Permissions",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, space, t]);

    if (conversations.length === 0) {
        if (!isChatContextReady || refreshing) {
            return <FullPageLoading />;
        } else {
            return <EmptyPage message={t`No conversations.`} />;
        }
    }

    return (
        <Page scrollable refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {conversations.map((conversation: NSChat.Conversation) => {
                const leftIconInitial: string = conversation.isChannel ? '#' : null;
                const selected = !isMobilePlatform && activeConversation && conversation.id === activeConversation.id;
                console.dir(conversation)
                let name = conversation.name;
                if (!isMobilePlatform && conversation.isChannel) {
                    name = '#' + name + "==================";
                }
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
                console.log("InboxPage  154 "+conversation.id)
                return (
                    <View>

                    <View   style={{flex: 1, flexDirection: 'row'}}>


                        <View  style={{width: 340, height: 80, backgroundColor: 'powderblue'}}>

                        <InboxItem
                                key={conversation.id}
                                name={"InboxPage2222222 "+name+"(4)"}
                                snippet={snippet}
                                date={date}
                                unreadCount={conversation.unreadMessageCount}
                                avatarUrl={conversation.avatarUrl}
                                leftIconInitial={leftIconInitial}
                                selected={selected}
                                onPress={() => gotoChatConversationPage(conversation)}
                            />
                        </View>
                            <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}}>
                                <TouchableOpacity
                                   // onPress={() => handlePress(membership.member)}
                                >
                                    <Image
                                        style={styles.image}
                                        source={require('./img/btn-check.png')}
                                    />
                                </TouchableOpacity>
                            </View>



                    </View>
                    </View>
                );
            })}
            <Spacer height={ItemHeight.xsmall} />
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 50,
        height: 50,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    navBar: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'blue',
    },

    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'green'
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

// @ts-ignore
InboxPage.navigationOptions = ({ navigation }: any) => ({
    ...defaultStackNavigationOptions,
    // We have to use headerLeft to set the whole header bar for being able to handle long space name
    headerLeft: () => <NavHeaderSpaceSwitcher navigation={navigation} icons={navigation.getParam('icons')} />,
});

export default withNavigation(InboxPage);
