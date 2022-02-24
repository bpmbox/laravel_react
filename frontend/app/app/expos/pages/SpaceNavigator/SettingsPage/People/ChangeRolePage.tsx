import { withNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import {
    dynamicDesktopModalHeight,
    getModalHeader,
    ModalButtonType,
} from '../../../../components/Navigation/NavButtons';
import Divider from '../../../../components/UIKit/items/Divider';
import MultilineSubtitle from '../../../../components/UIKit/items/MultilineSubtitle';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import SimpleListButton from '../../../../components/UIKit/items/SimpleListButton';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Text from '../../../../components/UIKit/items/Text';
import Page from '../../../../components/UIKit/Layout/Page';
import { PARAM_INVITATION, PARAM_USER } from '../../../../constants';
import getTranslate from '../../../../libs/get-translate';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { isMobilePlatform } from '../../../../libs/platform';
import { formatDisplayName } from '../../../../libs/user-utils';
import routes from '../../../../routes';
import alertService from '../../../../services/alert';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import AuthStore from '../../../../store/auth';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../../theme.style';
import { Role, roleDescription, roleToString } from '../../../../types/enums';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../SpaceContext';
import { useLeaveSpaceDialog } from '../Spaces/SettingsPage.manager';

const { t } = getTranslate('ChangeRolePage');

const allRoles = [Role.GUEST, Role.MEMBER, Role.ADMIN, Role.OWNER];

type UserState = {
    loading: boolean;
    user: User | null;
    invitation: Invitation | null;
    currentRole: Role | null;
    isSelf: boolean | null;
    isSoleOwner: boolean | null;
};

const ChangeRolePage = (props: any) => {
    const { navigation } = props;
    const userParam: User | null = navigation.getParam(PARAM_USER);
    const inviteParam: Invitation | null = navigation.getParam(PARAM_INVITATION);
    const { space, role: selfRole } = useContext(SpaceContext);
    const { currentUser } = AuthStore.useContainer();
    const { show: showLeaveSpaceDialog } = useLeaveSpaceDialog();

    const [userState, setUserState] = useState<UserState>({
        loading: true,
        user: null,
        invitation: null,
        isSelf: null,
        isSoleOwner: null,
        currentRole: null,
    });
    const [selectedRole, setSelectedRole] = useState<Role>();

    // -- Computed Props --
    const isMember = !!userParam && !inviteParam;

    // -- Init --
    // Load up user we are currently editing.
    // Note: this user details are not passed as a param because this can be possibly
    // be loaded via URL on web.
    useEffect(() => {
        // make sure required context vars are in before attempting to fetch.
        if (!currentUser || !space) {
            return;
        }

        (async () => {
            try {
                // check if we are the only owner.
                if (isMember) {
                    await loadMember(space, userParam, currentUser, setUserState);
                } else {
                    await loadInvitation(inviteParam, setUserState);
                }
            } catch (err) {
                console.error('ChangeRolePage: Could not get user', err);
                // we don't have the info needed load this page.
                // Pop back to spaceNavigator parent page.
                if (isMobilePlatform) {
                    historyService.navigateAsRoot(routes.SETTINGS_SPACE_PEOPLE);
                } else {
                    historyService.navigateAsRoot(routes.TAB_SPACE_SETTINGS_PEOPLE);
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userParam]);

    // Set initial role.
    useEffect(() => {
        if (userState.loading) {
            return;
        }
        setSelectedRole(userState.currentRole);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState.loading]);

    let { allowedRoles, currentUserRoleCapabilitiesMessage, canRemove } = getPermissionLevel(selfRole, userState);

    // -- Handlers --

    const handleRemoveUser = async () => {
        try {
            if (userState.user) {
                await spaceService.removeMember(space, userState.user);
            } else {
                await spaceService.cancelInvitation(space, userState.invitation.email);
            }
            navigation.goBack();
        } catch {
            // The error message returned by the server is not appropriate
            messageService.sendError(
                t('Error removing {{ name }} from the Space.', {
                    name: userState.user ? formatDisplayName(userState.user) : userState.invitation.email,
                })
            );
        }
    };

    const onLeavePress = () => {
        showLeaveSpaceDialog();
    };

    const onRemovePress = () => {
        const promptText = userState.user
            ? t('Remove {{displayName}} from {{spaceName}}?', {
                  displayName: formatDisplayName(userState.user),
                  spaceName: space.name,
              })
            : t('Cancel invitation to {{spaceName}} sent to {{email}}?', {
                  email: userState.invitation.email,
                  spaceName: space.name,
              });
        alertService.alert(
            promptText,
            '',
            [
                { text: t`Cancel`, style: 'cancel' },
                {
                    text: isMember ? t`Remove` : t`Cancel Invitation`,
                    style: 'destructive',
                    onPress: handleRemoveUser,
                },
            ],
            true
        );
    };

    const onRolePress = async (newRole: Role) => {
        if (!userState.isSelf) {
            await handleRoleChange(newRole);
        } else if (selfRole !== newRole) {
            alertService.alert(
                t('Downgrade your role to {{role}}?', {
                    role: roleToString(newRole),
                }),
                t('Only other Owners will be able to upgrade your role again.'),
                [
                    { text: t`Cancel`, style: 'cancel' },
                    {
                        text: t`Downgrade`,
                        style: 'destructive',
                        onPress: () => {
                            handleRoleChange(newRole);
                        },
                    },
                ],
                true
            );
        }
    };

    const handleRoleChange = async (newRole: Role) => {
        try {
            if (userState.user) {
                await spaceService.updateRole(space, userState.user, newRole);
            } else {
                await spaceService.updateInvitation(space, {
                    email: userState.invitation.email,
                    role: newRole,
                });
            }

            setSelectedRole(newRole);
            navigation.goBack();
        } catch (e) {
            // The error message returned by the server is not appropriate
            messageService.sendError(e.message || t`You are not allowed to perform this action.`);
        }
    };

    const handleResendInvitation = async () => {
        try {
            await spaceService.resendInvitation(space, userState.invitation.email);
            messageService.sendSuccess(t`Invitation has been resent.`);
        } catch (err) {
            console.error('Error resending Invitation', err);
            messageService.sendError(t`Error occurred resending invitation.`);
        }
    };

    // -- Render --
    if (userState.loading) {
        return <FullPageLoading />;
    }

    let removeLabel = t`Cancel Invitation`;
    if (isMember) {
        removeLabel = userState.isSelf ? t`Leave Space` : t`Remove from Space`;
    }

    return (
        <Page
            scrollable
            desktopPadding={PaddingType.horizontalBottom}
            listensToContentSizeChangeWithNavigation={navigation}>
            {(allowedRoles.length > 0 || currentUserRoleCapabilitiesMessage) && (
                <>
                    <SectionHeading text={t`Set Role`} />
                    <Text text={currentUserRoleCapabilitiesMessage} small />
                </>
            )}
            {allRoles.map((role, index) => {                
                const isAllowed = allowedRoles.includes(role);
                return (
                    <MultilineSubtitle
                        key={index}
                        testID="RoleSelectItem"
                        title={roleToString(role)}
                        subtitle={roleDescription(role)}
                        onPress={isAllowed ? () => onRolePress(role) : null}
                        disabled={!isAllowed}
                        checked={selectedRole === role}
                    />
                );
            })}
            {canRemove && (
                <>
                    <Divider middle />
                    {!isMember && (
                        <SimpleListButton
                            testID="ResendButton"
                            text={t`Resend Invitation`}
                            onPress={handleResendInvitation}
                        />
                    )}
                    <SimpleListButton
                        danger
                        testID="RemoveButton"
                        text={removeLabel}
                        onPress={userState.isSelf ? onLeavePress : onRemovePress}
                    />
                </>
            )}
            <Spacer height={ItemHeight.xsmall} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    // If we navigated directly to this dialog, and missing key params
    // immediately pop to parent so we don't open a role dialog to an stale state.
    const userDefined = typeof navigation.getParam(PARAM_USER) === 'object';
    const inviteDefined = typeof navigation.getParam(PARAM_INVITATION) === 'object';

    if (!userDefined && !inviteDefined) {
        historyService.navigateAsRoot(routes.TAB_SPACE_SETTINGS_PEOPLE);
        return null;
    }

    const nameOrEmail = navigation.state.params.user
        ? formatDisplayName(navigation.state.params[PARAM_USER])
        : navigation.state.params[PARAM_INVITATION].email;

    return {
        title: nameOrEmail,
        desktopHeaderType: DesktopHeaderType.plain,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close),
        ...dynamicDesktopModalHeight(navigation, DesktopHeaderType.plain, 479),
    };
};

async function loadMember(
    space: Space,
    userParam: any,
    currentUser: User,
    setUserState: React.Dispatch<React.SetStateAction<UserState>>
) {
    const memberships = await spaceService.getMembers(space);
    const targetMembership = memberships.find(x => x.member.id === userParam.id);
    if (!targetMembership) {
        throw new Error('User not found');
    }
    const numOwners = memberships.reduce((accum, x) => {
        return accum + x.role === Role.OWNER ? 1 : 0;
    }, 0);
    const isSelf = currentUser.id === userParam.id;
    const isSoleOwner = numOwners === 1 && isSelf;
    setUserState({
        user: targetMembership.member,
        invitation: null,
        currentRole: targetMembership.role,
        isSelf,
        isSoleOwner,
        loading: false,
    });
}

async function loadInvitation(invitation: Invitation, setUserState: React.Dispatch<React.SetStateAction<UserState>>) {
    setUserState({
        user: null,
        invitation: invitation,
        currentRole: invitation.role,
        // Safe to assume an admin viewing this page is never and invitee.
        isSelf: false,
        isSoleOwner: false,
        loading: false,
    });
}

function getPermissionLevel(selfRole: Role, userState: UserState) {
    let currentUserRoleCapabilitiesMessage = null;
    let allowedRoles = [];
    let canRemove = false;
    if (selfRole === Role.OWNER) {
        if (userState.isSelf && userState.isSoleOwner) {
            currentUserRoleCapabilitiesMessage = t`You are the only Owner of this space, so you cannot change your role. To change your role, grant Owner role to another space member first.`;
        } else {
            allowedRoles = [Role.GUEST, Role.MEMBER, Role.ADMIN, Role.OWNER];
            canRemove = true;
        }
    } else if (selfRole === Role.ADMIN) {
        if (userState.isSelf) {
            currentUserRoleCapabilitiesMessage = t`Only Owners can change your role.`;
        } else {
            if (userState.currentRole === Role.GUEST || userState.currentRole === Role.MEMBER) {
                currentUserRoleCapabilitiesMessage = t`As an Admin, you can grant other users Guest or Member roles only. To grant other roles, you need to be an Owner.`;
                allowedRoles = [Role.GUEST, Role.MEMBER];
                canRemove = true;
            } else {
                currentUserRoleCapabilitiesMessage = t`As an Admin, you can only change the role of Members and Guests.`;
            }
        }
    } else {
        currentUserRoleCapabilitiesMessage = t`Only Admins and Owners can grant roles.`;
    }
    return { allowedRoles, currentUserRoleCapabilitiesMessage, canRemove };
}

// @ts-ignore
ChangeRolePage.navigationOptions = navigationOptions;

// @ts-ignore
// Use the path of PeopleList page so when the modal link is shared, it
// uses directs the user to the people list page instead.
ChangeRolePage.path = 'settings/people'; //override path for better web URLs

export default withNavigation(ChangeRolePage);
