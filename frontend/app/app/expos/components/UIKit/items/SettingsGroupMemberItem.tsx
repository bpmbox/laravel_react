import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Item, { ItemProps } from '../Item';
import { BackgroundType, HorizontalOffset, Color, IconType, IconSize, ItemHeight, IconBackgroundType, FontSize, FontWeight } from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';
import { formatDisplayName } from '../../../libs/user-utils';

type SettingsGroupMemberItemProps = {
    user: User,
    onRemovePress?: () => void
} & ItemProps;

const SettingsGroupMemberItem: FunctionComponent<SettingsGroupMemberItemProps> = (props) => {
    const { t } = useTranslation('SettingsGroupMemberItem');

    return <Item
        text={formatDisplayName(props.user)}
        subText={props.user.email}
        touchable={props.onPress !== undefined}
        accessoryText={props.onRemovePress ? t`Remove` : null}
        accessoryTextColor={Color.success}
        accessoryTextWeight={FontWeight.medium}
        onAccessoryTextPress={props.onRemovePress}
        onPress={props.onPress}
        subTextColor={Color.accent5}
        subTextNumberOfLines={1}
        subTextSize={FontSize.small}
        height={ItemHeight.large}
        leftTextOffset={HorizontalOffset.xxxxlarge}
        leftIconSize={IconSize.medium}
        leftIconType={IconType.round}
        leftIconBackgroundType={IconBackgroundType.plainOutlineLight}
        pressedBackgroundType={BackgroundType.full}
        {...getAvatarProps(props.user.avatarUrl, props.user.givenName)} />
};

export default SettingsGroupMemberItem;
