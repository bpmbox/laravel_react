import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { IconId } from '../../../../assets/native/svg-icons';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../../../components/Navigation/NavButtons';
import NavButton from '../../../../components/UIKit/Button/NavButton';
import GroupItem from '../../../../components/UIKit/items/GroupItem';
import Heading from '../../../../components/UIKit/items/Heading';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import TagX from '../../../../components/UIKit/items/TagX';
import UserItem from '../../../../components/UIKit/items/UserItem';
import Page from '../../../../components/UIKit/Layout/Page';
import Row from '../../../../components/UIKit/Layout/Row';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { formatDisplayName } from '../../../../libs/user-utils';
import { HorizontalOffset } from '../../../../theme.style';
import historyService from '../../../../services/history';

// all parameters passed between modal and nav bar
const NAV_PARAMS = {
    navOnDone: 'navOnDone',
    navSearchOnChangeText: 'navSearchOnChangeText',
    navSearchText: 'navSearchText',
};

// a constant representing a group containing Everyone
const EVERYONE_GROUP: Group = {
    id: '',
    name: i18n.t`UserPicker::Everyone`,
};

// a constant representing the default attribute values
const DEFAULT_ATTRS = {
    allowMultiSelect: true,
    includeUserGroups: true,
    label: i18n.t`UserPicker::User Picker`,
    onChange: (_selection: (User | Group)[]) => {},
};

// returns an array of users/groups that match the given filter text; declared
// outside the component so it is created only once and can be debounced
const findMatches = (
    users: User[],
    groups: Group[],
    selection: (User | Group)[],
    searchText: string,
    includeGroups: boolean
): (User | Group)[] => {
    // TODO: Fuze fuzzy matching
    // (for now, show any unselected users/groups that contain
    // the search text as a substring)
    const matcher = (item: User | Group) => {
        const name = (
            (item as Group).name || formatDisplayName(item as User)
        ).toLowerCase();
        return (
            (searchText.length === 0 ||
                name.includes(searchText.toLowerCase())) &&
            !selection.find(element => {
                return element.id === item.id;
            })
        );
    };

    let matches = [];
    if (searchText.length > 0) {
        // search for users/groups that match the given query
        matches = users.filter(matcher);
        if (includeGroups) {
            matches = matches.concat(groups.filter(matcher));
        }
    } else if (includeGroups && groups && groups.length > 0) {
        // if no query specified, show all user groups
        matches = groups.filter(matcher);
    }
    return matches;
};

// called to re-search the users/groups for ones that match;
// debounced to avoid excessive re-renders
const findMatchesDebounced = debounce(
    (users, groups, selection, searchText, includeGroups, setMatches) => {
        const matches = findMatches(
            users,
            groups,
            selection,
            searchText,
            includeGroups
        );
        setMatches(matches);
    },
    200,
    {
        maxWait: 500,
        trailing: true,
    }
);

const UserPickerModal = props => {
    const { t } = useTranslation('UserPicker');

    // initial state will be set on focus by onWillFocus function below
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [attrs, setAttrs] = useState(DEFAULT_ATTRS);
    const [everyone, setEveryone] = useState(false);
    const [selection, setSelection] = useState<(User | Group)[]>([]);
    const [matches, setMatches] = useState<(User | Group)[]>([]);
    const [searchText, setSearchText] = useState('');

    // called by the user onPress handlers to immediately update the list of
    // matches when a user is clicked to add or remove them from the selection
    const updateMatches = newSelection =>
        setMatches(
            findMatches(
                users,
                groups,
                newSelection,
                searchText,
                attrs.includeUserGroups
            )
        );

    // sets initial state based on nav parameters;
    // will update if parent block's data changes
    const onWillFocus = () => {
        if (!users || users.length === 0) {
            const initialAttrs = Object.assign(
                {},
                DEFAULT_ATTRS,
                props.navigation.getParam('attrs') || {}
            );
            const paramSelection = props.navigation.getParam('selection');
            const isEveryone =
                paramSelection &&
                paramSelection.length === 1 &&
                paramSelection[0].id === '' &&
                paramSelection[0].name === t`Everyone`;
            const value = props.navigation.getParam('value');

            const initialUsers = (value && value.users) || [];
            const initialGroups = (value && value.userGroups) || [];
            const initialSelection = (!isEveryone && paramSelection) || [];

            setAttrs(initialAttrs);
            setEveryone(isEveryone);
            setUsers(initialUsers);
            setGroups(initialGroups);
            setSelection(initialSelection);

            if (initialAttrs.includeUserGroups && initialGroups.length > 0) {
                setMatches(initialGroups);
            }
        }
    };

    // called when a user from the search results or groups list is pressed;
    // adds that user or group to the selection
    const onUserPress = (user: User | Group) => {
        let newSelection = [];
        if (attrs.allowMultiSelect) {
            // multiple select; avoid duplicates
            if (selection.find(element => element.id === user.id)) {
                return;
            }

            newSelection = [...selection];
            newSelection.push(user);
        } else {
            // single select; pick only a single user and send them back
            newSelection = [user];
        }
        setSelection(newSelection);
        updateMatches(newSelection);
        if (attrs.onChange) {
            attrs.onChange(newSelection);
        }

        if (!attrs.allowMultiSelect) {
            historyService.goBackModal(newSelection);
        }
    };

    // Called when the 'X' on a tag is clicked to remove that user/group from selection
    const onSelectionRemove = user => {
        const newSelection = selection.filter(item => item.id !== user.id);
        setSelection(newSelection);
        updateMatches(newSelection);
        if (attrs.onChange) {
            attrs.onChange(newSelection);
        }
    };

    // called when the Everyone group is checked/unchecked
    const onEveryoneChange = _event => {
        setEveryone(!everyone);
        if (attrs.onChange) {
            attrs.onChange(everyone ? selection : [EVERYONE_GROUP]);
        }
    };

    // find list of users/groups that match the search text;
    // this is updated on a delay using debounce
    useEffect(() => {
        if (users.length > 0 || groups.length > 0) {
            findMatchesDebounced(
                users,
                groups,
                selection,
                searchText,
                attrs.includeUserGroups,
                setMatches
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    let matchesText = '';
    if (searchText.length > 0) {
        matchesText = matches.length > 0 ? t`Results` : t`No results`;
    } else if (attrs.includeUserGroups && groups && groups.length > 0) {
        matchesText = t`User Groups`;
    }

    // set up communication between the modal and the nav bar
    useEffect(() => {
        // called when the nav header Back button is clicked;
        // closes the modal and returns to the previous page
        const navBackOnPress = () => {
            historyService.goBackModal(null);
        };

        // called when the nav header checkmark or 'Done' button is clicked;
        // closes the modal and sends back the selected users to the UserPicker block
        const navOnDone = () => {
            if (everyone) {
                // send back ALL users/groups
                historyService.goBackModal([EVERYONE_GROUP]);
            } else {
                historyService.goBackModal(selection);
            }
        };

        // called when the user types characters in the nav bar Search box;
        // uses that text for a filter and displays matching users/groups
        const navSearchOnChangeText = setSearchText;

        props.navigation.setParams({
            navBackOnPress: navBackOnPress,
            navOnDone: navOnDone,
            navSearchOnChangeText: navSearchOnChangeText,
            navSearchText: searchText,
        });
        // (disabling lint warning because adding props.navigation
        // as a dependency introduces an infinite render cycle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [everyone, searchText, selection]);

    return (
        <Page>
            <NavigationEvents onWillFocus={onWillFocus} />

            <GroupItem
                key="everyone-group"
                group={EVERYONE_GROUP}
                toggled={everyone}
                onPress={onEveryoneChange}
            />

            {!everyone && (
                <Row padding={HorizontalOffset.default} wrap>
                    {selection.map((item: any) => {
                        const name = item.givenName
                            ? t('{{givenName}} {{familyName}}', {
                                  givenName: item.givenName,
                                  familyName: item.familyName,
                              })
                            : item.name;
                        return (
                            <TagX
                                key={'selection-' + item.id}
                                title={name}
                                onPressX={() => onSelectionRemove(item)}
                            />
                        );
                    })}
                </Row>
            )}

            {!everyone && (
                <Heading key="matches-heading" text={matchesText} h2 />
            )}

            {!everyone && (
                <FlatList
                    data={matches}
                    key="userList"
                    keyExtractor={item => 'query-results-' + item.id}
                    renderItem={({ item }) => {
                        if ((item as User).givenName) {
                            return (
                                <UserItem
                                    user={item as User}
                                    onPress={() => onUserPress(item)}
                                />
                            );
                        } else {
                            return (
                                <GroupItem
                                    group={item as Group}
                                    onPress={() => onUserPress(item)}
                                />
                            );
                        }
                    }}
                />
            )}
        </Page>
    );
};

/**
 * The user picker modal has a back button at left, a search input box in the center
 * for searching for users/groups, and a check mark button at right to close the modal.
 */
// @ts-ignore
UserPickerModal.navigationOptions = ({ navigation }) => {
    if (navigation) {
        historyService.setNavigation(navigation);
    }

    // central search text box
    const centerInput = (
        <SingleLineInput
            defaultValue={navigation.getParam(NAV_PARAMS.navSearchText)}
            placeholder={i18n.t`UserPicker::Search`}
            onChangeText={navigation.getParam(NAV_PARAMS.navSearchOnChangeText)}
        />
    );

    // right header shows text 'Done' on iOS, check-mark icon on Android
    const rightHeader =
        Platform.OS === 'android'
            ? {
                  headerRight: (
                      <NavButton
                          iconId={IconId.system_checkmark}
                          onPress={navigation.getParam(NAV_PARAMS.navOnDone)}
                      />
                  ),
              }
            : getRightActionHeader(
                  i18n.t('Done'),
                  true,
                  true,
                  navigation.getParam(NAV_PARAMS.navOnDone)
              );

    return {
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        headerTitle: () => centerInput,
        ...rightHeader,
    };
};

export default withNavigation(UserPickerModal);
