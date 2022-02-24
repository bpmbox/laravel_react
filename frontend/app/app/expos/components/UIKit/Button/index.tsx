import React, { useState } from 'react';
import ReactNative, { Text, View } from 'react-native';
import { getButtonStyle } from './styles';
import omit from 'lodash/omit';
import { ButtonType, ButtonSize } from '../../../theme.style';
import defaultTo from 'lodash/defaultTo';
import HoverableOpacity from '../HoverableView';

type ButtonProps = {
    type?: ButtonType,
    title?: string,
    size?: ButtonSize,
    invert?: boolean,
} & ReactNative.TouchableOpacityProps;

const Button: React.FC<ButtonProps> = (props) => {
    const additionalProps = omit(props, 'disabled', 'onPress', 'type', 'onPressIn', 'onPressOut');
    const [pressed, setPressed] = useState<boolean>(false);

    let buttonStyle = getButtonStyle(
        defaultTo(props.type, ButtonType.success),
        defaultTo(props.invert, false),
        pressed,
        defaultTo(props.disabled, false),
        defaultTo(props.size, ButtonSize.normal));

    return (
        <View style={buttonStyle.container} {...additionalProps}>
            <HoverableOpacity
                onPress={(evt) => {
                    if (!props.disabled) {
                        props.onPress && props.onPress(evt);
                    }
                }}
                onPressOut={() => { setPressed(false); }}
                onPressIn={() => { setPressed(true); }}
                activeOpacity={props.disabled ? 1 : 0.9}
                hoverStyle={buttonStyle.hover}
            >
                <Text style={buttonStyle.item} numberOfLines={1} ellipsizeMode={'tail'}>
                    {props.title || props.children}
                </Text>
            </HoverableOpacity>
        </View>
    );
}

export default Button;
