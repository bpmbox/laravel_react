import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import theme, { IconSize, IconType } from '../../../theme.style';
import { IconId } from '../../../assets/native/svg-icons';
import { SvgByIconId } from './svg';
import RemoteImage from '../RemoteImage';

type IconProps = {
    iconSize?: IconSize;
    iconType?: IconType;
    svgIconId?: IconId;
    imageUrl?: string;
    width?: number;
    height?: number;
};

const Icon: FunctionComponent<IconProps> = props => {
    let styles: any = [];
    let computedWidth = 0;
    let computedHeight = 0;
    if (props.width === undefined || props.height === undefined) {
        const size = isNaN(props.iconSize) ? IconSize.small : props.iconSize;
        computedWidth = size.valueOf();
        computedHeight = size.valueOf();
    } else {
        computedWidth = props.width;
        computedHeight = props.height;
    }
    styles.push({ width: computedWidth, height: computedHeight });

    switch (props.iconType) {
        case IconType.round:
            styles.push({ borderRadius: computedWidth / 2 });
            break;
        case IconType.rounded:
            styles.push({ borderRadius: theme.radius });
            break;
    }

    let image = null;

    if (props.svgIconId) {
        image = <SvgByIconId width={computedWidth} height={computedHeight} iconId={props.svgIconId} />;
    } else if (props.imageUrl) {
        image = <RemoteImage uri={props.imageUrl} style={styles} />;
    }

    return <View style={styles}>{image}</View>;
};

export default Icon;
