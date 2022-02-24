import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { BackgroundType, HorizontalOffset, FontSize, Color, IconType, IconSize, FontWeight, ItemHeight } from '../../../theme.style';
import { IconId } from '../../../assets/native/svg-icons';
import defaultTo from 'lodash/defaultTo';
import omit from 'lodash/omit';

type ComponentProps = {
    iconId?: IconId,
    iconUrl?: string,
    iconType?: IconType,
    sep?: boolean,
    link?: boolean,
    light?: boolean,
    large?: boolean,
    emphasized?: boolean,
    height?: ItemHeight,
} & ItemProps;

const Component: FunctionComponent<ComponentProps> = (props) => {
    const hasIcon = props.iconId !== undefined || props.iconUrl !== undefined;
    const leftTextOffset = defaultTo(props.leftTextOffset, hasIcon ? HorizontalOffset.xxxlarge : HorizontalOffset.default);
    const rightTextOffset = props.checked ? HorizontalOffset.xxxlarge : HorizontalOffset.default;
    const textSize = (props.link || props.large) ? FontSize.large : FontSize.normal;
    const textColor = props.link ? Color.success : (props.light ? Color.accent5 : Color.black);
    const textWeight = props.emphasized ? FontWeight.semibold : FontWeight.normal;

    let iconProps = {};
    if (props.iconId !== undefined) {
        iconProps = { leftIconId: props.iconId };
    } else if (props.iconUrl !== undefined) {
        iconProps = { leftIconImageUrl: props.iconUrl };
    }

    const disabled = defaultTo(props.disabled, false);

    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        height={defaultTo(props.height, ItemHeight.default)}
        touchable={!disabled && props.onPress !== undefined}
        checked={props.checked}
        toggled={props.toggled}
        onPress={props.onPress}
        leftTextOffset={leftTextOffset}
        rightTextOffset={rightTextOffset}
        textSize={textSize}
        textColor={textColor}
        textWeight={textWeight}
        pressedBackgroundType={disabled ? BackgroundType.none : BackgroundType.full}
        leftIconType={defaultTo(props.iconType, IconType.round)}
        leftIconSize={IconSize.small}
        accessoryText={props.accessoryText}
        {...iconProps}
        {...omit(props,
            'iconId',
            'iconUrl',
            'sep',
            'link',
            'light',
            'large',
            'emphasized')}
    />
};

export default Component;
