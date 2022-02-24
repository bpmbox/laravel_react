/* istanbul ignore file */
import React, { FunctionComponent,useEffect} from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { withNavigation } from '@react-navigation/core';
import Page from '../../components/UIKit/Layout/Page';
import UserItem from '../../components/UIKit/items/UserItem';
import AuthStore from '../../store/auth';
import historyService from '../../services/history';
import routes from '../../routes';
import i18n from '../../i18n';
import { log } from '../../services/log/log';

const SelectAccountPage: FunctionComponent<NavigationInjectedProps> = () => {
    // TODO - add support for multiple accounts
    const { currentUser } = AuthStore.useContainer();
    global['_change'] = true;
    if (currentUser) {
        global['givenName'] = currentUser.givenName;
        global['familyName'] = currentUser.familyName;
        global['userID'] = currentUser.id;
    }

    useEffect(() => {
        (async () => {
            try {
                //setState({ ...state, loading: true, error: false });
                //const contents = await getContents(env);

                const content21 = await getContents();
                //setState({ ...state, contents: content21, loading: false, error: false });
                console.log('selectcountpage 28 ' + content21);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                //content2 = content21;
            } catch (err) {
                console.error('NativeIntegrationPage: error loading homepage', err);
            }
        })();
    });

    if (!currentUser) {
        return <View />;
    }

    return (
        <Page scrollable>
            <UserItem
                user={currentUser}
                onPress={() => {
                    if (global['loading'] === 1) historyService.push(routes.SETTINGS_ACCOUNT_GENERAL);
                }}
            />
        </Page>
    );
};

async function getContents() {
    return new Promise(async function(resolve, reject) {
        try {
            const lg = new log();
            let response = await lg.getname(global['userID']);
            console.log('desktop page 49 ------------------------------------ ' + response);
            let responseJson = await response;
            //console.log(responseJson);
            resolve(responseJson);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('SelectAccountPage::Accounts'),
    };
};

// @ts-ignore
SelectAccountPage.navigationOptions = navigationOptions;

// @ts-ignore
SelectAccountPage.path = 'accounts'; //override path for better web URLs

export default withNavigation(SelectAccountPage);
