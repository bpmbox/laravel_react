import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { BackgroundType, HorizontalOffset, Color, IconType, IconSize, ItemHeight, IconBackgroundType, FontSize } from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';

type UserGroupSelectionItemProps = {
    group: Group
} & ItemProps;

const UserGroupSelectionItem: FunctionComponent<UserGroupSelectionItemProps> = (props) => {
    return <Item
        text={props.group.name}
        subTextColor={Color.accent5}
        subTextNumberOfLines={1}
        subTextSize={FontSize.small}
        height={ItemHeight.large}
        leftTextOffset={HorizontalOffset.xxxxlarge}
        leftIconSize={IconSize.medium}
        leftIconType={IconType.round}
        leftIconBackgroundType={IconBackgroundType.plainOutlineLight}
        touchable={typeof(props.onPress) !== 'undefined'}
        pressedBackgroundType={BackgroundType.full}
        {...getAvatarProps(null, props.group.name)}
        {...props}
        />
};

export default UserGroupSelectionItem;
