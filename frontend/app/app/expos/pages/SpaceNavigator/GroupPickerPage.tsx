import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import union from 'lodash/union';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import SearchField from '../../components/UIKit/items/SearchField';
import Spacer from '../../components/UIKit/items/Spacer';
import Text from '../../components/UIKit/items/Text';
import UserGroupSelectionItem from '../../components/UIKit/items/UserGroupSelectionItem';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import useListener from '../../libs/use-listener';
import useQueryPaginationState from '../../libs/use-query-pagination-state';
import useSearch from '../../libs/use-search';
import { DesktopHeaderType, ItemHeight } from '../../theme.style';
import groupService, {
    GROUP_ADDED_EVENT,
    GROUP_MEMBERS_UPDATED_EVENT,
    GROUP_REMOVED_EVENT,
    GROUP_UPDATED_EVENT,
} from '../../services/group';
import historyService from '../../services/history';
import messageService from '../../services/message';
import { PARAM_ON_DONE, PARAM_ON_SELECTION_DONE } from '../../constants';

const PAGINATION_SIZE = 50;

const GroupPickerPage = (props: any) => {
    const { t } = useTranslation('GroupPickerPage');
    const { navigation } = props;
    const __groupService: NSGroupService.IGroupService = props.__groupService || groupService;
    const { space, onSelectionDone, excludedGroups, allowMulti, initialSelection } = navigation.state.params;
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<Group[]>(defaultTo(initialSelection, []));

    const { results, setQuery, setData } = useSearch<NSGroupService.GroupWithMemberCount>([
        { path: 'name', weight: 1.0 },
    ]);

    // State to track query entered and pagination
    const { queryState, queryActions } = useQueryPaginationState();

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const newGroups = await __groupService.getGroups(space, true);
            setGroups(sortBy(newGroups, ['name']));
        } catch (err) {
            messageService.sendError(t`Unable to retrieve groups.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useListener(__groupService, GROUP_ADDED_EVENT, fetchGroups);
    useListener(__groupService, GROUP_REMOVED_EVENT, fetchGroups);
    useListener(__groupService, GROUP_UPDATED_EVENT, fetchGroups);
    useListener(__groupService, GROUP_MEMBERS_UPDATED_EVENT, fetchGroups);

    // Update search index when data source changes.
    useEffect(() => {
        setData(groups as NSGroupService.GroupWithMemberCount[]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups]);

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
                navigation.goBack();
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    const handlePress = (group: Group) => {
        if (allowMulti) {
            const exists = selection.some(g => g.id === group.id);
            if (exists) {
                setSelection(
                    selection.filter(g => {
                        return g.id !== group.id;
                    })
                );
            } else {
                setSelection(union(selection, [group]));
            }
        } else {
            onSelectionDone && onSelectionDone([group]);
            navigation.goBack();
        }
    };

    // Use all results if search query is empty.
    const filteredResults = queryState.queryString && queryState.queryString.length > 0 ? results : groups;

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
        group => group.name
    );

    return (
        <Page scrollable>
            <SearchField placeholder={t`Filter by name...`} onChangeText={handleSearchInput} autoCapitalize="none" />
            <Spacer />
            {loading && <Text text={t`Loading groups...`} light small center />}
            {currentPageResults.map((group, index) => {
                const selected = typeof selection.find(g => group.id === g.id) !== 'undefined';
                return (
                    <UserGroupSelectionItem
                        key={index}
                        group={group}
                        onPress={() => handlePress(group)}
                        checked={selected}
                    />
                );
            })}
            {!loading && currentPageResults.length === 0 && queryState.queryString.length > 0 && (
                <Text text={t`No results.`} light small center />
            )}
            {!loading &&
                currentPageResults.length === 0 &&
                excludedGroups.length > 0 &&
                queryState.queryString.length === 0 && (
                    <Text text={t`All groups have been added.`} light small center />
                )}
            {!loading &&
                currentPageResults.length === 0 &&
                excludedGroups.length === 0 &&
                queryState.queryString.length === 0 && <Text text={t`No groups found.`} light small center />}
            <Spacer height={ItemHeight.xsmall} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof navigation.getParam(PARAM_ON_SELECTION_DONE) !== 'function') {
        navigation.pop();
        return null;
    }

    historyService.setNavigation(navigation);
    const rightHeader = navigation.state.params.allowMulti
        ? getRightActionHeader(i18n.t('Done'), true, true, () => {
              navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
          })
        : {};
    return {
        title: navigation.state.params.title,
        desktopHeaderType: DesktopHeaderType.plain,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
    };
};

// @ts-ignore
GroupPickerPage.navigationOptions = navigationOptions;

export default withNavigation(GroupPickerPage);
