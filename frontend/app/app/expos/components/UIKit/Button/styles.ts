import { StyleSheet} from 'react-native';
import theme, { FontSize, FontWeight, FontWeightType, fontFamily, Color, ButtonType, ButtonSize } from '../../../theme.style';

export const getButtonStyle = (type: ButtonType, invert: boolean, pressed: boolean, disabled: boolean, size: ButtonSize): StyleSheet.NamedStyles<any> => {
    const height = getHeight(size);
    const fontSize = size === ButtonSize.small ? FontSize.small : FontSize.normal;
    const isInvertText = type === ButtonType.text && invert;
    const horizontalPadding = getHorizontalPadding(size);

    return {
        item: {
            borderRadius: theme.radius,
            fontSize: fontSize.valueOf(),
            fontWeight: FontWeight.medium.valueOf() as FontWeightType,
            fontFamily: fontFamily(FontWeight.medium),
            lineHeight: height,
            width: '100%',
            paddingHorizontal: horizontalPadding,
            textAlign: 'center',
            overflow: 'hidden',
            color: getTitleColor(type, invert, pressed, disabled).valueOf(),
            backgroundColor: getBackgroundColor(type, invert, pressed, disabled).valueOf(),
            borderColor: getBorderColor(type, pressed, disabled).valueOf(),
            borderWidth: type === ButtonType.secondary ? theme.borderWidth : 0,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        hover: disabled ? {} : {
            borderRadius: theme.radius,
            shadowColor: isInvertText ? Color.transparent.valueOf() : Color.black.valueOf(),
            shadowOffset: { width: 0, height: 10},
            shadowRadius: 20,
            shadowOpacity: 0.1,
            opacity: isInvertText ? 0.8 : 1
        }
    }
}

const getTitleColor = (type: ButtonType, invert: boolean, pressed: boolean, disabled: boolean): Color => {
    if (disabled) {
        return Color.accent5;
    }
    if (type === ButtonType.secondary) {
        return pressed ? Color.accent7 : Color.black;
    }
    if (type === ButtonType.text) {
        if (invert) {
            return pressed ? Color.black : Color.white;
        } else {
            return pressed ? Color.accent7 : Color.black;
        }
    }
    return Color.white;
}

const getBackgroundColor = (type: ButtonType, invert: boolean, pressed: boolean, disabled: boolean): Color => {
    if (disabled) {
        return Color.accent3;
    }
    switch (type) {
        case ButtonType.success: return Color.success;
        case ButtonType.warning: return Color.warning;
        case ButtonType.error: return Color.error;
        case ButtonType.secondary: return pressed ? Color.accent2 : Color.transparent;
        case ButtonType.text: return pressed ? Color.accent2 : Color.transparent;
    }
}

const getBorderColor = (type: ButtonType, pressed: boolean, disabled: boolean): Color => {
    if (disabled) {
        return Color.accent5;
    }
    if (type !== ButtonType.secondary) {
        return Color.transparent;
    }
    return pressed ? Color.accent7 : Color.black;
}

const getHeight = (size: ButtonSize): number => {
    switch (size) {
        case ButtonSize.small: return 2 * theme.rem;
        case ButtonSize.normal: return 2.5 * theme.rem;
        case ButtonSize.large: return 3 * theme.rem;
    }
}

const getHorizontalPadding = (size: ButtonSize): number => {
    switch (size) {
        case ButtonSize.small: return theme.horizontalPadding;
        case ButtonSize.normal: return 2 * theme.horizontalPadding;
        case ButtonSize.large: return 3 * theme.horizontalPadding;
    }
}
