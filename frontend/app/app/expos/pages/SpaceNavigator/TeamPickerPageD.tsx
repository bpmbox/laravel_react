import defaultTo from 'lodash/defaultTo';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import useListener from '../../libs/use-listener';
import useQueryPaginationState from '../../libs/use-query-pagination-state';
import useSearch from '../../libs/use-search';
import { DesktopHeaderType, PaddingType } from '../../theme.style';
import historyService from '../../services/history';
import messageService from '../../services/message';
import spaceService, { SPACES_UPDATED_EVENT } from '../../services/space';
import { Role } from '../../types/enums';
import { SpaceContext } from './SpaceContext';
import { PARAM_CONVERSATION, PARAM_ON_DONE, PARAM_ON_SELECTION_DONE } from '../../constants';
import { Alert, Button, View } from 'react-native';
import routes from '../../routes';
import ChatContext from './MainTabPage/ChatPage/ChatContext';
import chatService from '../../services/chat';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import SimpleListButton from '../../components/UIKit/items/SimpleListButton';
import trackingService from '../../services/tracking';
import alertService from '../../services/alert';
import AuthStore from '../../store/auth';
import PageLocal from '../Integration/PageLocal';
import { PageContent } from '../../libs/integration/pageRenderer';
import { log } from '../../services/log/log';

const PAGINATION_SIZE = 50;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BlockGalleryPage = () => {
    const content: PageContent = {
        title: 'Basic Blocks',
        props: [
            {
                name: 'firstName',
                type: 'text',
                value: 'store.firstName',
            },
            {
                name: 'lastName',
                type: 'text',
                value: 'store.lastName',
            },
        ],
        blocks: [
            {
                type: 'input',
                attrs: {
                    label: 'チーム名',
                },
            },
            {
                type: 'input',
                value: 'チーム名を入力して下さい',
                attrs: { id: 222234343222, team: 333333333 },
            },
            {
                type: 'button',
                value: 'チーム変更',
                attrs: {
                    onClick: {
                        action: 'handlePress',
                        payload: {
                            url: 'https://httpbin.org/post',
                            params: {
                                firstName: '${prop("firstName")}',
                                lastName: '${prop("lastName")}',
                            },
                        },
                        onSuccess: {
                            action: 'notify',
                            payload: {
                                message: '成功。応答: ${response}.',
                            },
                        },
                        onError: {
                            action: 'notify',
                            payload: {
                                message: 'エラー: ${get(error, "message")}',
                            },
                        },
                    },
                },
            },
        ],
    };

    return (
        <View style={{ flex: 1, paddingTop: 0 }}>
            <PageLocal content={content} />
        </View>
    );
};

const TeamPickerPageD = (props: any) => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onSelectionDone, users, excludedUsers, allowMulti, initialSelection } = navigation.state.params;
    const { t } = useTranslation('PeoplePickerPage');
    const [memberships, setMemberships] = useState<Membership[]>(users || []);
    const [setLoading] = useState<boolean>(false);
    const [selection] = useState<User[]>(defaultTo(initialSelection, []));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //const conversationId = props.attrs.id;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentUser } = AuthStore.useContainer();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [conversation] = useState<NSChat.Conversation>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const conversationId = navigation.getParam(PARAM_CONVERSATION);
    const onDone = navigation.getParam(PARAM_ON_DONE);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isChatContextReady, activeConversation, setActiveConversation, conversations, myMembership } = useContext(
        ChatContext
    );

    //lg.sendBirdLog("sss","TeamPicker.tsx ")

    /**
     * Applocloinet init
     * cant, use naibuni ddata wo
     */

    /**
     * チャットログの送信
     * @param id
     * @param message
     */

    console.log(props);
    //console.log(activeConversation._sbChannel)
    //  console.log(myMembership)

    activeConversation.members.map(x => ({
        ...x,
        // Create a computed field fullName for our search to index on.
        fullName: `${x.fullName} ${x.fullName}`,
    }));

    const { results, setQuery, setData } = useSearch<Membership>([
        { path: 'member.email', weight: 0.4 },
        { path: 'member.givenName', weight: 0.3 },
        { path: 'member.familyName', weight: 0.2 },
        // Full name is a computed value. This is needed for situations we want
        // to search partial match across first and last name.
        { path: 'fullName', weight: 0.1 },
    ]);

    // State to track query entered and pagination
    const { queryState, queryActions } = useQueryPaginationState();

    const fetchMembers = () => {
        (async () => {
            try {
                const members = await spaceService.getMembers(space);
                const excludedUserIds = defaultTo(excludedUsers, []).map(user => {
                    return user.id;
                });
                setMemberships(
                    members.filter(
                        x =>
                            x.role !== Role.INTEGRATION &&
                            !excludedUserIds.includes(x.member.id) &&
                            (x.member.familyName || x.member.givenName)
                    )
                );
            } catch (err) {
                messageService.sendError(t`Unable to retrieve members.`);
            } finally {

            }
        })();
    };

    useEffect(() => {
        if (!users) {
            fetchMembers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useListener(spaceService, SPACES_UPDATED_EVENT, fetchMembers);
    // Note: SPACES_UPDATED_EVENT is also emitted during Role updates, so we
    // don't need to listen on SPACES_USER_ROLE_UPDATED_EVENT
    // useListener(spaceService, SPACES_USER_ROLE_UPDATED_EVENT, fetchMembers);

    // Update search index when data source changes.
    useEffect(() => {
        setData(
            memberships.map(x => ({
                ...x,
                // Create a computed field fullName for our search to index on.
                fullName: `${x.member.givenName} ${x.member.familyName}`,
            }))
        );

        // only run this on memberships changing.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberships]);

    // Update search query when search input changes.
    useEffect(() => {
        setQuery(queryState.queryString);

        // only run this on querystring change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryState.queryString]);

    useEffect(() => {
        navigation.setParams({
            [PARAM_ON_DONE]: () => {
                onSelectionDone && onSelectionDone(selection);
                //navigation.goBack();
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    // use all results if search query is empty
    const filteredResults = queryState.queryString ? results : memberships;

    // used for pagination
    const maxPage = Math.ceil(filteredResults.length / PAGINATION_SIZE);

    // Reset pagination page when search results updated.
    useEffect(() => {
        if (queryState.page > maxPage) {
            queryActions.resetPage(maxPage);
        } else {
            queryActions.setMaxPage(maxPage);
        }

        // only run this on match contents changing or page change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredResults, queryState.page]);


    const handleDeleteConversation = useCallback(async () => {
        try {
            if (!activeConversation) {
                messageService.sendError(t`Conversation not found.`);
                return;
            }
            Alert.alert(activeConversation.id);
            Alert.alert(space.id);
            await chatService.deleteConversation(activeConversation);
            messageService.sendSuccess(t`Conversation deleted.`);

            trackingService.removeLastVisitedChatConversation(activeConversation.id, space.id);

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
    }, [activeConversation, currentUser, space, t]);

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

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <SectionHeading text={t`Danger Zone`} />
            <SimpleListButton danger text={t`Delete Conversation`} onPress={onPressDeleteConversation} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof navigation.getParam(PARAM_ON_SELECTION_DONE) !== 'function') {
        //navigation.pop();
        return null;
    }

    historyService.setNavigation(navigation);
    const rightHeader = navigation.state.params.allowMulti
        ? getRightActionHeader(i18n.t('PeoplePickerDone'), true, true, () => {
              navigation.state.params[PARAM_ON_DONE] && navigation.statde.params[PARAM_ON_DONE]();
          })
        : {};

    return {
        ...defaultStackNavigationOptions,
        title: navigation.state.params.title,
        desktopHeaderType: DesktopHeaderType.plain,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
    };
};

// @ts-ignore
TeamPickerPageD.navigationOptions = navigationOptions;

export default TeamPickerPageD;
