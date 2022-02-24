import { withNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../../../../components/UIKit/Layout/Page';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { getSecretNavigationVar, setSecretNavigationVar } from '../../../../libs/secret-nav-var';
import useElementMountedRef from '../../../../libs/use-element-mounted-ref';
import historyService from '../../../../services/history';
import integrationService from '../../../../services/integration';
import messageService from '../../../../services/message';
import EmptyPage from '../../../General/EmptyPage';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import IntegrationPage from '../../../Integration/Page';
import { SpaceContext } from '../../SpaceContext';

type IntegrationLoadingState = {
    integration: NSIntegration.Integration | null;
    loading: boolean;
    error: boolean;
};

const NativeIntegrationPage = (props: any) => {
    const { t } = useTranslation('NativeIntegrationPage');
    const { space } = useContext(SpaceContext);
    const { navigation } = props;
    const pageMountedRef = useElementMountedRef();

    const integrationId = navigation.getParam('integrationId');
    const pageId = navigation.getParam('pageId');

    const [state, setState] = useState<IntegrationLoadingState | null>({
        integration: null,
        loading: true,
        error: false,
    });

    useEffect(() => {
        (async () => {
            try {
                if (!integrationId) {
                    // Clear out title fields if no integration is selected.
                    return;
                }

                setState({ ...state, loading: true, error: false });
                const integration = await integrationService.getIntegration(integrationId);
                setState({ ...state, integration: integration, loading: false, error: false });

                setSecretNavigationVar(navigation, 'integrationName', integration.name, pageMountedRef);
            } catch (err) {
                messageService.sendError(t`Error loading content.`);
                setState({ ...state, loading: false, error: true });
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integrationId]);

    if (!integrationId) {
        return <EmptyPage message={t`No integration selected.`} />;
    }

    if (state.loading || !state.integration) {
        return <FullPageLoading />;
    }

    if (state.error) {
        return <ErrorPage code={404} message={t`Error loading content.`} />;
    }

    return (
        <Page>
            <IntegrationPage space={space} integration={state.integration} pageId={pageId} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    // Hack to get pageTitle from shimmed props.
    const pageTitle = getSecretNavigationVar(navigation, 'pageTitle') || '';

    return {
        title: pageTitle,
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
NativeIntegrationPage.navigationOptions = navigationOptions;

export default withNavigation(NativeIntegrationPage);
