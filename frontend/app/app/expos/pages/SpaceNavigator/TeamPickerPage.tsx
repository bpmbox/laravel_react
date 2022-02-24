import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spacer } from '../../components/integration';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import ImagePicker from '../../components/UIKit/ImagePicker';
import SearchField from '../../components/UIKit/items/SearchField';
import Text from '../../components/UIKit/items/Text';
import UserItem from '../../components/UIKit/items/UserItem';
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
import { ItemWidth } from '../../theme.style';
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
const BlockGalleryPage = (id, name) => {
    let a = 'チーム名変更';
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
                type: 'text',
                value: 'チーム名',
            },
            {
                type: 'input',
                attrs: {
                    placeholder: 'チーム名は必須です',
                    label: '',
                    capitalize: 'characters',
                },
            },
            {
                type: 'text',
                value: 'メンバー',
            },
        ],
    };

    return (
        <View style={{ flex: 1, paddingTop: 0 }}>
            <PageLocal content={content} />
        </View>
    );
};

const TeamPickerPage = (props: any) => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onSelectionDone, users, excludedUsers, allowMulti, initialSelection } = navigation.state.params;
    const { t } = useTranslation('PeoplePickerPage');
    const [memberships, setMemberships] = useState<Membership[]>(users || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [selection] = useState<User[]>(defaultTo(initialSelection, []));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //const conversationId = props.attrs.id;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentUser, isAuthenticated } = AuthStore.useContainer();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [conversation, setConversation] = useState<NSChat.Conversation>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const conversationId = navigation.getParam(PARAM_CONVERSATION);
    const onDone = navigation.getParam(PARAM_ON_DONE);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isChatContextReady, activeConversation, setActiveConversation, conversations, myMembership } = useContext(
        ChatContext
    );
    const lg = new log();
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

    //イメージ画像の取得
    /**
     * イメージ画像の取得
     */
    const IMG = lg.getMeta(activeConversation.id, ' ユーザーの削除 ');

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
                setLoading(true);
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
                setLoading(false);
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

    const handleSearchInput = (text: string) => {
        queryActions.setQuery(text);
    };

    useEffect(() => {
        navigation.setParams({
            [PARAM_ON_DONE]: () => {
                onSelectionDone && onSelectionDone(selection);
                //navigation.goBack();
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);
    const activeConversationId: string = navigation.getParam(PARAM_CONVERSATION);

    //const imagePress =
    const handlePress = async (user: User, flag) => {
        // sendbird logs
        console.log("フラグの判定" + flag)
        Alert.alert(user.id)
        //Alert.alert(flag)
        //await sendBirdLog('activeConversationId', user.id);
        const lg = new log();

        //global.lg.sendberdInvite("sss",user.id)

        Alert.alert('start Teampickerssssssssssss hondole');
        //Alert.alert('ssss' + activeConversationId);
        console.log('user del or add' + activeConversationId);
        //Alert.alert(user.familyName);
        //alert(user.id);
        //await lg.sendBirdLog('sss', 'TeamPicker.tsx ユーザーの追加と削除 false の場合削除をする');
        //await lg.sendBirdLog('sss', 'TeamPicker.tsx DjiangでユーザーIDからSENDBIRDのIDを取得する');
        //await sendBirdLog('', "ユーザーの追加と削除 false の場合削除をする");
        //await sendBirdLog('', "Your user id is "+user.id);

        //await sendBirdLog('activeConversationId', "line 325 ----------------------------");
        //await sendBirdLog('activeConversationId', activeConversationId);
        //await lg.sendBirdLog('sss', activeConversationId);
        //await sendBirdLog('activeConversationId', "line 325 Member Add Flag ----------------------------");

        //await sendBirdLog('activeConversationId', flag);
        if (flag === true) {
            //await lg.sendBirdLog(activeConversationId, ' ユーザーの削除 ');
            Alert.alert(activeConversationId)
            await lg.sendberdLeave(activeConversationId, user.id);
            //setMemberships()
            //amembership.member.id = false
        } else {
        Alert.alert(activeConversationId)
            //await lg.sendBirdLog(activeConversationId, ' ユーザーの登録 ');
            await lg.sendberdInvite(activeConversationId, user.id);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //let result = '';

        //console.log(res)
        //const exists = typeof selection.find(member => member.id === user.id) !== 'undefined';
        //console.log(exists)
        //if (exists) {
        //setSelection(
        //    selection.filter(member => {
        //        return member.id !== user.id;
        //    })
        //);
        //} else {
        //    setSelection(union(selection, [user]));
        //}
    };

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

    const currentPageResults = sortBy(
        slice(filteredResults, (queryState.page - 1) * PAGINATION_SIZE, queryState.page * PAGINATION_SIZE),
        membership => {
            return membership.member.givenName;
        }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const avatarOnPress = () => {
        navigation.navigate(routes.TAB_CHAT_CONVERSATION_SETTINGS, {
            //     [PARAM_CONVERSATION]: activeConversation.id,
        });
    };

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
            <ImagePicker
                allowSelection
                space
                includeButton
                buttonTitle={t`change Logo`}
                desktopWidth={ItemWidth.narrow}
                imageUrl={IMG || ''}
                onUploaded={(fileUrl: string) => {
                    //setFieldValue('spaceIconUrl', fileUrl);
                }}
            />
            <BlockGalleryPage id={'test'} name={'test'} />
            <SearchField placeholder={t`名前でフィルター...`} onChangeText={handleSearchInput} autoCapitalize="none" />
            <Spacer />
            {loading && <Text text={t`Loading space members...`} light small center />}

            {currentPageResults.map((membership, index) => {
                //console.log("count aaaaaaaaaaaaaaaaaa"+count)
                const selected = typeof selection.find(member => member.id === membership.member.id) !== 'undefined';
                let flag = false;

                let xxx = '';
                //console.log("conversations 291 "+conversations.values())
                //flogがfalseの場合
                if (selected === false) {
                    for (xxx in activeConversation.members) {
                        if (
                            membership.member.givenName + ' ' + membership.member.familyName ===
                            activeConversation.members[xxx]._sbUser.nickname
                        ) {
                            console.log('■ーーーーーーーーーーーーーーーーーーーーーー');
                            console.log(activeConversation.members[xxx]);
                            console.log(activeConversation.members[xxx]._sbUser.userId);
                            console.log('line 310 is');
                            flag = true;
                        }
                    }
                } else {
                    flag = selected;
                }

                // @ts-ignore
                return (
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: 340 }}>
                                <UserItem key={index} user={membership.member} selected={flag} />
                            </View>
                            <View style={{ width: 50 }}>
                                <Button title="退出sss" onPress={() => handlePress(membership.member, flag)} />
                            </View>
                        </View>
                    </View>
                );
            })}

            {!loading && currentPageResults.length === 0 && (
                <Text
                    text={
                        queryState.queryString.length > 0
                            ? t`No results.`
                            : memberships.length > 0
                            ? t`All members have been added.`
                            : t`No members to add.`
                    }
                    light
                    small
                    center
                />
            )}
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
              navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
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
TeamPickerPage.navigationOptions = navigationOptions;

export default TeamPickerPage;
