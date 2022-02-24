import { withNavigation } from '@react-navigation/core';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../../../components/UIKit/items/Button';
import SearchField from '../../../../components/UIKit/items/SearchField';
import SettingsInvitationItem from '../../../../components/UIKit/items/SettingsInvitationItem';
import SettingsUserItem from '../../../../components/UIKit/items/SettingsUserItem';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Text from '../../../../components/UIKit/items/Text';
import Container from '../../../../components/UIKit/Layout/Container';
import Page from '../../../../components/UIKit/Layout/Page';
import Row from '../../../../components/UIKit/Layout/Row';
import i18n from '../../../../i18n';
import { isMobilePlatform } from '../../../../libs/platform';
import useListener from '../../../../libs/use-listener';
import useQueryPaginationState from '../../../../libs/use-query-pagination-state';
import useSearch from '../../../../libs/use-search';
import routes from '../../../../routes';
import { ButtonSize, ButtonType, ItemHeight, ItemWidth } from '../../../../theme.style';
import messageService from '../../../../services/message';
import spaceService, {
    SPACES_NEW_INVITATION_SENT_EVENT,
    SPACES_UPDATED_EVENT,
    SPACES_INVITATION_CANCELED_EVENT,
    SPACES_INVITATION_UPDATED_EVENT,
} from '../../../../services/space';
import AuthStore from '../../../../store/auth';
import { isAtLeastAdmin, Role } from '../../../../types/enums';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../SpaceContext';
import { formatDisplayName } from '../../../../libs/user-utils';

const PAGINATION_SIZE = 50;

const t = (text: any, ...args: any[]) => i18n.t(`PeopleListPage::${text}`, ...args);

type PeopleListPageState = {
    isSoleOwner: boolean;
    memberships: Membership[];
    invitations: Invitation[];
    loading: boolean;
    error: Error | null;
};

type PeopleListSearchable = {
    email: String;
    givenName: string;
    familyName: string;
    fullName: string;
    role: Role;
};

type MemberSearchEntry = {
    member: User;
    role: Role;
} & PeopleListSearchable;

type InviteSearchEntry = {
    invitation: Invitation;
} & PeopleListSearchable;

type PeopleListSearchableEntry = MemberSearchEntry | InviteSearchEntry;

const SEARCH_WEIGHTS = [
    { path: 'email', weight: 0.4 },
    { path: 'givenName', weight: 0.3 },
    { path: 'familyName', weight: 0.2 },
    // Full name is a computed value. This is needed for situations we want
    // to search partial match across first and last name.
    { path: 'fullName', weight: 0.1 },
];

const PeopleListPage: FunctionComponent<{ navigation: any }> = props => {
    const { navigation } = props;
    const { currentUser } = AuthStore.useContainer();
    const { space, role } = useContext(SpaceContext);

    // State vars
    const [state, setState] = useState<PeopleListPageState>({
        loading: true,
        isSoleOwner: false,
        memberships: [],
        invitations: [],
        error: null,
    });

    // State to track query entered and pagination
    const { queryState, queryActions } = useQueryPaginationState();

    const { results, all, setQuery, setData } = useSearch<PeopleListSearchableEntry>(SEARCH_WEIGHTS);

    // -- Computed Properties --
    // Use all results if search query is empty.
    const filteredResults = queryState.queryString && queryState.queryString.length > 0 ? results : all;
    // used for pagination
    const maxPage = Math.ceil(filteredResults.length / PAGINATION_SIZE);

    // -- Init --
    const updateMemberships = async () => {
        setState({
            ...state,
            loading: true,
        });

        try {
            const members = await spaceService.getMembers(space);
            const isSoleOwner = await spaceService.isSoleOwner(currentUser, space);
            let invitations: Invitation[] = [];
            if (isAtLeastAdmin(role)) {
                invitations = await spaceService.getInvitations(space);
            }

            setState({
                loading: false,
                isSoleOwner,
                memberships: members,
                invitations: invitations,
                error: null,
            });
        } catch (err) {
            messageService.sendError(t`Unable to retrieve members.`);
            setState({
                ...state,
                loading: false,
                error: err,
            });
        }
    };

    useEffect(() => {
        // wait till both space and currentUser is defined before loading memberships.
        if (!space || !currentUser) {
            return;
        }

        (async () => {
            await updateMemberships();
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, space]);

    useListener(spaceService, SPACES_UPDATED_EVENT, updateMemberships);
    // Note: Currently role update also emits SPACES_UPDATED_EVENT, so we don't need
    // to listen on Role updated.
    // useListener(spaceService, SPACES_USER_ROLE_UPDATED_EVENT, updateMemberships);
    useListener(spaceService, SPACES_NEW_INVITATION_SENT_EVENT, updateMemberships);
    useListener(spaceService, SPACES_INVITATION_CANCELED_EVENT, updateMemberships);
    useListener(spaceService, SPACES_INVITATION_UPDATED_EVENT, updateMemberships);
    
    // -- Observers --

    // Update search index when data source changes.
    useEffect(() => {
        // building our search index.
        const searchEntries: PeopleListSearchableEntry[] = [];

        state.memberships.forEach(x => {
            searchEntries.push({
                email: x.member.email,
                familyName: x.member.familyName,
                givenName: x.member.givenName,
                fullName: formatDisplayName(x.member),
                member: x.member,
                role: x.role,
            } as MemberSearchEntry);
        });

        state.invitations.forEach(x => {
            const user = x.user;
            searchEntries.push({
                email: x.email,
                familyName: user ? user.familyName : '',
                givenName: user ? user.givenName : '',
                fullName: user ? formatDisplayName(user) : '',
                invitation: x,
                role: x.role,
            } as InviteSearchEntry);
        });

        setData(searchEntries);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.memberships, state.invitations]);

    // Update search query when search input changes.
    useEffect(() => {
        setQuery(queryState.queryString);
        // only run this on querystring change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryState.queryString]);

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

    // -- User input action handlers --

    const handleSearchInput = (text: string) => {
        queryActions.setQuery(text);
    };

    const handleRolePress = (membership: Membership) => {
        navigation.push(routes.SETTINGS_SPACE_PEOPLE_CHANGE_ROLE, {
            user: membership.member,
        });
    };

    const handleInvitePress = (invitation: Invitation) => {
        navigation.push(routes.SETTINGS_SPACE_PEOPLE_CHANGE_ROLE, {
            invitation: invitation,
        });
    };

    const handleOnInvitePress = () => {
        navigation.push(routes.SETTINGS_SPACE_PEOPLE_INVITE);
    };

    const sortedResults = sortBy(filteredResults, searchEntry => searchEntry.fullName);

    const currentPageResults = slice(
        sortedResults,
        (queryState.page - 1) * PAGINATION_SIZE,
        queryState.page * PAGINATION_SIZE
    );

    const canInviteAndEditUsers = isAtLeastAdmin(role);

    if (state.loading) {
        return <FullPageLoading />;
    }

    // -- Rendering --
    return (
        <Page scrollable>
            <Container desktopWidth={ItemWidth.wide}>
                {canInviteAndEditUsers && renderAdminSearchInviteControls(handleOnInvitePress, handleSearchInput)}
                {!canInviteAndEditUsers && renderNonAdminSearchControls(handleSearchInput)}
                <Spacer height={ItemHeight.xsmall} />
                {state.loading && <Text text={t`Loading space members...`} light small center />}
                {currentPageResults.map((searchEntry: PeopleListSearchableEntry, index) => {
                    if (searchEntry.hasOwnProperty('member')) {
                        const member = (searchEntry as MemberSearchEntry).member;
                        const memberRole = (searchEntry as MemberSearchEntry).role;

                        return renderMemberItem(
                            {
                                member,
                                role: memberRole,
                            },
                            index,
                            canInviteAndEditUsers,
                            handleRolePress
                        );
                    } else {
                        const invitation = (searchEntry as InviteSearchEntry).invitation;
                        return renderInvitation(invitation, index, canInviteAndEditUsers, handleInvitePress);
                    }
                })}
                {!state.loading && currentPageResults.length === 0 && queryState.queryString.length > 0 && (
                    <Text text={t`No results.`} light small center />
                )}
                {!state.loading && currentPageResults.length === 0 && queryState.queryString.length === 0 && (
                    <Text text={t`There are currently no members in this space.`} light small center />
                )}
                <Spacer height={ItemHeight.xsmall} />
            </Container>
        </Page>
    );
};

function renderMemberItem(
    membership: Membership,
    index: number,
    canInviteAndEditUsers: boolean,
    handleRolePress: (membership: Membership) => void
): JSX.Element {
    return (
        <SettingsUserItem
            testID={`SettingsUserItem_${membership.member.id}`}
            key={index}
            user={membership.member}
            role={membership.role}
            onRolePress={canInviteAndEditUsers ? () => handleRolePress(membership) : null}
            showRole={canInviteAndEditUsers}
            desktopWidth={ItemWidth.wide}
        />
    );
}

function renderInvitation(
    invitation: Invitation,
    index: number,
    canInviteAndEditUsers: boolean,
    handleInvitePress: (email: Invitation) => void
): JSX.Element {
    return (
        <SettingsInvitationItem
            testID={`SettingsInvitationItem_${invitation.email}`}
            key={index}
            invitation={invitation}
            showRole={canInviteAndEditUsers}
            onRolePress={canInviteAndEditUsers ? () => handleInvitePress(invitation) : null}
            desktopWidth={ItemWidth.wide}
        />
    );
}

function renderNonAdminSearchControls(handleSearchInput: (text: string) => void): React.ReactNode {
    return (
        <>
            <Spacer height={ItemHeight.xsmall} />
            <SearchField
                placeholder={t`Filter by name...`}
                onChangeText={handleSearchInput}
                autoCapitalize="none"
                desktopWidth={ItemWidth.narrow}
            />
        </>
    );
}

function renderAdminSearchInviteControls(
    handleOnInvitePress: () => void,
    handleSearchInput: (text: string) => void
): React.ReactNode {
    // Mobile View
    // Note: Main differrence is arrangement of the Add Member button.
    if (isMobilePlatform) {
        return (
            <>
                <Spacer height={ItemHeight.xsmall} />
                <Button text={t`Add a Member`} type={ButtonType.success} onPress={handleOnInvitePress} />
                <Spacer height={ItemHeight.xsmall} />
                <Row>
                    <View style={styles.searchFieldStyle}>
                        <SearchField
                            placeholder={t`Filter by name...`}
                            onChangeText={handleSearchInput}
                            autoCapitalize="none"
                        />
                    </View>
                </Row>
            </>
        );
    }

    // Desktop view
    return (
        <>
            <Spacer height={ItemHeight.xsmall} />
            <Row>
                <View style={styles.searchFieldStyle}>
                    <SearchField
                        placeholder={t`Filter by name...`}
                        onChangeText={handleSearchInput}
                        autoCapitalize="none"
                    />
                </View>
                <Button
                    text={t`Add a Member`}
                    size={ButtonSize.small}
                    onPress={handleOnInvitePress}
                    desktopWidth={ItemWidth.fit}
                />
            </Row>
        </>
    );
}

const styles = StyleSheet.create({
    searchFieldStyle: {
        flex: 1,
    },
});

// @ts-ignore
PeopleListPage.path = 'settings/people'; //override path for better web URLs

export default withNavigation(PeopleListPage);
