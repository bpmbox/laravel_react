import { withNavigation } from '@react-navigation/core';
import React from 'react';
import { PARAM_SPACE } from '../../constants';
import routes from '../../routes';
import { ItemWidth} from '../../theme.style';
import historyService from '../../services/history';
import { StyleSheet, View, ImageBackground, TouchableOpacity, Image } from 'react-native';

const FifthIntroduction = (props: { navigation: any }) => {
    const { navigation } = props;
    const targetSpace = navigation.getParam(PARAM_SPACE);

    const gotoNextIntroduction = async () => {
        let space: Space | null = null;
        if (targetSpace && typeof targetSpace !== 'string') {
            console.debug('SpaceRedirect: using target space:', targetSpace);
            space = targetSpace as Space;
        }
        if (space) {
            navigation.navigate(routes.ONBOARDING_SPACE_SIXTHINTRO, {[PARAM_SPACE]: space});
        } else {
            // Navigate to join page so user can select a space they can join.
            console.debug('No possible space to redirect to.');
            historyService.navigateAsRoot(routes.ONBOARDING_SPACE);
        }
    }

    var bgPass = require ('../../assets/images/Tree-05.png');

    return (
        <View style={styles.container}>
            <ImageBackground style = {styles.mimage} source = {bgPass}>
                <View style={styles.bottom}>
                    <TouchableOpacity
                            onPress={gotoNextIntroduction}>
                            <Image
                                style={styles.imagebutton}
                                source={require('../../assets/images/next.png')}
                            />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
      },
    desktopLayoutView: {
        maxWidth: ItemWidth.narrow.valueOf(),
        width: '100%',
    },
    mimage: {
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', 
    },
    imagebutton: {
        width: 50,
        height: 80, 
    },
    bottom: {
        flex: 1,
        position: 'absolute',
        top:'37%',
        left:'90%',
      }
});

// @ts-ignore
FifthIntroduction.path = 'fifthintro'; //override path for better web URLs

export default withNavigation(FifthIntroduction);
