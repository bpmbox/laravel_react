import { withNavigation } from '@react-navigation/core';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PARAM_SPACE } from '../../constants';
import routes from '../../routes';
import { ItemWidth } from '../../theme.style';
import historyService from '../../services/history';
import spaceService from '../../services/space';
import { StyleSheet, View,  ImageBackground, TouchableOpacity, Image  } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messageService from '../../services/message';
import Spinner from '../../components/UIKit/Spinner';

const SeventhIntroduction = (props: { navigation: any }) => {
    const { navigation } = props;
    const { t } = useTranslation('OnboardingJoinSpacePage');
    const joiningSpaceRef = useRef<Space>(); 
    const targetSpace = navigation.getParam(PARAM_SPACE);
    const [isJoining, setIsJoining] = useState<boolean>(false);

    const gotoRedirect = async () => {
        setIsJoining(true);
        let space: Space | null = null;
        if (targetSpace && typeof targetSpace !== 'string') {
            console.debug('SpaceRedirect: using target space:', targetSpace);
            space = targetSpace as Space;
        }
        if (space) {
            //次回スペース参加時にチュートリアル画面を出さないよう、参加履歴を端末に保存
            try {
                await AsyncStorage.setItem(space.name, 'joined')               
              } catch (e) {
                console.error('Error occurred while trying to access device data', e);
                messageService.sendError(
                    t('Error occurred while trying to access device data',e)
                );
              }
            //スペースへ参加して画面遷移
            joiningSpaceRef.current = space;
            try {
                await spaceService.joinSpace(space);
                setIsJoining(false);
                navigation.navigate(routes.MAIN_SPACE_REDIRECT, {
                    [PARAM_SPACE]: space,
                });
            } catch (e) {
                setIsJoining(false);
                console.error('Error occurred while trying to join space', e);
                messageService.sendError(
                    t('Error occurred while trying to join {{spaceName}}.', {
                        spaceName: space.name,
                    })
                );
                setIsJoining(false);
            }
        } else {
            // Navigate to join page so user can select a space they can join.
            console.debug('No possible space to redirect to.');
            setIsJoining(false);
            historyService.navigateAsRoot(routes.ONBOARDING_SPACE);
        }
    };

    var bgPass = require ('../../assets/images/Tree-07.png');

    return (
        <View style={styles.container}>
            {isJoining
                ? <Spinner />
                : <ImageBackground style = {styles.mimage} source = {bgPass}>
                    <View style={styles.bottom}>
                        <TouchableOpacity
                                onPress={gotoRedirect}>
                                <Image
                                    style={styles.imagebutton}
                                    source={require('../../assets/images/next.png')}
                                />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            }

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
SeventhIntroduction.path = 'seventhintro'; //override path for better web URLs

export default withNavigation(SeventhIntroduction);
