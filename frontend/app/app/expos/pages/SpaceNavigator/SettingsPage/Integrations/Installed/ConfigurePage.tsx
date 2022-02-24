import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { withNavigation } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../components/UIKit/items/Button';
import SimpleListButton from '../../../../../components/UIKit/items/SimpleListButton';
import SectionHeading from '../../../../../components/UIKit/items/SectionHeading';
import Callout from '../../../../../components/UIKit/items/Callout';
import Text from '../../../../../components/UIKit/items/Text';
import Page from '../../../../../components/UIKit/Layout/Page';
import messageService from '../../../../../services/message';
import spaceService from '../../../../../services/space';
import historyService from '../../../../../services/history';
import { defaultStackNavigationOptions } from '../../../../../libs/nav/config';
import { getModalHeader, ModalButtonType } from '../../../../../components/Navigation/NavButtons';
import { Spacer } from '../../../../../components/integration';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../../../../services/integration';
import routes from '../../../../../routes';
import AccessItem from '../../../../../components/UIKit/items/AccessItem';
import uniqBy from 'lodash/uniqBy';
import { MANDATORY_PERMISSION } from '../../../../../libs/integrations';
import alertService from '../../../../../services/alert';
import { SpaceContext } from '../../../SpaceContext';
import { DesktopHeaderType, ButtonType, CalloutType, ItemHeight, PaddingType } from '../../../../../theme.style';
import { formatDisplayName } from '../../../../../libs/user-utils';

const getName = (user: User | null, group: Group | null) => {
    return user !== null ? formatDisplayName(user) : (group !== null ? group.name : "");
};

const ConfigurePage: FunctionComponent<any> = (props) => {
    const { t } = useTranslation('ConfigurePage');
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    const { integrationInfo, config } = navigation.state.params;
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(integrationInfo.isActive);
    const [isInstalled, setIsInstalled] = useState(integrationInfo.isInstalled);
    const [isHomepage, setIsHomepage] = useState(integrationInfo.isHomepage);
    const [installationInfo, setInstallationInfo] = useState<NSIntegration.InstallationInfo | null>(null);

    const handleActivatePress = async () => {
        try {
            setLoading(true);
            await spaceService.activateIntegration(space, integrationInfo.integration);
            setIsActive(true);
            messageService.sendSuccess(t('{{integrationName}} has been activated on {{spaceName}}. Make it available by granting access to members.', { integrationName: integrationInfo.integration.name, spaceName: space.name }));
        } catch (err) {
            messageService.sendError(t`Error deactivating integration.`);
        } finally {
            setLoading(false);
        }
    }

    const handleSetHomepagePress = async () => {
        try {
            setLoading(true);
            await spaceService.setHomepageIntegration(space, integrationInfo.integration);
            setIsHomepage(true);
            messageService.sendSuccess(t('Home page set.', { integrationName: integrationInfo.integration.name, spaceName: space.name }));
        } catch (err) {
            messageService.sendError(t`Error setting as home page.`);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveHomepagePress = async () => {
        try {
            setLoading(true);
            await spaceService.removeHomepageIntegration(space, integrationInfo.integration);
            setIsHomepage(false);
            messageService.sendSuccess(t('Home page removed.', { integrationName: integrationInfo.integration.name, spaceName: space.name }));
        } catch (err) {
            messageService.sendError(t`Error removing as home page.`);
        } finally {
            setLoading(false);
        }
    }

    const handleDeactivatePress = async () => {
        alertService.alert(
            t('Deactivate {{integrationName}} from {{spaceName}}?', { integrationName: integrationInfo.integration.name, spaceName: space.name }),
            t('The integration will no longer be available to space members. You can reactivate it at any time, and your access settings will be preserved.'),
            [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Deactivate`, style: 'destructive', onPress: () => { handleDeactivateIntegration()}}
            ]
        );
    }

    const handleDeactivateIntegration = async () => {
        try {
            setLoading(true);
            await spaceService.deactivateIntegration(space, integrationInfo.integration);
            setIsActive(false);
            setIsHomepage(false);
            messageService.sendSuccess(t('{{integrationName}} has been deactivated on {{spaceName}}.', { integrationName: integrationInfo.integration.name, spaceName: space.name }));
        } catch (err) {
            messageService.sendError(t`Error deactivating integration.`);
        } finally {
            setLoading(false);
        }
    }

    const handleUninstallPress = async () => {
        alertService.alert(
            t('Uninstall {{integrationName}} from {{spaceName}}?', { integrationName: integrationInfo.integration.name, spaceName: space.name }),
            t('The access settings will be lost. If you just want to remove access to space members, you can deactivate it.'),
            [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Uninstall`, style: 'destructive', onPress: () => { handleUninstallIntegration()}}
            ]
        );
    }

    const handleUninstallIntegration = async () => {
        try {
            setLoading(true);
            await spaceService.uninstallIntegration(space, integrationInfo.integration);
            setIsInstalled(false);
            messageService.sendSuccess(t('{{integrationName}} has been uninstalled from {{spaceName}}.', { integrationName: integrationInfo.integration.name, spaceName: space.name }));
            navigation.goBack()
        } catch (err) {
            messageService.sendError(t`Error uninstalling integration.`);
        } finally {
            setLoading(false);
        }
    }

    const onAddAccessPress = () => {
        historyService.push(routes.INTEGRATIONS_CONSOLE_ACCESS_PICKER, {
            space,
            integrationInfo,
            config,
            onGrantAccess: handleGrantAccess,
        });
    }

    const onAccessConfigurePress = (user, group, permissions) => {
        historyService.push(routes.INTEGRATIONS_CONSOLE_ACCESS_PICKER, {
            space,
            integrationInfo,
            config,
            user: user,
            group: group,
            permissions: config.defaultPermissionChoices.filter((permission) => permissions.includes(permission.codename) && permission.codename !== MANDATORY_PERMISSION.codename),
            onUpdateAccess: (permissions) => handleUpdateAccess(user, group, permissions),
            onRevokeAccess: () => handleRevokeAccess(user, group)
        });
    }

    const handleGrantAccess = async (permissions, members, groups) => {
        try {
            const permissionCodenames = uniqBy(permissions, (p: NSIntegration.Permission) => { return p.codename })
                .map((permission) => permission.codename);
            setLoading(true);
            await spaceService.grantInstallationPermissions(
                space,
                integrationInfo.integration,
                members.map((member) => member.id),
                groups.map((group) => group.id),
                permissionCodenames,
            );
        } catch (err) {
            messageService.sendError(t`Error granting access.`);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateAccess = async (user: User | null, group: Group | null, permissions: NSIntegration.Permission[]) => {
        if (user === null && group === null) { return }
        try {
            setLoading(true);
            const permissionCodenames = uniqBy(permissions, (p: NSIntegration.Permission) => { return p.codename })
                .map((permission) => permission.codename);
            await spaceService.updateInstallationPermissions(
                space,
                integrationInfo.integration,
                (user !== null) ? user.id : null,
                (group !== null) ? group.id : null,
                permissionCodenames,
            );
            messageService.sendSuccess(t('Access updated for {{name}}.', { name: getName(user, group) }));
        } catch (err) {
            messageService.sendError(t`Error updating access.`);
        } finally {
            setLoading(false);
        }
    }

    const handleRevokeAccess = async (user: User | null, group: Group | null) => {
        if (user === null && group === null) { return }
        try {
            setLoading(true);
            await spaceService.revokeInstallationAccess(
                space,
                integrationInfo.integration,
                (user !== null) ? user.id : null,
                (group !== null) ? group.id : null,
            );
            messageService.sendSuccess(t('Access revoked from {{name}}.', { name: getName(user, group) }));
        } catch (err) {
            messageService.sendError(t`Error revoking access.`);
        } finally {
            setLoading(false);
        }
    }

    const fetchAccess = async () => {
        try {
            setLoading(true);
            if (!isInstalled || !isActive || !integrationInfo.installationId) { return }
            const info = await spaceService.getInstallationInfo(space, integrationInfo.installationId);
            setInstallationInfo(info);
        } catch (err) {
            messageService.sendError(t`Unable to retrieve access info.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInstalled, isActive, isHomepage]);

    useEffect(() => {
        fetchAccess();

        integrationService.addListener(INTEGRATION_UPDATED_EVENT, fetchAccess);
        spaceService.addListener(INTEGRATION_UPDATED_EVENT, fetchAccess);

        return () => {
            integrationService.removeListener(INTEGRATION_UPDATED_EVENT, fetchAccess);
            spaceService.removeListener(INTEGRATION_UPDATED_EVENT, fetchAccess);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            { isInstalled && !isActive &&
                <>
                    <Callout text={t`The integration is installed but not yet activated. In order to make it available to space members, you need to activate it and grant members access.`} mini type={CalloutType.warning} />
                    <Button text={t('Activate on {{spaceName}}', { spaceName: space.name })} onPress={() => handleActivatePress()} disabled={loading} />
                    <Button text={t('Uninstall')} onPress={handleUninstallPress} disabled={loading} type={ButtonType.error} />
                </>
            }
            { isInstalled && isActive &&
                <>
                    <SectionHeading text={t`Access`} />
                    <Text text={t`Select members and groups who can access the integration.`} small light />
                    <Spacer height={ItemHeight.xsmall} />
                    <Button text={t('Add Member or Group')} onPress={() => onAddAccessPress()} disabled={loading} desktopFitWidth />
                    {/* <Spacer height={ItemHeight.xsmall} /> */}
                    { installationInfo && installationInfo.groupsPermissions && installationInfo.groupsPermissions.length > 0 &&
                        <>
                            <SectionHeading text={t`Groups`} />
                            { installationInfo.groupsPermissions.map((accessItem) => {
                                return <AccessItem key={accessItem.group.id} group={accessItem.group} permissions={accessItem.permissions} onConfigurePress={() => onAccessConfigurePress(null, accessItem.group, accessItem.permissions)} />
                            })}
                        </>
                    }
                    { installationInfo && installationInfo.usersPermissions && installationInfo.usersPermissions.length > 0 &&
                        <>
                            <SectionHeading text={t`Members`} />
                            { installationInfo.usersPermissions.map((accessItem) => {
                                return <AccessItem key={accessItem.user.id} user={accessItem.user} permissions={accessItem.permissions} onConfigurePress={() => onAccessConfigurePress(accessItem.user, null, accessItem.permissions)} />
                            })}
                        </>
                    }
                    <SectionHeading text={t`More`} />
                    { isHomepage ?
                        <SimpleListButton text={t`Remove as Home Page`} onPress={handleRemoveHomepagePress} /> :
                        <SimpleListButton text={t`Set as Home Page`} onPress={handleSetHomepagePress} />
                    }
                    <SimpleListButton text={t`Deactivate Integration`} danger onPress={handleDeactivatePress} />
                    <SimpleListButton text={t`Uninstall Integration`} danger onPress={handleUninstallPress} />
                </>
            }
        </Page>
    );
};

export const navigationOptions = ({navigation}: any) => {
    
    const integrationInfo: NSIntegration.IntegrationInfo = navigation.getParam('integrationInfo');

    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof integrationInfo !== 'object') {
        navigation.pop();
        return null;
    }

    historyService.setNavigation(navigation);
    return {
        title: integrationInfo.integration.name,
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: true,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close)
    }
};

// @ts-ignore
ConfigurePage.navigationOptions = navigationOptions;

// @ts-ignore
ConfigurePage.path = '';

export default withNavigation(ConfigurePage);
