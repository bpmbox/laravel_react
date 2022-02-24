import React, { FunctionComponent } from 'react';
import {
    ItemHeight,
    Color,
    HorizontalOffset,
    IconSize,
    IconType,
    FontWeight,
    FontSize,
    IconBackgroundType,
    BackgroundType,
} from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { formatChatTime } from '../../../libs/datetime';
import { useTranslation } from 'react-i18next';
import { isMobilePlatform } from '../../../libs/platform';
import { getAvatarProps } from '../../../libs/ui-utils';

type InboxItemProps = {
    name: string;
    snippet: string;
    date?: Date;
    unreadCount?: number;
    avatarUrl?: string;
    selected?: boolean;
} & ItemProps;

const InboxItem: FunctionComponent<InboxItemProps> = props => {
    const { t } = useTranslation('InboxItem');

    const unread = !!props.unreadCount;
    const subtitleColor = unread ? Color.black : Color.accent5;
    const textWeight = unread ? FontWeight.semibold : FontWeight.medium;
    const subtextWeight = unread ? FontWeight.semibold : FontWeight.normal;

    const subtext = (props.date && props.snippet) ?
        t('{{date}} · {{snippet}}', { date: formatChatTime(props.date), snippet: props.snippet }) :
        '\xa0'; // non-breaking space so subtext will render with nonzero size

    return (
        <Item
            text={props.name}
            subText={subtext}
            onPress={props.onPress}
            touchable={props.onPress !== undefined}
            textSize={FontSize.normal}
            subTextSize={FontSize.small}
            subTextNumberOfLines={1}
            textWeight={textWeight}
            subTextWeight={subtextWeight}
            textColor={Color.black}
            subTextColor={subtitleColor}
            height={ItemHeight.large}
            pressedBackgroundType={isMobilePlatform ? BackgroundType.full : BackgroundType.extraWideButton}
            backgroundType={props.selected ? BackgroundType.extraWideButton : BackgroundType.none}
            leftTextOffset={HorizontalOffset.xxxxlarge}
            leftIconSize={IconSize.medium}
            leftIconType={IconType.round}
            leftIconBackgroundType={IconBackgroundType.plainLight}
            badgeCount={props.unreadCount}
            {...getAvatarProps(props.avatarUrl, props.name, props.leftIconInitial)}
        />
    );
};

export default InboxItem;
