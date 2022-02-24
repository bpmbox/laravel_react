import { withNavigation } from '@react-navigation/core';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNavigationOptions } from '../../../../components/Navigation/NavButtons';
import IntegrationListItem from '../../../../components/UIKit/items/IntegrationListItem';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import routes from '../../../../routes';
import { ItemHeight } from '../../../../theme.style';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../../../services/integration';
import spaceService from '../../../../services/space';
import AuthStore from '../../../../store/auth';
import EmptyPage from '../../../General/EmptyPage';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import { SpaceContext } from '../../SpaceContext';
import useListener from '../../../../libs/use-listener';

type IntegrationsListPageState = {
    integrations: NSIntegration.Integration[];
    loading: boolean;
    error: boolean;
}

const IntegrationsListPage = (props: { navigation: any; activeIntegrationId: any; }) => {
    const { t } = useTranslation('IntegrationsListPage');
    const { space } = useContext(SpaceContext);
    const { currentUser, isAuthenticated } = AuthStore.useContainer();
    const { navigation, activeIntegrationId } = props;

    const [state, setState] = useState<IntegrationsListPageState>({
        integrations: [],
        loading: false,
        error: false
    });

    const fetchIntegrations = async (showLoading: boolean = false) => {
        if (!space) {
            console.debug('IntegrationsListPage: no space provided');
            return;
        }
        try {
            if (showLoading) {
                setState({ integrations: [], loading: true, error: false });
            }

            console.debug('IntegrationsListPage: fetching integrations');
            const integrations = await spaceService.getCanViewIntegrations(
                space,
                currentUser
            );
            console.debug('IntegrationsListPage: found integrations', integrations);
            setState({
                integrations: integrations,
                loading: false,
                error: false,
            });
        } catch (err) {
            console.error('IntegrationsListPage: fetching integrations error', err);
            setState({
                integrations: [],
                loading: false,
                error: true,
            });
        }
    };

    useEffect(() => {
        if(!currentUser || !space) {
            return;
        }

        fetchIntegrations(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space, currentUser, isAuthenticated]);

    const gotoIntegration = useCallback((id: string, name: string) => {
        navigation.navigate(routes.INTEGRATIONS_NATIVE_SELECTED_INTEGRATION, {
            integrationId: id,
        });
    }, [navigation]);

    useListener(integrationService, INTEGRATION_UPDATED_EVENT, fetchIntegrations);
    useListener(spaceService, INTEGRATION_UPDATED_EVENT, fetchIntegrations);

    if (state.loading) {
        return <FullPageLoading />;
    }

    if (state.error) {
        return (
            <ErrorPage code={404} message={t`Error loading integrations.`} />
        );
    }

    if (state.integrations.length === 0) {
        return (
            <EmptyPage
                message={t`No integrations on this space.`}
            />
        );
    }

    return <Page scrollable>
        { state.integrations.map((integration) =>
            <IntegrationListItem
                key={integration.id}
                integration={integration}
                selected={activeIntegrationId === integration.id}
                onPress={() => {
                    gotoIntegration(integration.id, integration.name);
                }} />
        )}
        <Spacer height={ItemHeight.xsmall} />
    </Page>
};

// @ts-ignore
IntegrationsListPage.navigationOptions = createNavigationOptions(
    i18n.t('IntegrationsListPage::Home'),
    null,
    null,
    false
);

export default withNavigation(IntegrationsListPage);
