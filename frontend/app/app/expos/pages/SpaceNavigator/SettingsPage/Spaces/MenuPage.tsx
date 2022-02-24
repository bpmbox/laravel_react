import { withNavigation } from '@react-navigation/core';
import get from 'lodash/get';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IconId } from '../../../../assets/native/svg-icons';
import SimpleListItem from '../../../../components/UIKit/items/SimpleListItem';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { PARAM_SPACE } from '../../../../constants';
import routes from '../../../../routes';
import historyService from '../../../../services/history';
import { SpaceContext } from '../../SpaceContext';

const SpaceMenuPage = (props: any) => {
    const { t } = useTranslation('SpaceMenuPage');
    const { space } = useContext(SpaceContext);
    const { navigation } = props;

    const openGeneral = () => {
        navigation.push(routes.SETTINGS_SPACE_GENERAL, { [PARAM_SPACE]: space });
    };
    const openPeople = () => {
        navigation.push(routes.SETTINGS_SPACE_PEOPLE, { [PARAM_SPACE]: space });
    };
    const openIntegrations = () => {
        navigation.push(routes.SETTINGS_SPACE_INTEGRATIONS, { [PARAM_SPACE]: space });
    };

    return (
        <Page scrollable>
            <SimpleListItem text={t`Settings`} iconId={IconId.feather_settings_filled_success} onPress={openGeneral} />
            <SimpleListItem text={t`People`} iconId={IconId.feather_users_filled_success} onPress={openPeople} />
            <SimpleListItem
                text={t`Integrations`}
                iconId={IconId.feather_grid_filled_success}
                onPress={openIntegrations}
            />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: get(navigation, 'state.params.space.name', i18n.t('Space Settings')),
        headerBackTitle: i18n.t('Back'),
    };
};

// @ts-ignore
SpaceMenuPage.navigationOptions = navigationOptions;

export default withNavigation(SpaceMenuPage);
