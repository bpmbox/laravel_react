import React, { FunctionComponent } from 'react';
import { ItemHeight, FontSize, Color, VerticalOffset, lineHeight } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';

type SubHeadingProps = {
    center?: boolean,
} & ItemProps;

const SubHeading: FunctionComponent<SubHeadingProps> = (props) => {
    let fontSize = FontSize.large;
    return <Item
        text={props.text}
        height={ItemHeight.flex}
        textNumberOfLines={0}
        textColor={Color.accent5}
        textSize={fontSize}
        lineHeight={lineHeight(fontSize)}
        centerText={props.center}
        topTextOffset={VerticalOffset.large}
        bottomTextOffset={VerticalOffset.large}
        markdown
        {...omit(props, 'center')} />
};

export default SubHeading;
