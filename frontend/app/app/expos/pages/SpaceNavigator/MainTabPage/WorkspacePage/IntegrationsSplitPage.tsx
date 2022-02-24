import { SceneView } from '@react-navigation/core';
import get from 'lodash/get';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Spacer } from '../../../../components/integration';
import DesktopPageHeaderWithNavigation from '../../../../components/UIKit/items/DesktopPageHeaderWithNavigation';
import { clearSecretNavigationVar } from '../../../../libs/secret-nav-var';
import { ItemHeight } from '../../../../theme.style';
import IntegrationsListPage from './IntegrationsListPage';

const IntegrationsSplitPage = ({ descriptors, navigation }: any) => {
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const descriptor = descriptors[activeKey];

    // Clean up.  Clear out secretNavigation vars used by child NativeIntegrations.
    useEffect(() => {
        return () => {
            // clear out secret header vars when we exit this page.
            clearSecretNavigationVar(navigation, 'integrationName');
            clearSecretNavigationVar(navigation, 'pageTitle');
        }
    });
    
    return (
        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{width: 240, height: '100%' }}>
                <Spacer height={ItemHeight.xsmall} />
                <IntegrationsListPage activeIntegrationId={get(descriptor, 'navigation.state.params.integrationId')} />
            </View>
            <View style={{flex: 1}}>
                <DesktopPageHeaderWithNavigation text={get(descriptor, 'options.title', '')} />
                <SceneView
                    navigation={descriptor.navigation}
                    component={descriptor.getComponent()}
                />
            </View>
        </View>
    );
};

export default IntegrationsSplitPage;
