import React, { FunctionComponent } from 'react';
import { ItemHeight, FontSize, HorizontalOffset, VerticalOffset } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type BlockquoteProps = ItemProps;

const Blockquote: FunctionComponent<BlockquoteProps> = (props) => {
    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        textSize={FontSize.large}
        quoteBar
        textNumberOfLines={0}
        leftTextOffset={HorizontalOffset.xlarge}
        height={ItemHeight.flex}
        topTextOffset={VerticalOffset.xxlarge}
        bottomTextOffset={VerticalOffset.xxlarge}
        desktopWidth={props.desktopWidth}
        desktopCenterItem={props.desktopCenterItem}
        {...props} />
};

export default Blockquote;
