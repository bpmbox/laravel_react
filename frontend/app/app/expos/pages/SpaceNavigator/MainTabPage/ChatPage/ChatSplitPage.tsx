import React, { useCallback, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SceneView } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import routes from '../../../../routes';
import InboxPage from './InboxPage';
import { SpaceContext } from '../../../../pages/SpaceNavigator/SpaceContext';
import AuthStore from '../../../../store/auth';
import chatService from '../../../../services/chat';
import DesktopPageHeader from '../../../../components/UIKit/items/DesktopPageHeader';
import { IconId } from '../../../../assets/native/svg-icons';
import ChatContext from './ChatContext';
import { IconSize } from '../../../../theme.style';
import { PARAM_CONVERSATION, PARAM_ON_DONE, PARAM_ON_SELECTION_DONE } from '../../../../constants';

// number of pixels wide for left pane in chat split page
const CHAT_SPLIT_DESKTOP_WIDTH = 240;

/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 */
export class DocumentMe {
    /**
    * This comment _supports_ [Markdown](https://marked.js.org/)
    */
    sample(){
        
    }
}

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
}
/**
 * チャットスssssssssssssssプリットページ
 * 
 */
const ChatSplitPage = ({ descriptors, navigation }: any) => {
    const { t } = useTranslation('Chat::ChatSplitPage');
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const descriptor = descriptors[activeKey];
    const { space } = useContext(SpaceContext);
    const { currentUser } = AuthStore.useContainer();

    const {
        activeConversation,
        setActiveConversation,
        // isChatContextReady,
    } = useContext(ChatContext);

    let iconInitial = null;
    let conversationName = '';
    let iconUrl = null;
    /*
    split page 
    ここで　タイトルの設定
    タイトル　設定　→　表示
    */
    if (activeConversation) {
        conversationName = activeConversation.name;
        iconUrl = activeConversation.avatarUrl;
        if (activeConversation.isChannel) {
            iconInitial = t('#sssssssssssss');
            conversationName = t('ssssssssss#{{conversationName}}', {
               conversationName: conversationName,
            });
        }
    }
    /**
     * ダイレクトメッセージ
     * 
     */

    const onPressDirectMessage = useCallback(() => {
        //POPLE_PICKER の表示
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
            title: t`Neｓｓｓw Message`,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, space, t]);

    const onChatOptionsPress = useCallback(() => {
        // TODO
    }, []);
    
    /**
     * アバターを押した場合
     * 
     */

    const onAvatarPress = useCallback(() => {
        if (activeConversation) {
            navigation.navigate(routes.CONVERSATION_SETTINGS_MODAL, {
                [PARAM_CONVERSATION]: activeConversation.id,
                [PARAM_ON_DONE]: () => {
                    navigation.navigate(routes.TAB_CHAT_EMPTY_CONVERSATION);
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversation]);

    return (
        <View style={styles.outer}>
            <View style={styles.inbox}>
                <DesktopPageHeader
                    title={t`ChatSplitPageInboxsssssssssssssss`}
                    rightIconId={IconId.feather_plus_stroke_accent4}
                    rightIconSize={IconSize.normal}
                    onRightIconPress={onPressDirectMessage}
                />
                <InboxPage />
            </View>

            <View style={styles.conversation}>
                {activeConversation && (
                    <TouchableOpacity onPress={onAvatarPress}>
                        <DesktopPageHeader
                            title={"sssss"+conversationName}
                            showAvatar={true}
                            iconUrl={iconUrl}
                            initial={iconInitial}
                            onRightIconPress={onChatOptionsPress}
                        />
                    </TouchableOpacity>
                )}
                <SceneView navigation={descriptor.navigation} component={descriptor.getComponent()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    conversation: {
        flex: 1,
    },
    inbox: {
        width: CHAT_SPLIT_DESKTOP_WIDTH,
        height: '100%',
    },
    outer: {
        flex: 1,
        flexDirection: 'row',
    },
});

export default ChatSplitPage;
