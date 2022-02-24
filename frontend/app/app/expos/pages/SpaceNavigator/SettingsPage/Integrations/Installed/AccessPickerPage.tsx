/* istanbul ignore file */
import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import uniqBy from 'lodash/uniqBy';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { getModalHeader, getRightActionHeader, ModalButtonType } from '../../../../../components/Navigation/NavButtons';
import Divider from '../../../../../components/UIKit/items/Divider';
import SectionHeading from '../../../../../components/UIKit/items/SectionHeading';
import Select from '../../../../../components/UIKit/items/Select';
import SimpleListButton from '../../../../../components/UIKit/items/SimpleListButton';
import SimpleListItem from '../../../../../components/UIKit/items/SimpleListItem';
import Spacer from '../../../../../components/UIKit/items/Spacer';
import Text from '../../../../../components/UIKit/items/Text';
import Page from '../../../../../components/UIKit/Layout/Page';
import i18n from '../../../../../i18n';
import { MANDATORY_PERMISSION, permissionToString } from '../../../../../libs/integrations';
import { defaultStackNavigationOptions } from '../../../../../libs/nav/config';
import routes from '../../../../../routes';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../../../theme.style';
import alertService from '../../../../../services/alert';
import historyService from '../../../../../services/history';
import messageService from '../../../../../services/message';
import { SpaceContext } from '../../../SpaceContext';
import { formatDisplayName } from '../../../../../libs/user-utils';
import { PARAM_ON_DONE, PARAM_ON_SELECTION_DONE } from '../../../../../constants';

const AccessPickerPage = (props: any) => {
    const { t } = useTranslation('AccessPickerPage');
    const { navigation } = props;
    const {
        integrationInfo,
        config,
        user,
        group,
        permissions,
        onGrantAccess,
        onUpdateAccess,
        onRevokeAccess,
    } = navigation.state.params;
    const { space } = useContext(SpaceContext);
    const [selectedPermissions, setSelectedPermissions] = useState<NSIntegration.Permission[]>(defaultTo(permissions, []));
    const [selectedMembers, setSelectedMembers] = useState<User[]>(defaultTo(user, null) === null ? [] : [user]);
    const [selectedGroups, setSelectedGroups] = useState<Group[]>(defaultTo(group, null) === null ? [] : [group]);

    const isUpdating = defaultTo(user, null) !== null || defaultTo(group, null) !== null;

    useEffect(() => {
        const isValidInput = selectedMembers.length > 0 || selectedGroups.length > 0;
        navigation.setParams({
            valid: isValidInput,
            [PARAM_ON_DONE]: () => {
                if (selectedMembers.length === 0 && selectedGroups.length === 0) {
                    messageService.sendError(t`No members or groups selected.`);
                } else {
                    const newPermissions = uniqBy(
                        [MANDATORY_PERMISSION, ...selectedPermissions],
                        (p: NSIntegration.Permission) => p.codename
                    );
                    if (isUpdating && onUpdateAccess) {
                        onUpdateAccess(newPermissions);
                    } else if (!isUpdating && onGrantAccess) {
                        onGrantAccess(newPermissions, selectedMembers, selectedGroups);
                    }
                    navigation.goBack();
                }
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPermissions, selectedMembers, selectedGroups]);

    const handleOnAddMembersPress = () => {
        navigation.push(routes.PEOPLE_PICKER, {
            title: t`Add Members`,
            space: space,
            excludedUsers: [],
            [PARAM_ON_SELECTION_DONE]: setSelectedMembers,
            initialSelection: selectedMembers,
            allowMulti: true,
        });
    };

    const handleOnAddGroupsPress = () => {
        navigation.push(routes.GROUP_PICKER, {
            title: t`Add Groups`,
            space: space,
            excludedGroups: [],
            [PARAM_ON_SELECTION_DONE]: setSelectedGroups,
            initialSelection: selectedGroups,
            allowMulti: true,
        });
    };

    const handleOnRevokeAccessPress = () => {
        alertService.alert(
            t('Revoke access from {{userOrGroupName}} to {{integrationName}}?', {
                userOrGroupName: user ? formatDisplayName(user) : group ? group.name : '',
                integrationName: integrationInfo.integration.name,
            }),
            '',
            [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Revoke`, style: 'destructive', onPress: handleOnRevokeAccessConfirmPress },
            ]
        );
    };

    const handleOnRevokeAccessConfirmPress = () => {
        onRevokeAccess && onRevokeAccess();
        navigation.goBack();
    };

    const membersButtonLabel =
        selectedMembers.length === 0 ? t`Select members` : selectedMembers.map(u => formatDisplayName(u)).join(', ');
    const groupsButtonLabel =
        selectedGroups.length === 0 ? t`Select groups` : selectedGroups.map(g => g.name).join(', ');
    const supportedIntegrationPermissions = config.defaultPermissionChoices.filter(permission => {
        return (
            integrationInfo.integration.permissions.includes(permission.codename) &&
            permission.codename !== MANDATORY_PERMISSION.codename
        );
    });
    const supportedSelectedPermissions = selectedPermissions.filter(permission => {
        return integrationInfo.integration.permissions.includes(permission.codename);
    });
    const supportedPermissionsWithAccess = [MANDATORY_PERMISSION, ...supportedIntegrationPermissions];
    const supportedSelectedPermissionsWithAccess = [MANDATORY_PERMISSION, ...supportedSelectedPermissions];

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            {!isUpdating && (
                <>
                    <SectionHeading text={t`Members`} />
                    <SimpleListButton text={membersButtonLabel} onPress={handleOnAddMembersPress} multiline />
                    <SectionHeading text={t`Groups`} />
                    <SimpleListButton text={groupsButtonLabel} onPress={handleOnAddGroupsPress} multiline />
                </>
            )}
            <SectionHeading text={t`Permissions`} />
            <Select
                title={t`Select Permissions`}
                actionTitle={t`Select permissions`}
                values={supportedPermissionsWithAccess}
                currentSelection={supportedSelectedPermissionsWithAccess}
                disabledSelection={[MANDATORY_PERMISSION]}
                multi
                allowDeselect
                titleRenderer={permission => permissionToString(permission.codename) }
                itemRenderer={(permission, selected, disabled, props) => {
                    if (disabled) {
                        return (
                            <View {...props}>
                                <SimpleListItem
                                    text={permissionToString(permission.codename)}
                                    checked={selected}
                                    light={disabled}
                                    emphasized
                                    disabled={disabled}
                                    {...props}
                                />
                                <Text
                                    text={t`When granting permissions, members will automatically get view access to the integration.`}
                                    light
                                    small
                                />
                                <Divider middle />
                                <SectionHeading text={t`Additional Permissions`}/>
                            </View>
                        );
                    } else {
                        return (
                            <SimpleListItem
                                text={permissionToString(permission.codename)}
                                checked={selected}
                                {...props}
                            />
                        );
                    }
                }}
                onSelectionChange={setSelectedPermissions}
            />
            {isUpdating && (
                <>
                    <Divider middle />
                    <SimpleListButton text={t`Revoke Access`} onPress={handleOnRevokeAccessPress} danger />
                </>
            )}
            <Spacer height={ItemHeight.xsmall} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    const user = defaultTo(navigation.state.params.user, null);
    const group = defaultTo(navigation.state.params.group, null);
    const isUpdating = user !== null || group !== null;
    const title =
        user !== null
            ? formatDisplayName(user)
            : group !== null
            ? group.name
            : i18n.t('AccessPickerPage::Grant Access');
    historyService.setNavigation(navigation);
    const rightHeader = getRightActionHeader(
        isUpdating ? i18n.t('Update') : i18n.t('Grant'),
        true,
        defaultTo(navigation.state.params.valid, false),
        () => {
            navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
        }
    );
    return {
        title: title,
        desktopHeaderType: DesktopHeaderType.plain,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
    };
};

// @ts-ignore
AccessPickerPage.navigationOptions = navigationOptions;

export default withNavigation(AccessPickerPage);
