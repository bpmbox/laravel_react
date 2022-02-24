
import { withNavigation } from '@react-navigation/core';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MarketplaceIntegrationItem from '../../../../../components/UIKit/items/MarketplaceIntegrationItem';
import Spacer from '../../../../../components/UIKit/items/Spacer';
import Text from '../../../../../components/UIKit/items/Text';
import Page from '../../../../../components/UIKit/Layout/Page';
import { categoryName } from '../../../../../libs/integrations';
import { defaultStackNavigationOptions } from '../../../../../libs/nav/config';
import { PARAM_CATEGORY, PARAM_INTEGRATION_INFO, PARAM_SPACE } from '../../../../../constants';
import routes from '../../../../../routes';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../../../../services/integration';
import spaceService from '../../../../../services/space';
import AuthStore from '../../../../../store/auth';
import { IntegrationListState } from './';

const IntegrationsByCategory: FunctionComponent<any> = props => {
    const { t } = useTranslation('IntegrationsByCategory');
    const { navigation } = props;
    const space = navigation.getParam(PARAM_SPACE);
    const { isAuthenticated } = AuthStore.useContainer();
    const category = navigation.getParam(PARAM_CATEGORY);
    const [state, setState] = useState<IntegrationListState>({
        integrationInfos: [],
        isLoading: true,
        isError: false,
    });

    const fetchIntegrations = useCallback(async () => {
        if (!isAuthenticated) {
            // non-authenticated users cannot view any integrations
            return;
        }

        try {
            const integrationInfos = await spaceService.getIntegrationInfos(
                space,
                null,
                category
            );
            setState({ integrationInfos, isLoading: false, isError: false });
        } catch (err) {
            setState({ integrationInfos: [], isLoading: false, isError: true });
        }
    }, [category, isAuthenticated, space]);

    const handleOnIntegrationPress = integrationInfo => {
        navigation.navigate(routes.INTEGRATIONS_MARKETPLACE_INFO, {
            [PARAM_SPACE]: space,
            [PARAM_INTEGRATION_INFO]: integrationInfo,
        });
    };

    useEffect(() => {
        fetchIntegrations();
    }, [fetchIntegrations]);

    useEffect(() => {
        integrationService.addListener(INTEGRATION_UPDATED_EVENT, fetchIntegrations);
        spaceService.addListener(INTEGRATION_UPDATED_EVENT, fetchIntegrations);
        return () => {
            integrationService.removeListener(INTEGRATION_UPDATED_EVENT, fetchIntegrations);
            spaceService.removeListener(INTEGRATION_UPDATED_EVENT, fetchIntegrations);
        };
    }, []);

    return (
        <Page scrollable>
            { state.isLoading && <><Spacer /><Text text={t`Loading integrations...`} light small center /></> }
            { !state.isLoading && state.isError && <><Spacer /><Text text={t`Error loading integrations`} light small center /></> }
            { !state.isLoading && !state.isError && state.integrationInfos.length === 0 && <><Spacer /><Text text={t`There are no integrations in this category.`} light small center /></> }
            { !state.isLoading && !state.isError && state.integrationInfos.length > 0 &&
                <>
                    { state.integrationInfos.map((integrationInfo: NSIntegration.IntegrationInfo) =>
                        <MarketplaceIntegrationItem key={integrationInfo.integration.id} integration={integrationInfo.integration} onPress={() => handleOnIntegrationPress(integrationInfo) } />
                    )}
                </>
            }
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    return {
        title: categoryName(navigation.state.params.category),
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
IntegrationsByCategory.navigationOptions = navigationOptions;

export default withNavigation(IntegrationsByCategory);
