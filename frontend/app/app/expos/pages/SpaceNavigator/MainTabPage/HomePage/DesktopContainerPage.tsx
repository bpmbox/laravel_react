import { SceneView } from '@react-navigation/core';
import get from 'lodash/get';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import DesktopPageHeaderWithNavigation from '../../../../components/UIKit/items/DesktopPageHeaderWithNavigation';
import { clearSecretNavigationVar, getSecretNavigationVar } from '../../../../libs/secret-nav-var';
import { log } from '../../../../services/log/log';
import AuthStore from '../../../../store/auth';
const DesktopContainerPage = ({ descriptors, navigation }: any) => {
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const descriptor = descriptors[activeKey];

    const isOnHomeEntryPage = !get(descriptor, 'state.params.pageId', null);
    const title = isOnHomeEntryPage ? '' : getSecretNavigationVar(navigation, 'pageTitle');
    //const { currentUser } = AuthStore.useContainer();
    const { currentUser } = AuthStore.useContainer();
    console.log('DeskTop page ======= ' + currentUser.id);
    global['givenName'] = currentUser.givenName;
    global['familyName'] = currentUser.familyName;
    global['userID'] = currentUser.id;

    // Clean up.  Clear out secretNavigation vars used by child NativeIntegrations.
    useEffect(() => {
        console.log('DeskTopContainer page ======== ' + currentUser.id);
        global['givenName'] = currentUser.givenName;
        global['familyName'] = currentUser.familyName;
        global['userID'] = currentUser.id;
        (async () => {
            try {
                //setState({ ...state, loading: true, error: false });
                //const contents = await getContents(env);

                await getContents();
                //setState({ ...state, contents: content21, loading: false, error: false });
                console.log('DeskTopContainer Page ' + global['userID']);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                //content2 = content21;
            } catch (err) {
                console.error('NativeIntegrationPage: error loading homepage', err);
            }
        })();
        return () => {
            // clear out secret header vars when we exit this page.
            clearSecretNavigationVar(navigation, 'integrationName');
            clearSecretNavigationVar(navigation, 'pageTitle');
        };
    });

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <DesktopPageHeaderWithNavigation text={title} />
                <SceneView navigation={descriptor.navigation} component={descriptor.getComponent()} />
            </View>
        </View>
    );
};

async function getContents() {
    return new Promise(async function(resolve, reject) {
        try {
            const lg = new log();
            let response = await lg.getname('2630b110-11c0-4ea0-a53f-984003669ff8');
            console.log('57 desctopPage get attributes');
            let responseJson = await response;
            //console.log(responseJson);
            resolve(responseJson);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

export default DesktopContainerPage;
