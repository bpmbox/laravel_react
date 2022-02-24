import React, { FunctionComponent } from 'react';
import { View, ViewProps } from 'react-native';
import { ItemHeight } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import defaultTo from 'lodash/defaultTo';

type ComponentProps = {
    horizontal?: boolean;
} & ViewProps &
    ItemProps;

const Component: FunctionComponent<ComponentProps> = props => {
    const height = defaultTo(props.height, ItemHeight.default);
    if (props.horizontal) {
        return <View style={{ width: height.valueOf() }} />;
    }
    return <Item height={height} desktopWidth={props.desktopWidth} />;
};

export default Component;
