import React, { FunctionComponent } from 'react';
import { DividerPadding, VerticalPosition } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';

type ComponentProps = {
    middle?: boolean,
    bottom?: boolean
} & ItemProps;

const Component: FunctionComponent<ComponentProps> = (props) => {
    const position = props.middle ? VerticalPosition.middle : VerticalPosition.bottom
    return <Item
        dividerPosition={position}
        dividerPadding={DividerPadding.small}
        {...omit(props, 'middle', 'bottom')} />
};

export default Component;
