import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { FontSize, FontWeight, ItemHeight, VerticalOffset, HorizontalOffset, IconSize, IconType, IconBackgroundType, IconPosition, Color, BackgroundType } from '../../../theme.style';

type MultilineSubtitleProps = {
    title: string,
    subtitle: string,
    checked?: boolean
} & ItemProps;

const MultilineSubtitle: FunctionComponent<MultilineSubtitleProps> = (props) => {
    const disabled = typeof(props.disabled) !== 'undefined' && props.disabled === true;
    const touchable = !disabled || (typeof(props.onPress) !== 'undefined' && props.onPress !== null);

    return <Item
        text={props.title}
        textSize={FontSize.normal}
        textWeight={FontWeight.semibold}
        textColor={props.disabled ? Color.accent5 : Color.black}
        subText={props.subtitle}
        subTextColor={Color.accent5}
        subTextSize={FontSize.small}
        height={ItemHeight.flex}
        leftTextOffset={HorizontalOffset.default}
        rightTextOffset={HorizontalOffset.xxlarge}
        leftIconSize={IconSize.small}
        leftIconType={IconType.round}
        leftIconBackgroundType={IconBackgroundType.plainDark}
        leftIconPosition={IconPosition.topLeft}
        topItemOffset={VerticalOffset.small}
        bottomItemOffset={VerticalOffset.small}
        checked={props.checked || false}
        pressedBackgroundType={BackgroundType.full}
        touchable={touchable}
        onPress={props.onPress}
        disabled={disabled}
    />
};

export default MultilineSubtitle;
