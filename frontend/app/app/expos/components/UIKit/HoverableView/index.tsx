import React, { FunctionComponent, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ItemProps } from '../Item';
import { isMobilePlatform } from '../../../libs/platform';

type HoverableOpacityProps = {
    hoverStyle?: any,
} & ItemProps;

const HoverableOpacity: FunctionComponent<HoverableOpacityProps> = (props) => {
    const [hover, setHover] = useState<boolean>(false);

    const mouseProps = {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
    }

    if (isMobilePlatform) {
        return <TouchableOpacity {...props} />
    }

    return <TouchableOpacity
        activeOpacity={1}
        style={[{ cursor: 'inherit' }, hover ? props.hoverStyle : {}]}
        {...mouseProps}
    >
        <TouchableOpacity {...props} />
    </TouchableOpacity>
};

export default HoverableOpacity;
