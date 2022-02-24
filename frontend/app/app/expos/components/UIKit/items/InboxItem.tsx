import React, { FunctionComponent } from 'react';
import { ItemHeight, Color, HorizontalOffset, FontWeight, FontSize, BackgroundType } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { isMobilePlatform } from '../../../libs/platform';

type InboxItemProps = {
    name: string;
    snippet: string;
    date?: Date;
    unreadCount?: number;
    avatarUrl?: string;
    selected?: boolean;
} & ItemProps;

const InboxItem: FunctionComponent<InboxItemProps> = props => {
    const unread = !!props.unreadCount;
    const textWeight = unread ? FontWeight.medium : FontWeight.normal;

    return (
        <Item
            text={props.name}
            onPress={props.onPress}
            touchable={props.onPress !== undefined}
            textSize={FontSize.normal}
            textWeight={textWeight}
            numberOfLines={1}
            textColor={Color.black}
            height={ItemHeight.default}
            pressedBackgroundType={isMobilePlatform ? BackgroundType.full : BackgroundType.extraWideButton}
            backgroundType={props.selected ? BackgroundType.extraWideButton : BackgroundType.none}
            leftTextOffset={HorizontalOffset.default}
            badgeCount={props.unreadCount}
        />
    );
};

export default InboxItem;
