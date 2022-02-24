import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePermissionsString } from '../../../libs/integrations';
import { getUserIconProps } from '../../../libs/ui-utils';
import { formatDisplayName } from '../../../libs/user-utils';
import { BackgroundType, Color, FontSize, FontWeight, HorizontalOffset, IconBackgroundType, IconSize, IconType, ItemHeight } from '../../../theme.style';
import Item from '../Item';

type AccessItemProps = {
    user?: User,
    group?: Group,
    permissions: string[],
    onConfigurePress: () => any,
};

const AccessItem: FunctionComponent<AccessItemProps> = (props) => {
    const { t } = useTranslation('AccessItem');

    let text = "";
    let subText = generatePermissionsString(props.permissions);
    let iconProps = {};
    if (props.user) {
        text = formatDisplayName(props.user)
        iconProps = getUserIconProps(props.user)
    } else if (props.group) {
        text = props.group.name
        let initial = (props.group.name && props.group.name.length > 0) ? props.group.name.charAt(0).toUpperCase() : '?'
        iconProps = {
            leftIconBackgroundType: IconBackgroundType.plainLight,
            leftIconInitial: initial,
        }
    }

    return <Item
        text={text}
        subText={subText}
        subTextColor={Color.accent5}
        subTextNumberOfLines={1}
        subTextSize={FontSize.small}
        accessoryText={t`Configure`}
        accessoryTextColor={Color.success}
        accessoryTextWeight={FontWeight.medium}
        height={ItemHeight.large}
        leftTextOffset={HorizontalOffset.xxxxlarge}
        leftIconSize={IconSize.medium}
        leftIconType={IconType.round}
        touchable={typeof(props.onConfigurePress) !== 'undefined'}
        pressedBackgroundType={BackgroundType.none}
        onAccessoryTextPress={props.onConfigurePress}
        {...iconProps}
    />
};

export default AccessItem;
