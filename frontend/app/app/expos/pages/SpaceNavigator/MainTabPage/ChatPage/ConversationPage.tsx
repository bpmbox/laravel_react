import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Composer, GiftedChat, InputToolbar, utils, IMessage as GiftedChatMessage } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { IconId } from '../../../../assets/native/svg-icons';
import { NavHeaderImageArea, NavHeaderSafeArea, NavHeaderText } from '../../../../components/Navigation/NavButtons';
import Icon from '../../../../components/UIKit/Icon';
import { getChatComposerInputStyle } from '../../../../components/UIKit/Item/style';
import ChatBubble from '../../../../components/UIKit/items/ChatBubble';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { isMobilePlatform } from '../../../../libs/platform';
import useListener from '../../../../libs/use-listener';
import { PARAM_ACTIVE_CONVERSATION, PARAM_CONVERSATION } from '../../../../constants';
import routes from '../../../../routes';
import theme, { Color, IconSize, ItemHeight, VerticalOffset } from '../../../../theme.style';
import chatService, { CHAT_EVENTS } from '../../../../services/chat';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import trackingService from '../../../../services/tracking';
import AuthStore from '../../../../store/auth';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../../SpaceNavigator/SpaceContext';
import ChatContext from './ChatContext';
import ImagePicker from '../../../../components/UIKit/ImagePicker';
// number of pixels wide for left pane in chat split page
interface ConversationPageProps {
    navigation: any;
    user: string;
}

/**
 * Returns true if the given conversation has any active members.
 * If not, we will disable the input composer.
 * TODO: move to chat-util functions file?
 */
 // number of pixels wide for left pane in chat split page
const hasActiveMembers = (conversation: NSChat.Conversation) => {
    return conversation && conversation.members && conversation.members.some(m => m.isActive);
};
/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 */
export class DocumentMe {}
/**
 * チャットスssssssssssssssプリットページ
 * 
 */
 
/**
 * Aなかんじのクラス
 *
 * えー
 */
export class A {
    /**
     * Aなかんじのクラスのコンストラクタ
     *
     * えーえー
     *
     * @param a えー感じのパラメータ
     */
    constructor(
        /**
         * ぷろぱてぃ
         */
        public a: number
    ) {}

    /**
     * メソッド
     *
     * めそ
     *
     * @returns アレな関数
     */
    method() {
        return (a = 1) => `${a * 2}`;
    }
    
    ca() {
        return 1;
    }
}

/**
 * チャットスプリットページ
 * 
 */
// number of pixels wide for left pane in chat csplit page
const ConversationPage: FunctionComponent<ConversationPageProps> = props => {
    const TA = new A(1);
    const { t } = useTranslation('Chat::ConversationPage');
    const { navigation } = props;

    const activeConversationId: string = navigation.getParam(PARAM_CONVERSATION);

    const [messageState, updateMessageState] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const forceUpdate = useCallback(() => updateMessageState({}), []);
    const { currentUser } = AuthStore.useContainer();
    const {
        isChatContextReady,
        activeConversation,
        setActiveConversation,
        conversations,
        memberships,
        myMembership,
    } = useContext(ChatContext);
    const { space } = useContext(SpaceContext);

    // message stored in reverse order due to bug with 'inverted' list scrolling
    // in GiftedChat with React Native Web
    const [messages, setMessages] = useState<GiftedChatMessage[]>([]);
    const giftedChatRef = useRef<GiftedChat>();
    const loadingRef = useRef(true);
    const activeConversationIdRef = useRef<string>();
    const conversationId = navigation.getParam(PARAM_CONVERSATION);
    console.log(conversationId);
    //return
    /**
 * チャットスプリットページ
 * 
 */
    const initConversation = useCallback(
        // eslint-disable-next-line no-shadow
        async (activeConversationId: string) => {
            if (!activeConversationId) {
                return;
            }

            let conversation = conversations.find((c: NSChat.Conversation) => c.id === activeConversationId);
            if (!conversation) {
                return;
            }

            setActiveConversation(conversation);
            navigation.setParams({
                [PARAM_ACTIVE_CONVERSATION]: conversation,
            });

            // remember last open conversation so it can be reopened later if needed
            trackingService.reportChatConversationVisit(currentUser.id, space.id, activeConversationId);

            try {
                const previousMessages = await chatService.getPreviousMessageList(conversation, memberships);
                chatService.markConversationAsRead(conversation);
                setMessages(previousMessages.map(messageToGiftedChatMessage));
            } catch (err) {
                console.warn('Error loading messages:', err);
                messageService.sendError(t('Unable to load messages.'));
                setMessages([]);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [conversations, currentUser, memberships, setActiveConversation, space, t]
    );

    const onMessageReceived = useCallback(
        async args => {
            const conversation: NSChat.Conversation = args.conversation;
            //conversaton.id が　現在のチャットでない場合
            if (conversation.id !== activeConversationIdRef.current) {
                return;
            }

            // fill in name/avatar from space membership info
            let message: NSChat.Message = args.message;
            message = chatService.setMessagePerspective(message, memberships);

            // If received message is in the current conversation => add to messages.
            await chatService.markConversationAsRead(conversation);
            const formattedMessage = messageToGiftedChatMessage(message);
            const updatedMessagesList = [formattedMessage].concat(messages);
            setMessages(updatedMessagesList);
        },
        [memberships, messages]
    );

    /**
     * Converts a message from our format to the one needed by GiftedChat
     * for display in the message list on this page.
     * GIFTED CHATで表示出来るように設定
     */
    const messageToGiftedChatMessage = (message: NSChat.Message): GiftedChatMessage => {
        console.log('messageToGiftedChatMessage');
        if (!message) {
            return null;
        }
        const user = message.sender
            ? {
                  _id: message.sender.id,
                  name: message.sender.fullName,
                  avatar: message.sender.avatarUrl,
                  isActive: message.sender.isActive,
              }
            : null;

        let messageText = message.message;
        let image = null;
        if (message.type === 'image') {
            messageText = null;
            image = message.message;
        }

        const gcMessage: GiftedChatMessage = {
            _id: message.id,
            text: messageText,
            image: image,
            createdAt: message.createdAt,
            user: user,
        };
        return gcMessage;
    };

    /**
     * Sends an image message to display the image that has already been uploaded
     * to the given URL.
     */
    const sendImageMessage = async (imageUrl: string) => {
        if (!imageUrl) {
            return;
        }

        try {
            const sentMessage = await chatService.sendImage(activeConversation, imageUrl);
            await sendMessageCommon(sentMessage);
        } catch (err) {
            console.error('Unable to send image. Error:', err);
            messageService.sendError(t('Unable to send image.'));
        }
    };

    /**
     * Sends a regular message with the given text.
     */
    const sendTextMessage = async (messageText: string) => {
        if (!messageText) {
            return;
        }

        try {
            const sentMessage = await chatService.sendMessage(activeConversation, messageText);
            await sendMessageCommon(sentMessage);
        } catch (err) {
            console.error('Unable to send message. Error:', err);
            messageService.sendError(t('Unable to send message.'));
        }
    };

    /**
     * Common code to be run after any type of message has been sent.
     * Adds the message to the list of messages so it will display on the screen.
     */
    const sendMessageCommon = async (sentMessage: NSChat.Message) => {
        // fill in name/avatar from space membership info
        sentMessage = chatService.setMessagePerspective(sentMessage, memberships);
        const formattedMessage = messageToGiftedChatMessage(sentMessage);
        const updatedMessagesList = [formattedMessage].concat(messages);
        setMessages(updatedMessagesList);
    };

    // common helper code to send a message to chat and clear the input composer
    // eslint-disable-next-line no-shadow
    const sendMessageHelper = async props => {
        if (!props.text) {
            return;
        }
        const text = props.text.trim();

        // clear the GiftedChat input composer (needs delay)
        setImmediate(() => {
            try {
                if (props.onSend) {
                    // send message and reset input toolbar
                    props.onSend({ text: text }, true);
                }
            } catch (err) {
                console.error('Error sending message:', err);
            }
        });
        //text の長さが０以上の場合
        if (text.length > 0) {
            sendTextMessage(text);
        }
    };

    // eslint-disable-next-line no-shadow
    const renderMessage = props => {
        const currentMessage: GiftedChatMessage = props.currentMessage;
        const previousMessage: GiftedChatMessage = props.previousMessage;
        const user = props.user;
        const isSameThread =
            utils.isSameUser(currentMessage, previousMessage) && utils.isSameDay(currentMessage, previousMessage);
        // Check if sender is current user
        const isMe = user._id === currentMessage.user._id;

        return (
            <ChatBubble
                sender={currentMessage.user}
                message={currentMessage.text}
                image={currentMessage.image}
                date={new Date(currentMessage.createdAt)}
                includeHeader={!isSameThread}
                isMe={true}
            />
        );
    };

    // eslint-disable-next-line no-shadow
    const renderInputToolbar = props => {
        const _style = StyleSheet.create({
            inputToolbar: {
                borderRadius: theme.radius,
                borderColor: Color.accent3.valueOf(),
                borderTopColor: Color.accent3.valueOf(),
                borderWidth: theme.borderWidth,
                marginLeft: theme.horizontalPadding,
                marginRight: theme.horizontalPadding,
                marginBottom: Platform.select({
                    ios: VerticalOffset.normal.valueOf(),
                    android: VerticalOffset.none.valueOf(),
                    web: VerticalOffset.none.valueOf(),
                }),
            },
        });

        return <InputToolbar {...props} containerStyle={_style.inputToolbar} />;
    };

    // eslint-disable-next-line no-shadow
    const renderSend = props => {
        const _style = StyleSheet.create({
            innerColumn: {
                flex: 1,
                flexDirection: 'column',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            },
        });

        //if (!props.text) {
        //    return (
        //        <View>
        //            <View style={_style.innerColumn}>
        //                <Icon svgIconId={IconId.system_send_disabled} iconSize={IconSize.normal} />
        //            </View>
        //        </View>
        //    );
        //}

        return (
            <TouchableOpacity
                onPress={async () => {
                    sendMessageHelper(props);
                }}>
                <View style={_style.innerColumn}>
                    <Icon svgIconId={IconId.system_send_enabled} iconSize={IconSize.normal} />
                </View>
            </TouchableOpacity>
        );
    };

    // eslint-disable-next-line no-shadow
    const renderComposer = props => {
        const textInputProps = {
            // Note: on Android, onKeyPress triggers for soft keyboard only, not hardware keyboard
            onKeyPress: e => {
                if (e && e.nativeEvent && e.nativeEvent.key === 'Enter') {
                    if (e.nativeEvent.preventDefault) {
                        e.nativeEvent.preventDefault();
                    }
                    if (e.nativeEvent.stopPropagation) {
                        e.nativeEvent.stopPropagation();
                    }
                    sendMessageHelper(props);
                }
            },
        };

        const styles = StyleSheet.create({
            composerArea: {
                flex: 1,
                flexDirection: 'row',
                flexGrow: 1,
                alignItems: 'center',
            },
        });

        const plusButton = <Icon iconSize={IconSize.normal} svgIconId={IconId.feather_plus_stroke_accent4} />;

        const setImageIsUploading = (value: boolean) => {
            if (!isUploading && value) {
                messageService.sendMessage(t`Sending image...`);
            }
            setIsUploading(value);
        };

        return (
            <View style={styles.composerArea}>
                <Text>Conversation</Text>
                <ImagePicker
                    customComponent={plusButton}
                    disabled={!hasActiveMembers(activeConversation) || isUploading}
                    includeButton={false}
                    includeHeader={false}
                    includePreview={false}
                    allowSelection
                    onUploaded={(fileUrl: string) => {
                        sendImageMessage(fileUrl);
                    }}
                    setIsUploading={setImageIsUploading}
                />
                <Composer
                    {...props}
                    multiline={true}
                    placeholderTextColor={Color.accent4.valueOf()}
                    textInputAutoFocus={true}
                    textInputStyle={getChatComposerInputStyle()}
                    textInputProps={textInputProps}
                />
            </View>
        );
    };

    const renderChatFooter = () => {
        return <Spacer height={ItemHeight.xsmall} />;
    };

    // Add new handler on new message
    useListener(chatService, CHAT_EVENTS.MESSAGE_RECEIVED, onMessageReceived);

    useEffect(() => {
        if (!isChatContextReady || !currentUser) {
            return;
        }

        (async () => {
            loadingRef.current = true;
            forceUpdate();

            await initConversation(activeConversationId);

            loadingRef.current = false;
            forceUpdate();
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChatContextReady, activeConversationId, currentUser]);

    useEffect(() => {
        activeConversationIdRef.current = activeConversationId;
        forceUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversationId]);

    useEffect(() => {
        if (giftedChatRef.current) {
            // fix broken logic in GiftedChat component for keyboard height adjustment
            giftedChatRef.current.getKeyboardHeight = () => {
                return 0;
            };
        }
    }, [giftedChatRef]);

    useLayoutEffect(() => {
        if (giftedChatRef.current) {
            try {
                giftedChatRef.current.scrollToBottom(/* animated */ false);
                giftedChatRef.current.focusTextInput();
            } catch (err) {
                // empty
            }
        }
    }, [messageState]);

    // don't show GiftedChat component while loading; fixes scrolling issues
    // that would otherwise be present if GiftedChat were displayed too early
    if (!isChatContextReady || loadingRef.current) {
        return <FullPageLoading />;
    }

    if (!activeConversation) {
        // error state (done loading, but no active conversation)
        // e.g. bad URL parameter on rnweb
        return <ErrorPage code={404} message={t`Conversation not found`} />;
    }

    // keyboard height is handled differently per OS;
    // iOS keyboard will overlap text input composer unless KeyboardSpacer
    // is used; but on Android, KeyboardSpacer messes up and overly spaces
    // the screen
    const bottomSpacer = Platform.OS === 'ios' ? <KeyboardSpacer /> : <Spacer height={ItemHeight.xsmall} />;

    return (
        <Page>
            <GiftedChat
                ref={giftedChatRef}
                listViewProps={{
                    contentContainerStyle: {
                        justifyContent: 'flex-end',
                    },
                    keyboardDismissMode: 'on-drag',
                }}
                textInputProps={{
                    autoFocus: true,
                }}
                inverted={true}
                messages={messages}
                isKeyboardInternallyHandled={false}
                user={{
                    _id: 1,
                    name: 'ME',
                    avatar: 'https://placeimg.com/140/140/any'
                }}
                renderMessage={renderMessage}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                renderComposer={renderComposer}
                renderChatFooter={renderChatFooter}
                placeholder={t`eeeメッセージを入力して下さいeeeeeeeeeeee...`}
                alwaysShowSend
                scrollToBottom={true}
            />
            {bottomSpacer}
        </Page>
    );
};
/**
 * sssssssssssss
 */
// @ts-ignore
ConversationPage.navigationOptions = ({ navigation }) => {
    historyService.setNavigation(navigation);

    const activeConversation: NSChat.Conversation = navigation.getParam(PARAM_ACTIVE_CONVERSATION);

    let iconInitial = null;
    let conversationName = '';
    let coverImageUrl = null;
    if (activeConversation) {
        conversationName = activeConversation.name + '';
        coverImageUrl = activeConversation.avatarUrl;
        if (activeConversation.isChannel) {
            iconInitial = i18n.t('#');
            if (!isMobilePlatform) {
                conversationName = '#' + conversationName;
            }
        }
    }

    const avatarOnPress = () => {
        //console.log('presss ssssssssssssss===============');
        //console.log('majide');
        //alert("sssssss")
        if (activeConversation) {
            navigation.navigate(routes.TAB_CHAT_CONVERSATION_SETTINGS, {
                [PARAM_CONVERSATION]: activeConversation.id,
            });
        }
    };

    const avatarOnPress2 = () => {
        //console.log('presss ssssssssssssss===============');
        //console.log('majide');
        //alert("sssssss")
        if (activeConversation) {
            navigation.navigate(routes.TAB_CHAT_CREATE_CHANNEL, {
                [PARAM_CONVERSATION]: activeConversation.id,
            });
        }
    };

    return {
        ...defaultStackNavigationOptions,
        conversationName,
        coverImageUrl,
        headerTitle: () => <NavHeaderText text={'' + conversationName + ''} />,
        headerRight: () => (
            <NavHeaderSafeArea>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: 30 }}>
                        <TouchableOpacity onPress={avatarOnPress2}>
                            <NavHeaderImageArea
                                imageUrl={coverImageUrl}
                                name={conversationName}
                                initial={iconInitial}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: 30 }}>
                        <TouchableOpacity onPress={avatarOnPress}>
                            <NavHeaderImageArea
                                imageUrl={coverImageUrl}
                                name={conversationName}
                                initial={iconInitial}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </NavHeaderSafeArea>
        ),
        tabBarVisible: true,
    };
};
/**
 * sssssssssssss
 */
export default withNavigation(ConversationPage);
