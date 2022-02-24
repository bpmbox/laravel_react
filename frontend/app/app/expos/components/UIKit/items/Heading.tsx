import React, { FunctionComponent } from 'react';
import { ItemHeight, FontWeight, VerticalOffset, headingFontSize, HeadingLevel, lineHeight, Color } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';
import defaultTo from 'lodash/defaultTo';

type HeadingProps = {
    center?: boolean,
    tall?: boolean,
    flex?: boolean,
    h1?: boolean,
    h2?: boolean,
    h3?: boolean,
    h4?: boolean,
    h5?: boolean,
    h6?: boolean,
    disableMarkdown?: boolean,
    linkText?: string,
    onLinkPress?: () => any,
} & ItemProps;

const getLevel = (props: HeadingProps): HeadingLevel => {
    return props.h1 ? 1 : props.h2 ? 2 : props.h3 ? 3 : props.h4 ? 4 : props.h5 ? 5 : 6;
}

const getOffset = (level: HeadingLevel): number => {
    switch (level) {
        case 1: return VerticalOffset.xxlarge;
        case 2: return VerticalOffset.xlarge;
        case 3: return VerticalOffset.large;
        case 4: return VerticalOffset.normal;
        case 5: return VerticalOffset.normal;
        case 6: return VerticalOffset.normal;
    }
}

const Heading: FunctionComponent<HeadingProps> = (props) => {
    const level = getLevel(props);
    const fontSize = headingFontSize(level);
    const offset = getOffset(level);
    let accessoryProps = {};
    if (defaultTo(props.linkText, null) !== null) {
        accessoryProps = {
            accessoryText: props.linkText,
            accessoryTextColor: Color.success,
        };
    }
    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        textSize={fontSize}
        textWeight={FontWeight.bold}
        height={ItemHeight.flex}
        lineHeight={lineHeight(fontSize)}
        textNumberOfLines={0}
        centerText={props.center}
        topTextOffset={offset}
        bottomTextOffset={offset}
        markdown={!defaultTo(props.disableMarkdown, false)}
        {...accessoryProps}
        {...omit(props, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'center', 'tall', 'flex')} />
};

export default Heading;
