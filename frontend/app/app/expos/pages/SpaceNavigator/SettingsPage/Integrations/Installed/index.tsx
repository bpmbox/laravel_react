/* istanbul ignore file */
import React, { useEffect, useState, FunctionComponent, useContext } from 'react';
import { withNavigation } from '@react-navigation/core';
import AuthStore from '../../../../../store/auth';
import { isAtLeastAdmin, Role } from '../../../../../types/enums';
import messageService from '../../../../../services/message';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../../../../../components/UIKit/items/SectionHeading';
import Text from '../../../../../components/UIKit/items/Text';
import Page from '../../../../../components/UIKit/Layout/Page';
import Container from '../../../../../components/UIKit/Layout/Container';
import routes from '../../../../../routes';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../../../../services/integration';
import MarketplaceIntegrationItem from '../../../../../components/UIKit/items/MarketplaceIntegrationItem';
import spaceService from '../../../../../services/space';
import SearchField from '../../../../../components/UIKit/items/SearchField';
import { Spacer } from '../../../../../components/integration';
import { ItemWidth, ItemHeight } from '../../../../../theme.style';
import { SpaceContext } from '../../../SpaceContext';
import useListener from '../../../../../libs/use-listener';

type InstalledIntegrationsPageProps = {
    space: Space;
} & {
    navigation: any; // work around too avoid importing NavigationInjectedProps from react-navigation/native
};

type IntegrationListState = {
    activatedInfos: Array<NSIntegration.IntegrationInfo>;
    notActivatedInfos: Array<NSIntegration.IntegrationInfo>;
    isLoading: boolean;
    isError: boolean;
};

const InstalledIntegrationsMainContent = props => {
    const { t } = useTranslation('InstalledIntegrationsPage');
    const {
        isLoading,
        isError,
        activatedInfos,
        notActivatedInfos,
        searchTerm,
        canInstall,
        handleOnIntegrationPress,
    } = props;

    if (isLoading) {
        return <Text text={t`Loading integrations...`} light small center />;
    }

    if (isError) {
        return <Text text={t`Error loading integrations`} light small center />;
    }

    if (activatedInfos.length === 0 && notActivatedInfos.length === 0) {
        if (searchTerm.length === 0) {
            return <Text text={t`There are no integrations installed on this space.`} light small center />;
        }
        return <Text text={t`No matches found.`} light small center />;
    }

    const activatedIntegrations = activatedInfos.map((integrationInfo: NSIntegration.IntegrationInfo) => (
        <MarketplaceIntegrationItem
            key={integrationInfo.integration.id}
            integration={integrationInfo.integration}
            onAccessoryTextPress={() => canInstall && handleOnIntegrationPress(integrationInfo)}
            showConfigure={canInstall}
        />
    ));

    const notActivatedIntegrations = notActivatedInfos.map((integrationInfo: NSIntegration.IntegrationInfo) => (
        <MarketplaceIntegrationItem
            key={integrationInfo.integration.id}
            integration={integrationInfo.integration}
            onAccessoryTextPress={() => handleOnIntegrationPress(integrationInfo)}
            showConfigure
        />
    ));

    return (
        <>
            {activatedIntegrations}
            {notActivatedInfos.length > 0 && searchTerm.length === 0 && <SectionHeading text={t`Not Activated`} />}
            {notActivatedIntegrations}
        </>
    );
};

const InstalledIntegrationsPage: FunctionComponent<InstalledIntegrationsPageProps> = props => {
    const { t } = useTranslation('InstalledIntegrationsPage');
    const { space, role } = useContext(SpaceContext);
    const { navigation } = props;
    const { currentUser, isAuthenticated } = AuthStore.useContainer();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [state, setState] = useState<IntegrationListState>({
        activatedInfos: [],
        notActivatedInfos: [],
        isLoading: true,
        isError: false,
    });
    const [config, setConfig] = useState<NSIntegration.Config>({
        categoryChoices: [],
        typeChoices: [],
        accessChoices: [],
        defaultPermissionChoices: [],
    });

    const loadConfig = async () => {
        try {
            // eslint-disable-next-line no-shadow
            const config = await integrationService.getConfig();
            setConfig(config);
        } catch (err) {}
    };

    const fetchIntegrations = async (query: string) => {
        if (!isAuthenticated) {
            // non-authenticated users cannot view any integrations
            return;
        }

        try {
            const integrationInfos = await spaceService.getAccessibleIntegrationInfos(
                space,
                currentUser,
                role,
                query,
                null,
                true
            );
            const activatedInfos = integrationInfos.filter(info => info.isActive);
            const notActivatedInfos = integrationInfos.filter(info => !info.isActive);
            setState({
                activatedInfos,
                notActivatedInfos,
                isLoading: false,
                isError: false,
            });
        } catch (err) {
            setState({
                activatedInfos: [],
                notActivatedInfos: [],
                isLoading: false,
                isError: true,
            });
            messageService.sendError(t`Error loading integrations.`);
        }
    };

    const handleOnIntegrationPress = integrationInfo => {
        navigation.push(routes.INTEGRATIONS_CONSOLE_CONFIGURE_INTEGRATION, {
            integrationInfo,
            config,
        });
    };

    const handleSearchInput = (text: string) => {
        setSearchTerm(text);
    };

    useEffect(() => {
        fetchIntegrations(searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, isAuthenticated, role, searchTerm, space]);

    useEffect(() => {
        loadConfig();
    }, []);

    useListener(integrationService, INTEGRATION_UPDATED_EVENT, () => fetchIntegrations(searchTerm));
    useListener(spaceService, INTEGRATION_UPDATED_EVENT, () => fetchIntegrations(searchTerm));

    const canInstall = isAtLeastAdmin(role || Role.GUEST);

    return (
        <Page scrollable>
            <Container desktopWidth={ItemWidth.wide}>
                <Spacer height={ItemHeight.xsmall} />
                <SearchField
                    placeholder={t`Search integrations...`}
                    onChangeText={handleSearchInput}
                    autoCapitalize="none"
                />

                <Spacer height={ItemHeight.xsmall} />
                <InstalledIntegrationsMainContent
                    isLoading={state.isLoading}
                    isError={state.isError}
                    activatedInfos={state.activatedInfos}
                    notActivatedInfos={state.notActivatedInfos}
                    searchTerm={searchTerm}
                    canInstall={canInstall}
                    handleOnIntegrationPress={handleOnIntegrationPress}
                />
            </Container>
        </Page>
    );
};

export default withNavigation(InstalledIntegrationsPage);
