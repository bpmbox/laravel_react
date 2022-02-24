import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import debounce from 'lodash/debounce';
import defaultTo from 'lodash/defaultTo';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import useSearch from '../../../../libs/use-search';
import alertService from '../../../../services/alert';
import groupService, { GROUP_MEMBERS_UPDATED_EVENT } from '../../../../services/group';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import { isAtLeastAdmin, Role } from '../../../../types/enums';
import {
    dynamicDesktopModalHeight,
    getModalHeader,
    ModalButtonType,
} from '../../../../components/Navigation/NavButtons';
import Button from '../../../../components/UIKit/items/Button';
import SearchField from '../../../../components/UIKit/items/SearchField';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import SettingsGroupMemberItem from '../../../../components/UIKit/items/SettingsGroupMemberItem';
import SimpleListButton from '../../../../components/UIKit/items/SimpleListButton';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Text from '../../../../components/UIKit/items/Text';
import Page from '../../../../components/UIKit/Layout/Page';
import { PARAM_GROUP, PARAM_ON_SELECTION_DONE } from '../../../../constants';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import routes from '../../../../routes';
import historyService from '../../../../services/history';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../../theme.style';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../SpaceContext';
import useListener from '../../../../libs/use-listener';
import { formatDisplayName } from '../../../../libs/user-utils';

const debouncer = debounce(
    callback => {
        callback();
    },
    200,
    {
        maxWait: 500,
        trailing: true,
    }
);

type GroupMembersState = {
    members: User[];
    isLoading: boolean;
    isError: boolean;
};

type UserWithFullName = User & {
    fullName: string;
};

type GroupFormValues = {
    name: string;
};

type EditUserGroupPageState = {
    // Selected space
    space: Space | null;
    // My role in selected space
    role: Role | null;
    // Selected group.

    group: Group | null;
    isLoading: boolean;
    isError: boolean;
};

const validationSchema = yup.object().shape({
    name: yup.string().required(),
});

const SEARCH_CONFIG = [
    { path: 'givenName', weight: 0.3 },
    { path: 'familyName', weight: 0.2 },
    { path: 'fullName', weight: 0.1 },
];

const EditUserGroupPage = (props: any) => {
    const __groupService: NSGroupService.IGroupService = props.__groupService || groupService;
    const { navigation } = props;
    const { space, role } = useContext(SpaceContext);
    const groupParam: Group | string = navigation.getParam(PARAM_GROUP);

    const { t } = useTranslation('EditUserGroupPage');

    // -- State vars --
    const { results: groupMemberResults, setData, setQuery } = useSearch<UserWithFullName>(SEARCH_CONFIG);
    const [spaceGroupState, setSpaceGroupState] = useState<EditUserGroupPageState>({
        space: null,
        role: null,
        group: null,
        isLoading: true,
        isError: false,
    });
    const [queryString, setQueryString] = useState<string>('');

    const [groupMembersState, setGroupMembersState] = useState<GroupMembersState>({
        members: [],
        isLoading: false,
        isError: false,
    });

    // -- Initial Data --

    // fetching group details.
    useEffect(() => {
        if (!space) {
            return;
        }

        (async () => {
            try {
                const group =
                    typeof groupParam === 'string'
                        ? (await spaceService.getGroups(space)).find(x => x.id === groupParam)
                        : (groupParam as Group);

                setSpaceGroupState({
                    space: space,
                    group,
                    role: role,
                    isLoading: false,
                    isError: false,
                });
            } catch (err) {
                console.error('Error encountered while loading space or group', err);
                setSpaceGroupState({
                    space: null,
                    group: null,
                    role: null,
                    isLoading: false,
                    isError: true,
                });
            }
        })();
    }, [groupParam, space, role]);

    // Get initial group members to populate the dialog.
    useEffect(() => {
        if (spaceGroupState.isLoading) {
            return;
        }

        if (spaceGroupState.isError) {
            setGroupMembersState({
                ...groupMembersState,
                isLoading: false,
                isError: true,
            });
            return;
        }

        (async () => {
            try {
                setGroupMembersState({ ...groupMembersState, isLoading: true });
                const members = await __groupService.getMembers(spaceGroupState.space, spaceGroupState.group);
                setGroupMembersState({ members: members, isError: false, isLoading: false });
            } catch (err) {
                setGroupMembersState({ members: [], isError: true, isLoading: false });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spaceGroupState.isLoading]);

    // -- Observers --
    // Observe changes in query string to update search results.
    useEffect(() => {
        setQuery(queryString);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString]);

    // Listener to observe update to group members.
    const updateMembers = (updatedGroup: Group, updatedMembers: User[]) => {
        if (spaceGroupState.group.id !== updatedGroup.id) {
            return;
        }
        setGroupMembersState({ ...groupMembersState, members: updatedMembers });
    };
    useListener(__groupService, GROUP_MEMBERS_UPDATED_EVENT, updateMembers);

    // Observe changes in member composition in order to update search index.
    useEffect(() => {
        setData(
            groupMembersState.members.map(x => ({
                ...x,
                fullName: formatDisplayName(x),
            }))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupMembersState.members]);

    // -- Action Handlers --
    const handleFormSubmit = async (values: { name: string }, _actions: FormikActions<{ name: string }>): Promise<void> => {
        try {
            await validationSchema.validate(values);
            try {
                await groupService.renameGroup(spaceGroupState.space, spaceGroupState.group, values.name);
            } catch (err) {
                messageService.sendError(err.message);
            }
        } catch (err) {
            // empty
        }
    };

    const addUsers = async (users: User[]) => {
        try {
            await __groupService.addMembers(spaceGroupState.space, spaceGroupState.group, users);
        } catch (err) {
            messageService.sendError(err.message);
        }
    };

    const handleOnAddPress = () => {
        navigation.push(routes.PEOPLE_PICKER, {
            title: t`Add Members`,
            space: spaceGroupState.space,
            allowMulti: true,
            excludedUsers: groupMembersState.members,
            [PARAM_ON_SELECTION_DONE]: selection => {
                if (defaultTo(selection, []).length > 0) {
                    addUsers(selection);
                }
            },
        });
    };

    const handleOnDeletePress = () => {
        alertService.alert(
            t('Are you sure you want to delete {{groupName}}?', { groupName: spaceGroupState.group.name }),
            '',
            [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Delete`, style: 'destructive', onPress: handleDeleteGroup },
            ]
        );
    };

    const handleDeleteGroup = async () => {
        try {
            await __groupService.removeGroup(spaceGroupState.space, spaceGroupState.group);
            navigation.goBack();
            messageService.sendError(t('{{groupName}} has been deleted.', { groupName: spaceGroupState.group.name }));
        } catch (err) {
            messageService.sendError(t`An error occurred while trying to remove group. Please try again.`);
        }
    };

    const handleRemoveUserPress = (user: User) => {
        alertService.alert(
            t('Remove {{userName}} from {{groupName}}?', {
                userName: formatDisplayName(user),
                groupName: spaceGroupState.group.name,
            }),
            '',
            [
                { text: t`Cancel`, style: 'cancel' },
                {
                    text: t`Remove`,
                    style: 'destructive',
                    onPress: () => {
                        handleRemoveUser(user);
                    },
                },
            ]
        );
    };

    const handleRemoveUser = async (user: User) => {
        try {
            await __groupService.removeMembers(spaceGroupState.space, spaceGroupState.group, [user])
        } catch (err) {
            messageService.sendError(t`An error occurred while trying to remove the user. Please try again.`);
        }
    };

    const handleSearchInput = (text: string) => {
        setQueryString(text);
    };

    // -- Rendering --
    // handle loading states.
    if (spaceGroupState.isLoading || groupMembersState.isLoading) {
        return <FullPageLoading />;
    }

    if (spaceGroupState.isError || groupMembersState.isLoading) {
        return <ErrorPage code={500} message={t`An Error has occurred.`} />;
    }

    const membersToDisplay: User[] | UserWithFullName[] = queryString ? groupMemberResults : groupMembersState.members;

    const canConfigureGroups = isAtLeastAdmin(spaceGroupState.role);

    return (
        <Page scrollable desktopPadding={PaddingType.all} listensToContentSizeChangeWithNavigation={navigation}>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ name: spaceGroupState.group.name }}
                enableReinitialize
                onSubmit={handleFormSubmit}>
                {(formikProps: FormikProps<GroupFormValues>): ReactNode => {
                    const { values, handleSubmit, handleChange, handleBlur } = formikProps;
                    return (
                        <>
                            {canConfigureGroups && (
                                <>
                                    <SectionHeading text={t`Name`} />
                                    <SingleLineInput
                                        onChangeText={text => {
                                            handleChange('name')(text);
                                            debouncer(handleSubmit);
                                        }}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                        placeholder={t('Enter group name...')}
                                        returnKeyType="go"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoCapitalize="sentences" />
                                    <Spacer height={ItemHeight.xsmall} />
                                    <SimpleListButton text={t`Delete Group`} danger onPress={handleOnDeletePress}/>
                                    <SectionHeading
                                        text={
                                            groupMembersState.members.length === 0
                                                ? t('Members')
                                                : t('Members ({{memberCount}})', {
                                                      memberCount: groupMembersState.members.length,
                                                  })
                                        }
                                    />
                                    <Button text={t`Add Members`} onPress={handleOnAddPress} desktopFitWidth />
                                </>
                            )}
                            <Spacer height={ItemHeight.xsmall} />
                            <SearchField
                                placeholder={t`Filter by name...`}
                                onChangeText={handleSearchInput}
                                autoCapitalize="none"
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            {groupMembersState.isLoading && !groupMembersState.isError && (
                                <Text text={t`Retrieving members...`} light small center />
                            )}
                            {groupMembersState.isError && (
                                <Text text={t`Error retrieving members.`} light small center />
                            )}
                            {membersToDisplay.map((member: User | UserWithFullName, index) => {
                                return (
                                    <SettingsGroupMemberItem
                                        key={index}
                                        user={member}
                                        onRemovePress={canConfigureGroups ? () => handleRemoveUserPress(member) : null}
                                    />
                                );
                            })}
                            {!groupMembersState.isLoading &&
                                !groupMembersState.isError &&
                                membersToDisplay.length === 0 &&
                                queryString.length > 0 && <Text text={t`No results.`} light small center />}
                            {!groupMembersState.isLoading &&
                                !groupMembersState.isError &&
                                membersToDisplay.length === 0 &&
                                queryString.length === 0 && (
                                    <Text text={t`There are currently no members in this group.`} light small center />
                                )}
                            <Spacer height={ItemHeight.xsmall} />
                        </>
                    );
                }}
            </Formik>
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof navigation.getParam(PARAM_GROUP) !== 'object') {
        historyService.navigateAsRoot(routes.TAB_SPACE_SETTINGS_PEOPLE);
        return null;
    }

    historyService.setNavigation(navigation);
    return {
        title: navigation.state.params.group.name,
        desktopHeaderType: DesktopHeaderType.none,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close),
        ...dynamicDesktopModalHeight(navigation, DesktopHeaderType.none, 407),
    };
};

// @ts-ignore
EditUserGroupPage.navigationOptions = navigationOptions;

// @ts-ignore
// Use the path of PeopleList page so when the modal link is shared, it
// uses directs the user to the people list page instead.
EditUserGroupPage.path = 'settings/people'; //override path for better web URLs

export default withNavigation(EditUserGroupPage);
