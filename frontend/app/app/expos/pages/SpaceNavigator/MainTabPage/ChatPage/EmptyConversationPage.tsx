import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ChatContext from './ChatContext';
import EmptyPage from '../../../General/EmptyPage';

const EmptyConversationPage = () => {
    const { t } = useTranslation('ConversationPage');
    const { setActiveConversation } = useContext(ChatContext);

    useEffect(() => {
        setActiveConversation(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <EmptyPage message={t`No conversation selected.`} />;
};

export default EmptyConversationPage;
