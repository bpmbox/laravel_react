import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Item from '../Item';
import { BackgroundType, HorizontalOffset, Color, IconType, IconSize, ItemHeight, IconBackgroundType, FontSize, FontWeight } from '../../../theme.style';
import defaultTo from 'lodash/defaultTo';
import { getAvatarProps } from '../../../libs/ui-utils';

type SettingsUserGroupItemProps = {
    group: NSGroupService.GroupWithMemberCount,
    numMembers?: number,
    onConfigurePress?: () => void,
    onPress?: () => void,
};

const SettingsUserGroupItem: FunctionComponent<SettingsUserGroupItemProps> = (props) => {
    const { t } = useTranslation('SettingsUserGroupItem');
    
    const memberCount = defaultTo(props.group.memberCount, 0);
    const subText = memberCount === 1 ? t`1 member`: t('{{count}} members', { count: memberCount });
    
    return <Item
        text={props.group.name}
        subText={subText}
        accessoryText={props.onConfigurePress ? t`Configure` : null}
        accessoryTextColor={Color.success}
        accessoryTextWeight={FontWeight.medium}
        onAccessoryTextPress={props.onConfigurePress}
        onPress={props.onPress}
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
        />
};

export default SettingsUserGroupItem;
