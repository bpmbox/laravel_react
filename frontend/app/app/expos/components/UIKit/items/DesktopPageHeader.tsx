import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import {
    ItemHeight,
    FontSize,
    FontWeight,
    HorizontalOffset,
    IconSize,
    IconType,
    IconBackgroundType,
} from '../../../theme.style';
import omit from 'lodash/omit';
import { getAvatarProps } from '../../../libs/ui-utils';

type DesktopPageHeaderProps = {
    title?: string;
    iconUrl?: string;
    initial?: string;
    showAvatar?: boolean;
} & ItemProps;

const DesktopPageHeader: FunctionComponent<DesktopPageHeaderProps> = props => {
    let iconProps = {};
    let extras = {};
    if (props.showAvatar) {
        iconProps = getAvatarProps(props.iconUrl, props.title, props.initial);
        extras = {
            leftTextOffset: HorizontalOffset.xxxlarge,
            leftIconSize: IconSize.small,
            leftIconType: IconType.round,
            leftIconBackgroundType: IconBackgroundType.plainLight,
        };
    }

    return (
        <Item
            text={props.title}
            height={ItemHeight.large}
            textNumberOfLines={1}
            textSize={FontSize.large}
            textWeight={FontWeight.bold}
            {...iconProps}
            {...extras}
            {...omit(props, 'title', 'iconUrl', 'initial', 'showAvatar')}
        />
    );
};

export default DesktopPageHeader;
