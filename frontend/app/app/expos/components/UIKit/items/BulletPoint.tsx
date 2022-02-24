import React, { FunctionComponent } from 'react';
import { ItemHeight, HorizontalOffset, VerticalOffset } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

const BulletPoint: FunctionComponent<ItemProps> = (props) => {
    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        bullet
        markdown
        textNumberOfLines={0}
        height={ItemHeight.flex}
        topTextOffset={VerticalOffset.none}
        bottomTextOffset={VerticalOffset.none}
        leftTextOffset={HorizontalOffset.xlarge}
        desktopWidth={props.desktopWidth}
        desktopCenterItem={props.desktopCenterItem}
    />
};

export default BulletPoint;
