import React, { useEffect, useState, FunctionComponent, useCallback } from 'react';
import { withNavigation } from '@react-navigation/core';
import historyService from '../../services/history';
import { Role } from '../../types/enums';
import messageService from '../../services/message';
import { useTranslation } from 'react-i18next';
import SettingsIntegrationItem from '../../components/UIKit/items/SettingsIntegrationItem';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import routes from '../../routes';
import sortBy from 'lodash/sortBy';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { getModalHeader, ModalButtonType, getRightActionHeader } from '../../components/Navigation/NavButtons';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../services/integration';
import { Spacer } from '../../components/integration';
import { DesktopHeaderType, PaddingType } from '../../theme.style';
import AuthStore from '../../store/auth';

type IntegrationsConsolePageProps = {
    space: Space;
    role: Role;
} & {
    navigation: any;
};

type IntegrationListState = {
    publishedIntegrations: Array<NSIntegration.Integration>;
    restrictedIntegrations: Array<NSIntegration.Integration>;
    unpublishedIntegrations: Array<NSIntegration.Integration>;
    isLoading: boolean;
    isError: boolean;
};

/**
 * Integrations Console Page - Where users manage their integration settings.
 * (Not tied to a space [Installation])
 */
const IntegrationsConsolePage: FunctionComponent<IntegrationsConsolePageProps> = props => {
    const { isLoading } = AuthStore.useContainer();
    const { navigation } = props;
    const { t } = useTranslation('IntegrationsConsolePage');
    const [state, setState] = useState<IntegrationListState>({
        publishedIntegrations: [],
        restrictedIntegrations: [],
        unpublishedIntegrations: [],
        isLoading: true,
        isError: false,
    });

    // -- Init --
    const fetchIntegrations = useCallback(async () => {
        try {
            const integrations = await integrationService.getMyIntegrations(true);

            const publishedIntegrations = filterSortIntegrations(integrations, 'published');
            const restrictedIntegrations = filterSortIntegrations(integrations, 'restricted');
            const unpublishedIntegrations = filterSortIntegrations(integrations, 'unpublished');

            setState({
                publishedIntegrations,
                restrictedIntegrations,
                unpublishedIntegrations,
                isLoading: false,
                isError: false,
            });
        } catch (err) {
            setState({
                publishedIntegrations: [],
                restrictedIntegrations: [],
                unpublishedIntegrations: [],
                isLoading: false,
                isError: true,
            });
            messageService.sendError(t`Error loading integrations.`);
        }
    }, [setState, t]);

    useEffect(() => {
        // wait until auth ready before requesting integrations.
        if (isLoading) {
            return;
        }
        fetchIntegrations();
    }, [isLoading, fetchIntegrations]);

    // -- Observers --
    useEffect(() => {
        integrationService.addListener(INTEGRATION_UPDATED_EVENT, fetchIntegrations);
        return () => {
            integrationService.removeListener(INTEGRATION_UPDATED_EVENT, fetchIntegrations);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnIntegrationPress = (integration: NSIntegration.Integration) => {
        navigation.navigate(routes.INTEGRATIONS_CONSOLE_EDIT, {
            integrationId: integration.id,
        });
    };

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            {state.isLoading && <Text text={t`Loading integrations...`} light small center />}
            {!state.isLoading && state.isError && <Text text={t`Error loading integrations`} light small center />}
            {!state.isLoading &&
                !state.isError &&
                state.publishedIntegrations.length === 0 &&
                state.restrictedIntegrations.length === 0 &&
                state.unpublishedIntegrations.length === 0 && (
                    <>
                        <Spacer />
                        <Text text={t`You do not have any integrations.`} light small center />
                    </>
                )}
            {!state.isLoading && !state.isError && state.publishedIntegrations.length > 0 && (
                <>
                    <SectionHeading text={t`Published`} />
                    {state.publishedIntegrations.map((integration: NSIntegration.Integration) => (
                        <SettingsIntegrationItem
                            key={integration.id}
                            integration={integration}
                            onPress={() => handleOnIntegrationPress(integration)}
                        />
                    ))}
                </>
            )}
            {!state.isLoading &&
                !state.isError &&
                state.publishedIntegrations.length === 0 &&
                (state.restrictedIntegrations.length > 0 || state.unpublishedIntegrations.length > 0) && (
                    <>
                        <SectionHeading text={t`Published`} />
                        <Text text={t`You currently have no published integrations.`} small light />
                    </>
                )}
            {!state.isLoading && !state.isError && state.restrictedIntegrations.length > 0 && (
                <>
                    <SectionHeading text={t`Restricted`} />
                    {state.restrictedIntegrations.map((integration: NSIntegration.Integration) => (
                        <SettingsIntegrationItem
                            key={integration.id}
                            integration={integration}
                            onPress={() => handleOnIntegrationPress(integration)}
                        />
                    ))}
                </>
            )}
            {!state.isLoading && !state.isError && state.unpublishedIntegrations.length > 0 && (
                <>
                    <SectionHeading text={t`Unpublished`} />
                    {state.unpublishedIntegrations.map((integration: NSIntegration.Integration) => (
                        <SettingsIntegrationItem
                            key={integration.id}
                            integration={integration}
                            onPress={() => handleOnIntegrationPress(integration)}
                        />
                    ))}
                </>
            )}
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    const rightHeader = getRightActionHeader(i18n.t('IntegrationsConsolePage::Create'), true, true, () => {
        historyService.push(routes.INTEGRATIONS_CONSOLE_CREATE);
    });
    return {
        title: i18n.t('IntegrationsConsolePage::My Integrations'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopFullPage: true,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close),
        ...rightHeader,
    };
};

function filterSortIntegrations(
    integrations: NSIntegration.Integration[],
    filterCriteria: string
): NSIntegration.Integration[] {
    return sortBy(
        integrations.filter(integration => integration.access === filterCriteria),
        ['name']
    );
}

// @ts-ignore
IntegrationsConsolePage.navigationOptions = navigationOptions;

export default withNavigation(IntegrationsConsolePage);
