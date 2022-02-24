import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { getModalHeader, ModalButtonType } from '../../../components/Navigation/NavButtons';
import UserItem from '../../../components/UIKit/items/UserItem';
import Page from '../../../components/UIKit/Layout/Page';
import i18n from '../../../i18n';
import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { isMobilePlatform } from '../../../libs/platform';
import { PARAM_CONVERSATION } from '../../../constants';
import routes from '../../../routes';
import theme, { DesktopHeaderType } from '../../../theme.style';
import chatService from '../../../services/chat';
import spaceService from '../../../services/space';
import AuthStore from '../../../store/auth';
import EmptyPage from '../../General/EmptyPage';
import FullPageLoading from '../../General/FullPageLoading';
import { SpaceContext } from '../SpaceContext';

// TODO: remove this entire file

const CreateChatPage: FunctionComponent<NavigationInjectedProps> = props => {
    const { t } = useTranslation('CreateChatPage');
    const { navigation } = props;
    const { currentUser } = AuthStore.useContainer();
    const { space } = useContext(SpaceContext);

    const [spaceMembers, setSpaceMembers] = useState<SpaceServiceTypes.MembershipWithChat[]>([]);
    const [myMembership, setMyMembership] = useState<SpaceServiceTypes.MembershipWithChat>();

    const getOrCreateConversation = async (
        withMembership: SpaceServiceTypes.MembershipWithChat
    ): Promise<NSChat.Conversation> => {
        return await chatService.createConversation(space, [withMembership.chat.userId, myMembership.chat.userId]);
    };

    const gotoChatConversationPage = async (withMembership: SpaceServiceTypes.MembershipWithChat) => {
        let conversation = await getOrCreateConversation(withMembership);
        conversation = chatService.setConversationPerspective(
            conversation,
            [...spaceMembers, myMembership],
            currentUser
        );

        navigation.navigate(routes.TAB_CHAT_CONVERSATION, {
            [PARAM_CONVERSATION]: conversation.id,
        });
    };

    const loadMembers = async () => {
        if (!space) {
            return;
        }

        let members: SpaceServiceTypes.MembershipWithChat[] = await spaceService.getMembers(space);

        const others = members.filter(m => m.member.id !== currentUser.id);
        const myInfo = members.filter(m => m.member.id === currentUser.id)[0];

        setSpaceMembers(others);
        setMyMembership(myInfo);
    };

    useEffect(() => {
        loadMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space]);

    if (!myMembership) {
        return <FullPageLoading />;
    }

    if (spaceMembers.length === 0) {
        return <EmptyPage message={t`There are no members in this space.`} />;
    }

    const style = isMobilePlatform
        ? {}
        : {
              paddingHorizontal: theme.modalHorizontalPadding,
              paddingTop: 0,
              paddingBottom: theme.modalVerticalPadding,
          };

    return (
        <Page>
            <FlatList
                style={style}
                data={spaceMembers}
                keyExtractor={(item: SpaceServiceTypes.MembershipWithChat) => item.member.id}
                renderItem={item => (
                    <UserItem user={item.item.member} onPress={() => gotoChatConversationPage(item.item)} />
                )}
            />
        </Page>
    );
};

// @ts-ignore
CreateChatPage.navigationOptions = () => {
    return {
        title: i18n.t('ChatCreatePage::Chat with...'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: true,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
    };
};

export default withNavigation(CreateChatPage);
