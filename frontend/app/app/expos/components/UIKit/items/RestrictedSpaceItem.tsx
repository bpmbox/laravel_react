import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Item, { ItemProps } from '../Item';
import { FontSize, FontWeight, ItemHeight, HorizontalOffset, IconSize, IconType, IconBackgroundType, BackgroundType, Color } from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';

type RestrictedSpaceItemProps = {
    space: Space,
    onRemovePress?: () => any,
} & ItemProps;

const RestrictedSpaceItem: FunctionComponent<RestrictedSpaceItemProps> = (props) => {
    const { t } = useTranslation('RestrictedSpaceItemProps');

    return <Item
        text={props.space.name}
        onPress={props.onPress}
        touchable={props.onPress !== undefined}
        textSize={FontSize.normal}
        textWeight={FontWeight.medium}
        height={ItemHeight.xlarge}
        leftTextOffset={HorizontalOffset.xxxxxlarge}
        leftIconSize={IconSize.large}
        leftIconType={IconType.rounded}
        leftIconBackgroundType={IconBackgroundType.plainOutlineLight}
        pressedBackgroundType={BackgroundType.full}
        accessoryText={t`Remove`}
        accessoryTextColor={Color.success}
        accessoryTextWeight={FontWeight.medium}
        onAccessoryTextPress={props.onRemovePress}
        {...getAvatarProps(props.space.iconUrl, props.space.name)}
    />
};

export default RestrictedSpaceItem;
