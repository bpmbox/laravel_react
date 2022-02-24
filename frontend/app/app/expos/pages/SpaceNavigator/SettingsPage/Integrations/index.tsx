import { withNavigation } from '@react-navigation/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spacer } from '../../../../components/integration';
import { createNavigationOptions, getRightActionHeader } from '../../../../components/Navigation/NavButtons';
import SegmentedControl from '../../../../components/UIKit/SegmentedControl';
import i18n from '../../../../i18n';
import { isMobilePlatform } from '../../../../libs/platform';
import routes from '../../../../routes';
import { ItemHeight } from '../../../../theme.style';
import historyService from '../../../../services/history';
import InstalledIntegrationsPage from './Installed';
import MarketplacePage from './Marketplace';

const IntegrationsPage = () => {
    const { t } = useTranslation('IntegrationsPage');

    const goToMyIntegrations = () => {
        historyService.push(routes.INTEGRATIONS_CONSOLE);
    };

    return (
        <>
            {!isMobilePlatform && <Spacer height={ItemHeight.xsmall} />}
            <SegmentedControl
                items={[
                    {
                        title: t`Installed`,
                        page: <InstalledIntegrationsPage />,
                    },
                    {
                        title: t`Marketplace`,
                        page: <MarketplacePage />,
                    },
                ]}
                externalLink={t`My Integrations`}
                onExternalLinkClick={goToMyIntegrations}
            />
        </>
    );
};

// @ts-ignore
IntegrationsPage.navigationOptions = createNavigationOptions(
    i18n.t('IntegrationsPage::Integrations'),
    null,
    {
        ...getRightActionHeader(i18n.t('IntegrationsPage::My Integrations'), false, true, () => {
            historyService.push(routes.INTEGRATIONS_CONSOLE);
        }),
        headerBackTitle: i18n.t('Back'),
    },
    false
);

// @ts-ignore
IntegrationsPage.path = 'integrations'; //override path for better web URLs

export default withNavigation(IntegrationsPage);
