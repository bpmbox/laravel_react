/* istanbul ignore file */
import React, { useEffect, useState, FunctionComponent, useContext } from 'react';
import slice from 'lodash/slice';
import historyService from '../../../../services/history';
import { useTranslation } from 'react-i18next';
import SearchField from '../../../../components/UIKit/items/SearchField';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Button from '../../../../components/UIKit/items/Button';
import Text from '../../../../components/UIKit/items/Text';
import Page from '../../../../components/UIKit/Layout/Page';
import useSearch from '../../../../libs/use-search';
import useQueryPaginationState from '../../../../libs/use-query-pagination-state';
import routes from '../../../../routes';
import groupService, {
    GROUP_ADDED_EVENT,
    GROUP_MEMBERS_UPDATED_EVENT,
    GROUP_REMOVED_EVENT,
    GROUP_UPDATED_EVENT
} from '../../../../services/group';
import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import unionBy from 'lodash/unionBy';
import SettingsUserGroupItem from '../../../../components/UIKit/items/SettingsUserGroupItem';
import { isAtLeastAdmin } from '../../../../types/enums';
import { ItemWidth, ItemHeight, ButtonType, ButtonSize } from '../../../../theme.style';
import { isMobilePlatform } from '../../../../libs/platform';
import Row from '../../../../components/UIKit/Layout/Row';
import { View } from 'react-native';
import Container from '../../../../components/UIKit/Layout/Container';
import { SpaceContext } from '../../SpaceContext';

const PAGINATION_SIZE = 50;

type UserGroupsPageProps = {
    __groupService?: NSGroupService.IGroupService;
    __spaceService?: SpaceServiceTypes.ISpacesService;
};

type GroupListState = {
    groupList: NSGroupService.GroupWithMemberCount[];
    isLoading: boolean;
    isError: boolean;
};

const UserGroupsPage: FunctionComponent<UserGroupsPageProps> = props => {
    // support dependency injection to enable testing in storybook.
    const __groupService: NSGroupService.IGroupService = props.__groupService || groupService;

    const { space, role } = useContext(SpaceContext);
    const { t } = useTranslation('SpaceGroupsPage');

    const [groupListState, setGroupListState] = useState<GroupListState>({
        groupList: [],
        isLoading: true,
        isError: false,
    });

    // Create search index for group search
    const { results, setQuery, setData } = useSearch<NSGroupService.GroupWithMemberCount>([
        { path: 'name', weight: 1.0 }
    ]);

    // State to track query entered and pagination
    const { queryState, queryActions } = useQueryPaginationState();

    /**
     * Init - get groups list with member counts.
     */
    useEffect(() => {
        (async () => {
            try {
                let groups = await __groupService.getGroups(space, true);
                
                // patch toString() method into groups.
                groups = groups.map(x => ({
                    ...x,
                    toString: function() {
                        return this.id;
                    },
                }));

                setGroupListState({
                    groupList: sortBy(groups, ['name']),
                    isLoading: false,
                    isError: false,
                });
            } catch (err) {
                setGroupListState({
                    groupList: [],
                    isLoading: false,
                    isError: true,
                });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space]);

    // update search index when data source changes
    useEffect(() => {
        setData(groupListState.groupList);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupListState.groupList]);

    // Update search query when search input changes.
    useEffect(() => {
        setQuery(queryState.queryString);
        // only run this on querystring change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryState.queryString]);

    // Use all results if search query is empty.
    // istanbul ignore next
    const filteredResults =
        queryState.queryString && queryState.queryString.length > 0
            ? results
            : groupListState.groupList;

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

    const currentPageResults = slice(
        filteredResults,
        (queryState.page - 1) * PAGINATION_SIZE,
        queryState.page * PAGINATION_SIZE
    );

    // ----- Event Listeners to track changes on Group ------
    /**
     * Convenience method for updating the group list while preserving other state props.
     * @param updatedGroupList
     */
    const updateGroupList = (updatedGroupList: NSGroupService.GroupWithMemberCount[]) => {
        setGroupListState({
            ...groupListState,
            groupList: (sortBy(updatedGroupList, ['name'])),
            isLoading: false,
        });
    };

    const groupAddedListener = (group: Group) => {
        updateGroupList([
            ...groupListState.groupList,
            { ...group, memberCount: 0 },
        ]);
    };

    const groupRemovedListener = (group: Group) => {
        updateGroupList(
            remove(groupListState.groupList, x => x.id !== group.id)
        );
    };

    const groupRenamedListener = (group: Group) => {
        const updatedGroupList = groupListState.groupList.map(x => {
            return {
                ...x,
                name: x.id === group.id ? group.name : x.name,
            };
        });
        updateGroupList(updatedGroupList);
    };

    const groupMembersUpdatedListener = (group: Group, members: User[]) => {
        const updatedGroupWithCount: NSGroupService.GroupWithMemberCount = {
            ...group,
            memberCount: members.length,
        };

        // Update our list of groups by merging the updated groups while contraining 'id' as unique.
        const updatedGroupList: NSGroupService.GroupWithMemberCount[] = unionBy(
            [updatedGroupWithCount],
            groupListState.groupList,
            'id'
        );
        updateGroupList(updatedGroupList);
    };

    useEffect(() => {
        __groupService.addListener(GROUP_ADDED_EVENT, groupAddedListener);
        __groupService.addListener(GROUP_REMOVED_EVENT, groupRemovedListener);
        __groupService.addListener(GROUP_UPDATED_EVENT, groupRenamedListener);
        __groupService.addListener(GROUP_MEMBERS_UPDATED_EVENT, groupMembersUpdatedListener);

        return () => {
            __groupService.removeListener(GROUP_ADDED_EVENT, groupAddedListener);
            __groupService.removeListener(GROUP_REMOVED_EVENT, groupRemovedListener);
            __groupService.removeListener(GROUP_UPDATED_EVENT, groupRenamedListener);
            __groupService.removeListener(GROUP_MEMBERS_UPDATED_EVENT, groupMembersUpdatedListener);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupListState.groupList]);

    const handleSearchInput = (text: string) => {
        queryActions.setQuery(text);
    };

    const handleOnCreatePress = () => {
        historyService.push(routes.SETTINGS_SPACE_PEOPLE_CREATE_USER_GROUP, {
            space: space,
        });
    };

    const handleOnConfigurePress = group => {
        historyService.push(routes.SETTINGS_SPACE_PEOPLE_USER_GROUP_DETAILS, {
            space: space,
            group: group,
        });
    };

    const canCreateOrConfigureGroups = isAtLeastAdmin(role);

    return (
        <Page scrollable>
            <Container desktopWidth={ItemWidth.wide}>
                {canCreateOrConfigureGroups &&
                    <>
                        <Spacer height={ItemHeight.xsmall}/>
                        { isMobilePlatform ?
                            <Button text={t`Create a Group`} type={ButtonType.success} onPress={handleOnCreatePress} desktopWidth={ItemWidth.fit}/> :
                            <Row>
                                <View style={{flex: 1}}>
                                    <SearchField placeholder={t`Filter by name...`} onChangeText={handleSearchInput} autoCapitalize='none' />
                                </View>
                                <Button text={t`Create a Group`} buttonSize={ButtonSize.small} onPress={handleOnCreatePress} desktopWidth={ItemWidth.fit}/>
                            </Row>
                        }
                    </>
                }
                { (!canCreateOrConfigureGroups || isMobilePlatform) &&
                    <>
                        <Spacer height={ItemHeight.xsmall}/>
                        <SearchField placeholder={t`Filter by name...`} onChangeText={handleSearchInput} autoCapitalize='none' />
                    </>
                }
                <Spacer height={ItemHeight.xsmall}/>
                { groupListState.isLoading && <Text text={t`Retrieving groups...`} light small center />}
                { groupListState.isError && !groupListState.isLoading && <Text text={t`Error retrieving groups.`} light small center />}
                { currentPageResults.map((group, index) => {
                    return canCreateOrConfigureGroups ?
                        <SettingsUserGroupItem key={index} group={group} onConfigurePress={() => { handleOnConfigurePress(group) }} /> :
                        <SettingsUserGroupItem key={index} group={group} onPress={() => { handleOnConfigurePress(group) }} />
                })}
                { !groupListState.isLoading && !groupListState.isError && currentPageResults.length === 0 && queryState.queryString.length > 0 &&
                    <Text text={t`No results.`} light small center />
                }
                { !groupListState.isLoading && !groupListState.isError && currentPageResults.length === 0 && queryState.queryString.length === 0 &&
                    <Text text={t`There are no groups.`} light small center />
                }
                <Spacer height={ItemHeight.xsmall} />
            </Container>
        </Page>
    );
};

export default UserGroupsPage;
