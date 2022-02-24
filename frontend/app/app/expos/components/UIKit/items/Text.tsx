import React, { FunctionComponent } from 'react';
import defaultTo from 'lodash/defaultTo';
import {
    ItemHeight,
    Color,
    FontSize,
    FontWeight,
} from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type TextProps = {
    light?: boolean;
    extralight?: boolean;
    danger?: boolean;
    success?: boolean;
    link?: boolean;
    white?: boolean;
    center?: boolean;
    narrow?: boolean;
    mini?: boolean;
    small?: boolean;
    large?: boolean;
    bold?: boolean;
    semibold?: boolean;
    medium?: boolean;
    disabled?: boolean;
} & ItemProps;

const Text: FunctionComponent<TextProps> = props => {
    const color = props.light ? Color.accent5 :
        props.danger ? Color.error :
        props.link ? (props.disabled ? Color.accent3 : Color.success) :
        props.extralight ? Color.accent3 :
        props.white ? Color.white :
        props.success ? Color.success :
        Color.black;
    const numberOfLines = defaultTo(props.numberOfLines, 0);
    const textSize = props.small ? FontSize.small :
        props.mini ? FontSize.small :
        props.large ? FontSize.large : FontSize.normal;
    const textWeight = props.bold ? FontWeight.bold :
        props.semibold ? FontWeight.semibold :
        props.medium ? FontWeight.medium : FontWeight.normal;

    return (
        <Item
            text={props.text}
            textSelectable={props.textSelectable}
            textNumberOfLines={numberOfLines}
            centerText={props.center}
            narrowContent={props.narrow}
            height={ItemHeight.flex}
            markdown={props.markdown}
            textColor={color}
            textSize={textSize}
            textWeight={textWeight}
            desktopWidth={props.desktopWidth}
            {...props}
        />
    );
};

export default Text;
