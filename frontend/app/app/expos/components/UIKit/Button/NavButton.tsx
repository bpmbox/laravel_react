import React, { FunctionComponent } from 'react';
import ReactNative, { StyleSheet, TouchableOpacity } from 'react-native';
import theme, { IconSize } from '../../../theme.style';
import Icon from '../Icon';
import { IconId } from '../../../assets/native/svg-icons';

type NavButtonProps = {
    iconId: IconId,
    extra?: boolean
} & ReactNative.TouchableOpacityProps

const NavButton: FunctionComponent<NavButtonProps> = (props) => {
    return <TouchableOpacity style={[styles.navButton, {
            marginRight: (props.extra === true) ? 0 : theme.rem
        }]} onPress={props.onPress} disabled={!!props.disabled}>
        <Icon iconSize={IconSize.normal} svgIconId={props.iconId} />
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    navButton: {
        justifyContent: 'center',
        minWidth: 2 * theme.rem,
        minHeight: 2 * theme.rem,
        marginLeft: theme.rem,
    }
});

export default NavButton;
