import React, { FunctionComponent } from 'react';
import { View, ViewProps } from 'react-native';
import { ItemWidth } from '../../../theme.style';
import { isMobilePlatform } from '../../../libs/platform';

type ContainerProps = {
    desktopWidth?: ItemWidth,
} & ViewProps

const Container: FunctionComponent<ContainerProps> = (props) => {
    const style = (isMobilePlatform || props.desktopWidth === ItemWidth.fill || props.desktopWidth === ItemWidth.fit) ?
        {} :
        { maxWidth: props.desktopWidth.valueOf() };

    return <View {...props} style={[style, props.style]}>
            {props.children}
        </View>;
};

export default Container;
