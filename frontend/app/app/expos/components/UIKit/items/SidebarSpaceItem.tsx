import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { ItemHeight, IconSize, IconType, IconBackgroundType, FontSize, FontWeight } from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';

type SidebarSpaceItemProps = {
    space: Space,
    selected?: boolean,
} & ItemProps;

const SidebarSpaceItem: FunctionComponent<SidebarSpaceItemProps> = (props) => {
    let leftIconBackgroundType;
    if (props.space.iconUrl) {
        leftIconBackgroundType = IconBackgroundType.outline;
    } else if (props.selected) {
        leftIconBackgroundType = IconBackgroundType.plainDark;
    } else {
        leftIconBackgroundType = IconBackgroundType.plainLight;
    }

    return <Item
        onPress={props.onPress}
        touchable={props.onPress !== undefined}
        height={ItemHeight.medium}
        textSize={FontSize.normal}
        textWeight={FontWeight.medium}
        leftIconSize={IconSize.normal}
        leftIconType={IconType.rounded}
        leftIndicator={props.selected}
        leftIconBackgroundType={leftIconBackgroundType}
        {...getAvatarProps(props.space.iconUrl, props.space.name)}
        {...props}
    />
};

export default SidebarSpaceItem;
