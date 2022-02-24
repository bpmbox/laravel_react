/* istanbul ignore file */
import { withNavigation } from '@react-navigation/core';
import AuthStore from '../../../../../store/auth';
import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    Category,
    categoryIcon,
    categoryName,
    topCategories,
} from '../../../../../libs/integrations';
import { isMobilePlatform } from '../../../../../libs/platform';
import integrationService, { INTEGRATION_UPDATED_EVENT } from '../../../../../services/integration';
import messageService from '../../../../../services/message';
import spaceService from '../../../../../services/space';
import { Spacer } from '../../../../../components/integration';
import MarketplaceIntegrationItem from '../../../../../components/UIKit/items/MarketplaceIntegrationItem';
import SearchField from '../../../../../components/UIKit/items/SearchField';
import SimpleListItem from '../../../../../components/UIKit/items/SimpleListItem';
import Text from '../../../../../components/UIKit/items/Text';
import Page from '../../../../../components/UIKit/Layout/Page';
import {
    PARAM_INTEGRATION_INFO,
    PARAM_ROLE,
    PARAM_SPACE,
} from '../../../../../constants';
import routes from '../../../../../routes';
import { SpaceContext } from '../../../SpaceContext';
import Heading from '../../../../../components/UIKit/items/Heading';
import { ItemHeight, ItemWidth } from '../../../../../theme.style';
import Container from '../../../../../components/UIKit/Layout/Container';
import useListener from '../../../../../libs/use-listener';

type MarketplacePageProps = {
    space: Space;
} & {
    navigation: any;
};

export type IntegrationListState = {
    integrationInfos: Array<NSIntegration.IntegrationInfo>;
    isLoading: boolean;
    isError: boolean;
};

const MarketPlaceMainContent = props => {
    const { t } = useTranslation('MarketplacePage');
    const { isLoading, isError, integrationInfos, handleOnIntegrationPress, searchTerm } = props;

    if (isLoading) {
        return <Text text={t`Loading integrations...`} light small center />;
    }

    if (isError) {
        return <Text text={t`Error loading integrations`} light small center />;
    }

    if (integrationInfos.length === 0) {
        if (searchTerm.length === 0) {
            return <Text text={t`There are no integrations available on this space.`} light small center />;
        }
        return <Text text={t`No matches found.`} light small center />;
    }

    return integrationInfos.map((integrationInfo: NSIntegration.IntegrationInfo) =>
        <MarketplaceIntegrationItem
            key={integrationInfo.integration.id}
            integration={integrationInfo.integration}
            onPress={() => handleOnIntegrationPress(integrationInfo)}
        />
    )
};


const MarketplacePage: FunctionComponent<MarketplacePageProps> = props => {
    const { t } = useTranslation('MarketplacePage');
    const { space, role } = useContext(SpaceContext);
    const { isAuthenticated } = AuthStore.useContainer();
    const { navigation } = props;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [state, setState] = useState<IntegrationListState>({
        integrationInfos: [],
        isLoading: true,
        isError: false,
    });

    const fetchIntegrations = async (query: string) => {
        if (!isAuthenticated) {
            // non-authenticated users cannot view any integrations
            return;
        }

        try {
            const integrationInfos = await spaceService.getIntegrationInfos(
                space,
                query
            );
            setState({ integrationInfos, isLoading: false, isError: false });
        } catch (err) {
            setState({ integrationInfos: [], isLoading: false, isError: true });
            messageService.sendError(t`Error loading integrations.`);
        }
    };

    const handleOnIntegrationPress = integrationInfo => {
        navigation.navigate(routes.INTEGRATIONS_MARKETPLACE_INFO, {
            [PARAM_SPACE]: space,
            [PARAM_ROLE]: role,
            [PARAM_INTEGRATION_INFO]: integrationInfo,
        });
    };

    const handleSearchInput = (text: string) => {
        setSearchTerm(text);
    };

    const onAllCategoriesPress = () => {
        navigation.navigate(routes.INTEGRATIONS_MARKETPLACE_ALL_CATEGORIES, { space });
    };

    const onCategoryPress = (category: Category) => {
        navigation.navigate(routes.INTEGRATIONS_MARKETPLACE_CATEGORY, { space, category });
    };

    useEffect(() => {
        fetchIntegrations(searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    useListener(integrationService, INTEGRATION_UPDATED_EVENT, () => fetchIntegrations(searchTerm));
    useListener(spaceService, INTEGRATION_UPDATED_EVENT, () => fetchIntegrations(searchTerm));

    return (
        <Page scrollable>
            <Container desktopWidth={ItemWidth.wide}>
                <Spacer height={ItemHeight.xsmall} />
                <SearchField
                    placeholder={t`Search integrations...`}
                    onChangeText={handleSearchInput}
                    autoCapitalize="none"
                />
                {searchTerm.length === 0 && isMobilePlatform ?
                    <>
                        <Heading
                            text={t`Top Categories`}
                            h3
                            linkText={t`See All`}
                            onAccessoryTextPress={onAllCategoriesPress}
                        />
                        {topCategories.map((category: Category, index) =>
                            <SimpleListItem
                                key={index}
                                text={categoryName(category)}
                                iconId={categoryIcon(category)}
                                large
                                onPress={() => onCategoryPress(category)}
                            />
                        )}
                        <Heading
                            text={t`Top Integrations`}
                            h3
                        />
                    </>
                : <Spacer height={ItemHeight.xsmall} /> }

                <MarketPlaceMainContent
                    isLoading={state.isLoading}
                    isError={state.isError}
                    integrationInfos={state.integrationInfos}
                    handleOnIntegrationPress={handleOnIntegrationPress}
                    searchTerm={searchTerm}
                />
            </Container>
        </Page>
    );
};

// @ts-ignore
MarketplacePage.path = `:${PARAM_INTEGRATION_INFO}`;

export default withNavigation(MarketplacePage);
