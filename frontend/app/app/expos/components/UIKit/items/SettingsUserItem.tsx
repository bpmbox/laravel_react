import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { BackgroundType, HorizontalOffset, Color, IconType, IconSize, ItemHeight, IconBackgroundType, FontSize, FontWeight } from '../../../theme.style';
import { Role, roleToString } from '../../../types/enums';
import pick from 'lodash/pick';
import { getAvatarProps } from '../../../libs/ui-utils';
import { formatDisplayName } from '../../../libs/user-utils';

type SettingsUserItemProps = {
    user: User,
    role: Role,
    showRole?: boolean
    onRolePress?: () => void
} & ItemProps;

const SettingsUserItem: FunctionComponent<SettingsUserItemProps> = (props) => {
    const touchable = typeof(props.onPress) !== 'undefined' && props.onPress !== null;
    const remainingProps = pick(props, 'desktopWidth');

    return <Item
        text={formatDisplayName(props.user)}
        subText={props.user.email}
        touchable={touchable}
        accessoryText={props.showRole ? roleToString(props.role) : null}
        accessoryTextColor={Color.success}
        accessoryTextWeight={FontWeight.medium}
        onAccessoryTextPress={props.onRolePress}
        onPress={props.onPress}
        subTextColor={Color.accent5}
        subTextNumberOfLines={1}
        subTextSize={FontSize.small}
        height={ItemHeight.large}
        leftTextOffset={HorizontalOffset.xxxxlarge}
        leftIconSize={IconSize.medium}
        leftIconType={IconType.round}
        leftIconBackgroundType={IconBackgroundType.plainOutlineLight}
        pressedBackgroundType={BackgroundType.none}
        {...getAvatarProps(props.user.avatarUrl, props.user.givenName)}
        {...remainingProps} />
};

export default SettingsUserItem;
