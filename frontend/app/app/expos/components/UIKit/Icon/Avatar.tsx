import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconSize, IconType, FontWeight, fontFamily, FontWeightType, Color } from '../../../theme.style';
import Icon from '.';

type AvatarProps = {
    name?: string;
    initial?: string;
    imageUrl?: string;
    size?: IconSize;
    type?: IconType;
};

const Avatar: FunctionComponent<AvatarProps> = props => {
    const iconSize = props.size || IconSize.small;
    const iconType = props.type || IconType.round;
    if (props.imageUrl) {
        return <Icon iconSize={iconSize} imageUrl={props.imageUrl} iconType={iconType} />;
    } else {
        const initial = (props.initial || props.name || '?').charAt(0).toUpperCase();
        const style = getStyle(iconSize, iconType);

        return (
            <View style={style.container}>
                <Text style={style.text}>{initial}</Text>
            </View>
        );
    }
};

// returns the avatar's border radius
const getRadius = (iconType: IconType, size: number) => {
    if (iconType === IconType.round) {
        return size / 2;
    } else if (iconType === IconType.rounded) {
        return 7;
    } else {
        return 0;
    }
};

// return appropriate font size based on icon size
const getFontSize = (iconSize: number) => {
    if (iconSize === IconSize.large) {
        return 44;
    } else if (iconSize === IconSize.medium) {
        return 32;
    } else {
        return 20;
    }
};

const getStyle = (iconSize: IconSize, iconType: IconType): StyleSheet.NamedStyles<any> => {
    const size = iconSize.valueOf();
    const radius = getRadius(iconType, size);
    const fontSize = getFontSize(iconSize);

    return StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: radius,
            overflow: 'hidden',
            backgroundColor: Color.accent4.valueOf(),
        },
        text: {
            fontFamily: fontFamily(FontWeight.medium),
            fontSize: fontSize,
            fontWeight: FontWeight.medium.valueOf() as FontWeightType,
            color: Color.white.valueOf(),
            textAlign: 'center',
            height: size,
            width: size,
            lineHeight: size,
        },
    });
};

export default Avatar;
