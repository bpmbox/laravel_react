import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { BackgroundType, HorizontalOffset, IconType, IconSize, ItemHeight, FontWeight } from '../../../theme.style';
import omit from 'lodash/omit';

type SettingsMenuItemProps = {
    active: boolean,
} & ItemProps;

const SettingsMenuItem: FunctionComponent<SettingsMenuItemProps> = (props) => {
    return <Item
        textWeight={props.active ? FontWeight.semibold : FontWeight.normal}
        height={ItemHeight.default}
        leftTextOffset={props.leftIconId ? HorizontalOffset.xxxlarge : HorizontalOffset.large }
        leftIconSize={IconSize.normal}
        leftIconType={IconType.plain}
        pressedBackgroundType={BackgroundType.menu}
        backgroundType={props.active ? BackgroundType.menu : BackgroundType.none}
        {...omit(props, 'active')} />
};

export default SettingsMenuItem;
