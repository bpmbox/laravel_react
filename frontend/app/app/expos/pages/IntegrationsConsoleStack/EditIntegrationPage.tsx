import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getModalHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import Page from '../../components/UIKit/Layout/Page';
import SegmentedControl from '../../components/UIKit/SegmentedControl';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { clearSecretNavigationVar, getSecretNavigationVar, setSecretNavigationVar } from '../../libs/secret-nav-var';
import useElementMountedRef from '../../libs/use-element-mounted-ref';
import useListener from '../../libs/use-listener';
import historyService from '../../services/history';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../services/integration';
import AuthStore from '../../store/auth';
import { DesktopHeaderType } from '../../theme.style';
import FullPageLoading from '../General/FullPageLoading';
import IntegrationConfigurationPage from './IntegrationConfigurationPage';
import IntegrationGeneralPage from './IntegrationGeneralPage';
import IntegrationPublicationPage from './IntegrationPublicationPage';
import { PARAM_INTEGRATION_ID } from '../../constants';

const EditIntegrationPage: FunctionComponent<any> = props => {
    const { navigation } = props;
    const integrationId = navigation.getParam(PARAM_INTEGRATION_ID);
    const { isAuthenticated, isLoading } = AuthStore.useContainer();
    const { t } = useTranslation('EditIntegrationPage');
    const [integrationInfo, setIntegrationInfo] = useState<{
        integration: NSIntegration.Integration | null;
        config: NSIntegration.Config;
    }>(null);
    const isMountedRef = useElementMountedRef();

    // -- Init --
    // Get integration info to pass initial integration info to tabs/sub-pages.
    useEffect(() => {
        // Wait until we have authenticated and have an ID before attempting to fetch info.
        if (isLoading || !isAuthenticated || !integrationId) {
            return;
        }

        (async () => {
            const integration: NSIntegration.Integration = await integrationService.getIntegration(integrationId);
            const config = await integrationService.getConfig();
            setIntegrationInfo({ integration, config });

            // Set initial title.
            setSecretNavigationVar(navigation, 'integrationName', integration.name, isMountedRef);
        })();        
        return () => {
            clearSecretNavigationVar(navigation, 'integrationName');
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, integrationId]);

    // Side effect of Init to set initial title.
    useEffect(() => {
        if (!integrationInfo) {
            return;
        }
        setSecretNavigationVar(navigation, 'integrationName', integrationInfo.integration.name, isMountedRef);
        // Only set this on load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -- Observers --
    // update integration Info if we detect new integration changes.
    useListener(integrationService, INTEGRATION_UPDATED_EVENT, async ({ updated }) => {
        // Only run this code if integration is already loade and the updated integration is
        // our currently selected one.
        if (!integrationInfo || !updated || integrationInfo.integration.id !== updated.id) {
            return;
        }

        const updatedIntegration = Object.assign({}, integrationInfo.integration, updated);
        try {
            setIntegrationInfo({ integration: updatedIntegration, config: integrationInfo.config });
        } catch (err) {
            console.error('Failed to update integration after a detected change.', err);
        }
    });

    // -- Render --
    if (integrationInfo === null || integrationInfo.integration === null) {
        return <FullPageLoading />;
    }

    return (
        <Page>
            <SegmentedControl
                padded
                items={[
                    {
                        title: t`General`,
                        page: (
                            <IntegrationGeneralPage
                                integration={integrationInfo.integration}
                                config={integrationInfo.config}
                            />
                        ),
                    },
                    {
                        title: t`Settings`,
                        page: (
                            <IntegrationConfigurationPage
                                integration={integrationInfo.integration}
                                config={integrationInfo.config}
                            />
                        ),
                    },
                    {
                        title: t`Access`,
                        page: (
                            <IntegrationPublicationPage
                                integration={integrationInfo.integration}
                                config={integrationInfo.config}
                            />
                        ),
                    },
                ]}
            />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    const title = getSecretNavigationVar(navigation, 'integrationName') || '';

    return {
        title: title,
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: true,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close),
    };
};

// @ts-ignore
EditIntegrationPage.navigationOptions = navigationOptions;

export default withNavigation(EditIntegrationPage);
