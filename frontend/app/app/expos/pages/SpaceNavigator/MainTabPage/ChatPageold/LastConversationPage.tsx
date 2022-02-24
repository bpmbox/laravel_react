import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withNavigation } from '@react-navigation/core';
import EmptyPage from '../../../General/EmptyPage';
import AuthStore from '../../../../store/auth';
import trackingService from '../../../../services/tracking';
import routes from '../../../../routes';
import { SpaceContext } from '../../../SpaceNavigator/SpaceContext';
import { PARAM_CONVERSATION } from '../../../../constants';

/**
 * This component looks up what the most recent conversation was for the current user
 * in the current space.  If one exists, it is displayed as the current conversation.
 * If not, we display an empty conversation page.
 */
const LastConversationPage = props => {
    const { navigation } = props;
    const { currentUser } = AuthStore.useContainer();
    const { space } = useContext(SpaceContext);
    const { t } = useTranslation('ConversationPage');

    const checkLastConvo = async () => {
        if (!currentUser || !space) {
            return;
        }
        const lastConversationId = await trackingService.getLastVisitedChatConversation(currentUser.id, space.id);
        if (lastConversationId !== null) {
            navigation.navigate(routes.TAB_CHAT_CONVERSATION, {
                [PARAM_CONVERSATION]: lastConversationId,
            });
        }
    };

    // runs on load
    useEffect(() => {
        checkLastConvo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, space]);

    return <EmptyPage message={t`No conversation selected.`} />;
};

export default withNavigation(LastConversationPage);
