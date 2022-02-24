import React, { FunctionComponent } from 'react';
import { ItemHeight, BackgroundType, HorizontalOffset, VerticalOffset, FontSize, LineHeight } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type CodeProps = {
    lang?: string
} & ItemProps;

const Code: FunctionComponent<CodeProps> = (props) => {
    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        code
        textNumberOfLines={0}
        textSize={FontSize.small}
        lineHeight={LineHeight.normal}
        backgroundType={BackgroundType.narrow}
        leftTextOffset={HorizontalOffset.large}
        rightTextOffset={HorizontalOffset.large}
        topTextOffset={VerticalOffset.xxlarge}
        bottomTextOffset={VerticalOffset.xxlarge}
        height={ItemHeight.flex}
        desktopWidth={props.desktopWidth}
        desktopCenterItem={props.desktopCenterItem} />
};

export default Code;
