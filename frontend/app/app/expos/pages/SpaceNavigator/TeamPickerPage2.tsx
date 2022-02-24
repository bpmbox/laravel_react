import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import union from 'lodash/union';
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
import { Alert, View } from 'react-native';
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

//global.logs.sendBirdLog("a","TeamPicker Data")
//console.log(global.test)
//global.lg.sendBirdLog("sss","first second global  sssssssssssss")

//let count = 0

const PAGINATION_SIZE = 50;

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
                value: '',
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

const TeamPickerPage2 = (props: any) => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onSelectionDone, users, excludedUsers, allowMulti, initialSelection } = navigation.state.params;
    const { t } = useTranslation('PeoplePickerPage');
    const [memberships, setMemberships] = useState<Membership[]>(users || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<User[]>(defaultTo(initialSelection, []));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [count, setCount] = useState(1);
    //const conversationId = props.attrs.id;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentUser, isAuthenticated } = AuthStore.useContainer();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [conversation, setConversation] = useState<NSChat.Conversation>(null);
    const onDone = navigation.getParam(PARAM_ON_DONE);

    const { activeConversation } = useContext(ChatContext);
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
    const handlePress = async (user: User, flag) => {
        // sendbird log
        //await sendBirdLog('activeConversationId', user.id);
        const lg = new log();

        //global.lg.sendberdInvite("sss",user.id)

        //Alert.alert('start Teampickerssssssssssss hondole');
        //Alert.alert('ssss' + activeConversationId);
        console.log(activeConversationId);
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
        if (flag == true) {
            await lg.sendBirdLog('sss', ' ユーザーの削除 ');
            await lg.sendberdLeave('sss', '0267210a-92f8-4539-bfed-651f7f688b28');
        } else {
            await lg.sendBirdLog('sss', ' ユーザーの登録 ');
            await lg.sendberdInvite('sss', '0267210a-92f8-4539-bfed-651f7f688b28');
        }
        //global.lg.sendBirdLog(activeConversationId,"ユーザーのフラグの削除"+flag)
        //await sendBirdLog('', "ユーザーの追加と削除");

        //await ch.sendBirdLog(activeConversationId, '------- chat seveice start team dddddddddpicker ')
        //Alert.alert(activeConversationId)
        //    chatService.sendBirdLog("activeConversationId",activeConversationId)

        //    chatService.getmeta(activeConversationId);
        // console.log("user  ----------------------------------------------------------------")
        // console.log(user)
        //chatService.channelAddMember("sendbird_group_channel_64270412_c5b19ef1ab0102b833a3f45d164a99c9e7a1f012","ee30426f-457d-41d1-9b6d-d6c1476e1023")

        //let conversation = conversations.find((c: NSChat.Conversation) => c.id === activeConversationId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //let chant = chatService.getChannelById(activeConversationId);
        // console.log("---------------////////////////////////////////////////////////////////")
        // console.log(chant)
        // Alert.alert(chant)
        //console.log(chant.)r
        // console.log("---------------////////////////////////////////////////////////////////")

        //   chatService.updatemeta(activeConversationId, 'assssssssdddddddddddddssssssa', 'ddssssssssccccccccccccsssssssssssssss');
        //       let chan = chatService._sbGetGroupChannel(activeConversationId);
        //  console.log(chan)
        //      let con = chatService.getConversationById(activeConversationId);
        //  console.log("convesation === "+con)
        //console.log(con.getMetadata())
        //      let c = chatService.channelAddMember(conversation, user);
        //  console.log(c[Symbol.toStringTag])
        //  alert(conversationId)
        //  console.log("sssss")

        //console.log('//////////////////////////////');
        //console.log(conversation)
        //console.log('-------------------------------------------------------------------------');
        //console.log(user.)
        //console.log(activeConversationId);
        //conversation = conversations.find((c: NSChat.Conversation) => c.id === activeConversationId);

        // if (allowMulti) {
        //     chatService.addUser('sss', 'aa');
        //console.log('ddddddddddddddddddddddddddddddddddddddddddddaaaaalllllllllllllllllllddddddddddd');
        //console.log(user);
        //console.log(selection)

        // const client = ...
        /*
        client
            .query({
                query: gql`
                    query {
                        allIngredients {
                            id
                        }
                    }
                `,
            })
            .then(result => console.log(result));

         */
        //console.log("TeamPagePage2 190 343434343434343------------------- ")
        //     console.dir(result);
        //console.log(result["data"])
        //console.log(JSON.stringify(result))

        //もしTreuだったら、削除　False　ただ　add
        /*
        let res = fetch('https://dev.withtree.com/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue',
            }),
        });

         */
        //console.log(res)
        const exists = typeof selection.find(member => member.id === user.id) !== 'undefined';
        //console.log(exists)
        if (exists) {
            setSelection(
                selection.filter(member => {
                    return member.id !== user.id;
                })
            );
        } else {
            setSelection(union(selection, [user]));
        }
        // } else {
        //     onSelectionDone && onSelectionDone([user]);
        //     navigation.goBack();
        // }
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
                buttonTitle={t`Set Logo`}
                desktopWidth={ItemWidth.narrow}
                imageUrl={IMG || ''}
                onUploaded={(fileUrl: string) => {
                    // eslint-disable-next-line no-undef
                    //setFieldValue('spaceIconUrl', fileUrl);
                }}
            />
            <BlockGalleryPage />
            <SearchField
                placeholder={t`Filter eeeeeeby name...`}
                onChangeText={handleSearchInput}
                autoCapitalize="none"
            />
            <Spacer />
            {loading && <Text text={t`Loading space members...`} light small center />}

            {currentPageResults.map((membership, index) => {
                //console.log("count aaaaaaaaaaaaaaaaaa"+count)
                const selected = typeof selection.find(member => member.id === membership.member.id) !== 'undefined';
                //console.log(member.id)
                //console.log(membership.member.avatarUrl)
                //membership.member.familyName = "ssss"
                //membership.member.givenName = "givine"

                //console.log(membership.member)
                let flag = false;

                let xxx = '';
                //console.log("conversations 291 "+conversations.values())

                if (selected === false) {
                    for (xxx in activeConversation.members) {
                        //xxx.
                        //console.log("ddddddddddddd aaaaaaaaaaaaaaaaaaaaaaaaaa")
                        //console.log("295   "+activeConversation.members[xxx]._sbUser)
                        //console.log("296   my membership "+myMembership.member)
                        //console.log(membership.member)
                        //flag = selected;
                        // console.log(chat.userId)
                        // console.log(membership.member.givenName + " " + membership.member.familyName)
                        // console.log("activeCOnv 297 "+activeConversation.members[xxx])
                        // console.log(membership.member)
                        if (
                            membership.member.givenName + ' ' + membership.member.familyName ===
                            activeConversation.members[xxx]._sbUser.nickname
                        ) {
                            console.log('■ーーーーーーーーーーーーーーーーーーーーーー');
                            console.log(activeConversation.members[xxx]);
                            console.log(activeConversation.members[xxx]._sbUser.userId);
                            console.log('line 310 is');
                            ///  console.log("dfdfdfdfdfdfdfdfdfddd aaaaaaaaaaaaaaaaaaaaaaaaaa")
                            //  membership.member.id = activeConversation.members[xxx]._sbUser.id
                            //    console.log(activeConversation.members[xxx]._sbUser)
                            //    console.log(membership.member)
                            flag = true;
                        } //else{
                        //console.log("false aaaaaaaaaaaaaaaaaaaaaaaaaa")
                        //console.log(activeConversation.members[xxx]._sbUser.userId)
                        //console.log(membership.member.id)
                        // flag = false;
                        //}
                    }
                } else {
                    flag = selected;
                }

                return (
                    <UserItem
                        key={index}
                        user={membership.member}
                        onPress={() => handlePress(membership.member, flag)}
                        selected={flag}
                    />
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
TeamPickerPage2.navigationOptions = navigationOptions;

export default TeamPickerPage2;
