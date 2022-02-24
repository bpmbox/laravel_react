import { SceneView } from '@react-navigation/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import SettingsMenuItem from '../../../components/UIKit/items/SettingsMenuItem';
import Spacer from '../../../components/UIKit/items/Spacer';
import routes from '../../../routes';
import { ItemHeight } from '../../../theme.style';

const SpaceSettingsMenu = ({descriptors, navigation}: any) => {
    const { t } = useTranslation('SpaceSettingsMenu');
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const descriptor = descriptors[activeKey];

    const getProps = (route: any) => {
        const active = activeKey === route;
        return {
            active,
            touchable: activeKey !== route,
            onPress: activeKey === route ? null : () => {
                navigation.navigate(route);
            },
        }
    }

    return <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{width: 220 }}>
            <ScrollView>
                <Spacer height={ItemHeight.xsmall} />
                <SettingsMenuItem text={t`Settings`} {...getProps(routes.TAB_SPACE_SETTINGS_GENERAL)} />
                <SettingsMenuItem text={t`People`} {...getProps(routes.TAB_SPACE_SETTINGS_PEOPLE)} />
                <SettingsMenuItem text={t`Integrations`} {...getProps(routes.TAB_SPACE_SETTINGS_INTEGRATIONS)} />
            </ScrollView>
        </View>

        <View style={{flex: 1}}>
            <SceneView
                navigation={descriptor.navigation}
                component={descriptor.getComponent()}
            />
        </View>
    </View>
};

export default SpaceSettingsMenu;
