/**
 * This page is shown when the user clicks on the avatar of an active chat conversation.
 * It shows settings and options for that conversation.
 * Initially this component was created to provide the Delete Conversation feature
 * for removing a conversation from the user's inbox.
 */

import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import routes from '../../../../routes';
import { PaddingType, DesktopHeaderType } from '../../../../theme.style';
import chatService from '../../../../services/chat';
import alertService from '../../../../services/alert';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import trackingService from '../../../../services/tracking';
import AuthStore from '../../../../store/auth';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../../../pages/SpaceNavigator/SpaceContext';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import SimpleListButton from '../../../../components/UIKit/items/SimpleListButton';
import { PARAM_CONVERSATION, PARAM_ON_DONE } from '../../../../constants';

const ConversationSettingsPage: FunctionComponent<NavigationInjectedProps> = props => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    const { currentUser, isAuthenticated } = AuthStore.useContainer();
    const [conversation, setConversation] = useState<NSChat.Conversation>(null);
    const { t } = useTranslation('Chat::ConversationSettingsPage');

    const conversationId = navigation.getParam(PARAM_CONVERSATION);
    const onDone = navigation.getParam(PARAM_ON_DONE);

    const handleDeleteConversation = useCallback(async () => {
        try {
            if (!conversation) {
                messageService.sendError(t`Conversation not found.`);
                return;
            }
            await chatService.deleteConversation(conversation);
            messageService.sendSuccess(t`Conversation deleted.`);
            trackingService.removeLastVisitedChatConversation(currentUser.id, space.id);

            // TODO: nav as root? avoid ability to press Back?
            if (onDone) {
                onDone();
                navigation.goBack();
            } else {
                navigation.navigate(routes.TAB_CHAT_INBOX);
            }
        } catch (err) {
            messageService.sendError(err.message || t`Unable to delete conversation.`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation, currentUser, space, t]);

    const onPressDeleteConversation = useCallback(async () => {
        alertService.alert(t`Delete Conversation?`, null, [
            { text: t`Cancel`, style: 'cancel' },
            {
                text: t`Delete`,
                style: 'destructive',
                onPress: handleDeleteConversation,
            },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation, space, t]);

    useEffect(() => {
        if (!conversation) {
            (async () => {
                const conv = await chatService.getConversationById(conversationId);
                setConversation(conv);
                console.debug('ConversationSettingsPage', 'useEffect, conv=', conv);
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentUser || !isAuthenticated) {
        return <ErrorPage code={404} message={t`Could not load your profile info.`} />;
    }

    if (!conversation) {
        return <FullPageLoading />;
    }

    // @ts-ignore
    return (
        <Page scrollable desktopPadding={PaddingType.all}>
            <View>
                <SectionHeading text={t`Danger Zone`} />
                <SimpleListButton danger text={t`Delete Conversation`} onPress={onPressDeleteConversation} />
            </View>
        </Page>
    );
};

// @ts-ignore
ConversationSettingsPage.navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('ConversationPage::Settings'),
        desktopHeaderType: DesktopHeaderType.none,
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
export default withNavigation(ConversationSettingsPage);
