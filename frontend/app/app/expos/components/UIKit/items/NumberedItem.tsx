import React, { FunctionComponent } from 'react';
import { ItemHeight, HorizontalOffset, VerticalOffset } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type NumberedItemProps = {} & ItemProps;

const NumberedItem: FunctionComponent<NumberedItemProps> = (props) => {
    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        textNumberOfLines={0}
        counter={props.counter}
        markdown
        height={ItemHeight.flex}
        leftTextOffset={HorizontalOffset.xlarge}
        topTextOffset={VerticalOffset.none}
        bottomTextOffset={VerticalOffset.none}
        desktopWidth={props.desktopWidth}
        desktopCenterItem={props.desktopCenterItem} />
};

export default NumberedItem;
