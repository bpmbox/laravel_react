import React, { FunctionComponent } from 'react';
import ReactNative, { StyleSheet, TouchableOpacity } from 'react-native';
import theme, { IconSize } from '../../../theme.style';
import Icon from '../Icon';
import { IconId } from '../../../assets/native/svg-icons';
import defaultTo from 'lodash/defaultTo';

type IconButtonProps = {
    iconId: IconId,
    size?: IconSize
} & ReactNative.TouchableOpacityProps

const IconButton: FunctionComponent<IconButtonProps> = (props) => {
    return <TouchableOpacity style={styles.navButton} onPress={props.onPress} disabled={!!props.disabled}>
        <Icon iconSize={defaultTo(props.size, IconSize.small)} svgIconId={props.iconId} />
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    navButton: {
        justifyContent: 'center',
        minWidth: 2 * theme.rem,
        minHeight: 2 * theme.rem,
    }
});

export default IconButton;
