import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { withNavigation } from '@react-navigation/core';
import Icon from '../../components/UIKit/Icon';
import { IconId } from '../../assets/native/svg-icons';
import Heading from '../../components/UIKit/items/Heading';
import Button from '../../components/UIKit/Button';
import routes from '../../routes';
import { ButtonType, ButtonSize, ItemHeight } from '../../theme.style';
import Row from '../../components/UIKit/Layout/Row';
import Spacer from '../../components/UIKit/items/Spacer';
import { openURL } from '../../libs/linking';
import useDimensions from '../../libs/responsive-ui/use-dimensions';
//import chatService from '../../services/chat';

export const REQUEST_ACCESS_TYPEFORM_URL = 'https://withtree.typeform.com/to/yM6Mhm';

const BUTTON_ITEM_HEIGHT = 56;

export const ICON_HEIGHT = 33;
export const ICON_WIDTH = 110;
export const ICON_TOP = 50;
export const BUTTON_TOP = ICON_TOP - (BUTTON_ITEM_HEIGHT - ICON_HEIGHT) / 2;

const HomePage = (props) => {
    const { t } = useTranslation('HomePage');
    const { navigation } = props;
    const { width } = useDimensions();
    const isMobile = width <= 540;
    const isTablet = width <= 640;
    const isWeb = !isMobile && !isTablet;

    const goto = (route) => () => {
        navigation.navigate(route);
    };
    
    //chatService.nativeOnlyRegisterAnalitics("PulicHomepage");
    

    return <ImageBackground source={{uri: require('../../assets/images/forest.jpg')}} style={styles.background}>
        <View style={isWeb ? styles.logoWeb : styles.logoMobile}>
            <Icon svgIconId={IconId.logo_tree_logotype_border___sunrise} width={ICON_WIDTH} height={ICON_HEIGHT} />
        </View>
        <View style={isWeb ? styles.menuWeb : styles.menuMobile}>
            <Row>
                { !isMobile &&
                    <Button title={t`Request Access`} type={ButtonType.text} size={ButtonSize.normal} onPress={() => openURL(REQUEST_ACCESS_TYPEFORM_URL, '_blank') }/>
                }
                <Spacer horizontal height={ItemHeight.xsmall} />
                <Button title={t`Log In`} type={ButtonType.secondary} size={ButtonSize.normal} onPress={goto(routes.LOGIN)}/>
            </Row>
        </View>
        <View style={isWeb ? styles.centerWeb : styles.centerMobile}>
            <Heading text={t`Planting communities
one place at a time`} h1={!isMobile} h2={isMobile} center textSelectable disableMarkdown />
        </View>
        <View style={isMobile ? styles.footerMobile : isTablet ? styles.footerTablet : styles.footerWeb}>
            { isMobile &&
                <View>
                    <Button title={t`Request Access`} type={ButtonType.text} size={ButtonSize.normal} invert onPress={() => openURL(REQUEST_ACCESS_TYPEFORM_URL, '_blank') }/>
                </View>
            }
            <View>
                <Button title={t`Developers`} type={ButtonType.text} size={ButtonSize.normal} invert onPress={() => openURL('https://treedocs.now.sh/', '_blank') }/>
            </View>
        </View>
    </ImageBackground>
};

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWeb: {
        position: 'absolute',
        left: 80,
        top: ICON_TOP,
    },
    logoMobile: {
        position: 'absolute',
        left: 30,
        top: ICON_TOP,
    },
    menuWeb: {
        position: 'absolute',
        right: 70,
        top: BUTTON_TOP+5,
    },
    menuMobile: {
        position: 'absolute',
        right: 20,
        top: BUTTON_TOP+5,
    },
    centerWeb: {
        marginLeft: 70,
        marginRight: 70,
    },
    centerMobile: {
        marginLeft: 20,
        marginRight: 20,
    },
    footerWeb: {
        alignItems: 'flex-start',
        position: 'absolute',
        bottom: 40,
        left: 70,
        right: 70,
        flexDirection: 'row',
    },
    footerTablet: {
        alignItems: 'flex-start',
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
    },
    footerMobile: {
        display: 'flex',
        position: 'absolute',
        bottom: 40,
    }
});

export default withNavigation(HomePage);
