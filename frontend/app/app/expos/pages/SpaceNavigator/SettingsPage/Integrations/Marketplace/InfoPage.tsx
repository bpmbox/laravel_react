/* istanbul ignore file */
import React, { FunctionComponent, useState } from 'react';
import { withNavigation } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import Spacer from '../../../../../components/UIKit/items/Spacer';
import Button from '../../../../../components/UIKit/items/Button';
import Divider from '../../../../../components/UIKit/items/Divider';
import SimpleListItem from '../../../../../components/UIKit/items/SimpleListItem';
import SectionHeading from '../../../../../components/UIKit/items/SectionHeading';
import Callout from '../../../../../components/UIKit/items/Callout';
import Text from '../../../../../components/UIKit/items/Text';
import Page from '../../../../../components/UIKit/Layout/Page';
import IntegrationInfoHeader from '../../../../../components/UIKit/items/IntegrationInfoHeader';
import messageService from '../../../../../services/message';
import spaceService from '../../../../../services/space';
import { isAtLeastAdmin } from '../../../../../types/enums';
import { categoryName } from '../../../../../libs/integrations';
import historyService from '../../../../../services/history';
import { defaultStackNavigationOptions } from '../../../../../libs/nav/config';
import { getModalHeader, ModalButtonType } from '../../../../../components/Navigation/NavButtons';
import { DesktopHeaderType, CalloutType, ItemHeight, PaddingType } from '../../../../../theme.style';
import { PARAM_INTEGRATION_INFO, PARAM_SPACE, PARAM_ROLE } from '../../../../../constants';

const IntegrationInfoPage: FunctionComponent<any> = (props) => {
    const { t } = useTranslation('IntegrationInfoPage');
    const { navigation } = props;
    const integrationInfo = navigation.getParam(PARAM_INTEGRATION_INFO);
    const space = navigation.getParam(PARAM_SPACE);
    const role = navigation.getParam(PARAM_ROLE);
    
    const [loading, setLoading] = useState(false);
    const [installationStatus, setInstallationStatus] = useState<{ installed: boolean, active: boolean }>({ installed: integrationInfo.isInstalled, active: integrationInfo.isActive });

    const handleInstallPress = async () => {
        try {
            setLoading(true);
            await spaceService.installIntegration(space, integrationInfo.integration);
            await new Promise(r => setTimeout(r, 500));
            await spaceService.activateIntegration(space, integrationInfo.integration);
            setInstallationStatus({ installed: true, active: true });
            messageService.sendSuccess(t('{{integrationName}} has been installed on {{spaceName}}.', { integrationName: integrationInfo.integration.name, spaceName: space.name }));
        } catch (err) {
            messageService.sendError(t`Error installing integration.`);
        } finally {
            setLoading(false);
        }
    }

    const canInstall = isAtLeastAdmin(role);

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <Spacer height={ItemHeight.xsmall} />
            <IntegrationInfoHeader integration={integrationInfo.integration} />
            <Spacer height={ItemHeight.xsmall} />
            { canInstall ?
            (
                installationStatus.installed ?
                    <Button text={t`Installed`} disabled={true} /> :
                    <Button text={t`Install`} onPress={() => handleInstallPress()} disabled={loading} />
            ) : (installationStatus.installed &&
                <Text success small text={t('This integration is available on {{spaceName}}.', { spaceName: space.name })} />
            )
            }
            { canInstall && installationStatus.installed && !installationStatus.active &&
                <>
                    <Callout text={t`Note: the integration is installed but not yet activated. In order to make it available to space members, activate it in the integration settings.`} mini type={CalloutType.warning} />
                </>
            }
            <SectionHeading text={t`Info`} />
            <Text text={integrationInfo.integration.fullDesc} />
            <Divider middle />
            <SimpleListItem text={t`Category`} accessoryText={categoryName(integrationInfo.integration.category)} />
            <Divider middle />
            <Text text={t(`Integration ID: {{integrationId}}`, {integrationId: integrationInfo.integration.id})} small light />
        </Page>
    );
};


export const navigationOptions = ({navigation}: any) => {
    historyService.setNavigation(navigation);
    return {
        desktopHeaderType: DesktopHeaderType.none,
        desktopShowClose: false,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close),
    }
};

// @ts-ignore
IntegrationInfoPage.navigationOptions = navigationOptions;

export default withNavigation(IntegrationInfoPage);
