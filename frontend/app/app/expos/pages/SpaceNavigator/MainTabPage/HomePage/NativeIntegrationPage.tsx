import { withNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { getSecretNavigationVar } from '../../../../libs/secret-nav-var';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import DefaultTopPage from './DefaultTopPage';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import IntegrationPage from '../../../Integration/Page';
import { SpaceContext } from '../../SpaceContext';
import integrationService from '../../../../services/integration';


const NativeIntegrationPage = (props: any) => {
    const { t } = useTranslation('NativeIntegrationPage');
    const { space } = useContext(SpaceContext);

    const pageId = props.navigation.getParam('pageId');
    const integrationId = props.navigation.getParam('integrationId');
    
    const [state, setState] = useState<{
        integration: NSIntegration.Integration | null,
        loading: boolean,
        error: boolean} | null>({
            integration: null,
            loading: true,
            error: false,
        });

    useEffect(() => {
        if(!space) {
            return;
        }

        (async () => {
            try {
                if(integrationId){
                    setState({ ...state, loading: true, error: false });
                    const integration = await integrationService.getIntegration(integrationId);
                    setState({ ...state, integration: integration, loading: false, error: false });
                }else{
                    setState({...state, loading: true, error: false});
                    const homepageIntegration = await spaceService.getHomepageIntegration(space);
                    setState({...state, integration: homepageIntegration, loading: false, error: false});
                }
            } catch (err) {
                console.error('NativeIntegrationPage: error loading homepage', err);
                messageService.sendError(t`Error loading content.`);
                setState({...state, loading: false, error: true});
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space,integrationId]);

    if (state.loading) {
        return <FullPageLoading />;
    }

    if (state.error) {
        return <ErrorPage code={404} message={t`Error loading content.`} />;
    }

    if (!state.integration) {
        return <DefaultTopPage />
    }

    return (
        <Page>
            <IntegrationPage
                space={space}
                integration={state.integration}
                pageId={pageId}
            />
        </Page>
    );
};

const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);    
    
    // Hide this page title if we are on the Home/index page.  We'll let the parent
    // component provide the SpaceSwitcher header instead.
    let title = Platform.select({
        // This is the title displayed on the back button when they navigate into a subpage.
        ios: i18n.t('IntegrationsListPage::Home'),
        android: i18n.t('IntegrationsListPage::Home'),

        // On web we go ahead and just display the title of the underlying page
        // since this is not tied to header navigation controls.
        web: getSecretNavigationVar(navigation, 'pageTitle'),
    });
    
    const headerTitleComponent = Platform.select({
        // on mobile, we don't display the title so the default space switcher header appears.
        ios: <View />,
        android: <View />,
        // on web space switcher bar is on a separate side bar so we display the title.
        web: null,
    });

    return {
        title: title,
        headerTitle: headerTitleComponent,
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
NativeIntegrationPage.navigationOptions = navigationOptions;

export default withNavigation(NativeIntegrationPage);
