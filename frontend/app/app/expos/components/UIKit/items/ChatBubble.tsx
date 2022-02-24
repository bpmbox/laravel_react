import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import Item from '../Item';
import { formatChatTime } from '../../../libs/datetime';
import { useTranslation } from 'react-i18next';
import {
    FontSize,
    FontWeight,
    ItemHeight,
    VerticalOffset,
    HorizontalOffset,
    IconSize,
    IconType,
    IconBackgroundType,
    IconPosition,
    ImageAspectRatio,
    Color,
    BackgroundType,
} from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';

type ChatBubbleProps = {
    sender: any; // GiftedChat user object
    isMe: boolean;
    message?: string;
    image?: string; // a URL
    date: Date;
    includeHeader?: boolean;
};

const ChatBubble: FunctionComponent<ChatBubbleProps> = props => {
    const { t } = useTranslation('ChatBubble');

    if (typeof props.includeHeader !== 'undefined' && !props.includeHeader) {
        // if the same user sends several messages in a row in a short time period,
        // we show the user name / avatar header on the first message only and omit
        // it from subsequent messages by passing props.includeHeader === false
        return (
            <Item
                textSelectable
                text={props.message}
                imageUrl={props.image}
                imageAspectRatio={ImageAspectRatio.original}
                imageResizeMode="cover"
                pressedBackgroundType={BackgroundType.none}
                backgroundType={BackgroundType.none}
                backgroundColor={Color.transparent}
                height={ItemHeight.flex}
                textNumberOfLines={0}
                leftTextOffset={HorizontalOffset.xxxlarge}
            />
        );
    }

    let senderName = '';
    if (props.isMe) {
        senderName = t('Me');
    } else if (props.sender.isActive) {
        senderName = props.sender.name;
    } else {
        senderName = t('{{senderName}} (deactivated)', {
            senderName: props.sender.name,
        });
    }
    const title = t('{{senderName}} · {{messageDate}}', {
        senderName: senderName,
        messageDate: formatChatTime(props.date),
    });

    // item containing the message text and user avatar
    const textItem = (
        <Item
            textSelectable
            text={title}
            textSize={FontSize.small}
            textWeight={FontWeight.semibold}
            subText={props.message}
            height={ItemHeight.flex}
            leftTextOffset={HorizontalOffset.xxxlarge}
            leftIconSize={IconSize.small}
            leftIconType={IconType.round}
            leftIconBackgroundType={IconBackgroundType.plainLight}
            leftIconPosition={IconPosition.topLeft}
            topItemOffset={VerticalOffset.small}
            bottomItemOffset={VerticalOffset.small}
            {...getAvatarProps(props.sender.avatar, props.sender.name)}
        />
    );

    if (props.image) {
        // item containing the image sent by the user;
        // needs to be a separate item from the text item because the left
        // avatar icon and the large central image overlap awkwardly due to
        // absolute positioning in Item class styles
        const imageItem = (
            <Item
                imageUrl={props.image}
                imageAspectRatio={ImageAspectRatio.original}
                imageResizeMode="cover"
                pressedBackgroundType={BackgroundType.none}
                backgroundType={BackgroundType.none}
                backgroundColor={Color.transparent}
                height={ItemHeight.flex}
                leftTextOffset={HorizontalOffset.xxxlarge}
                topItemOffset={VerticalOffset.small}
                bottomItemOffset={VerticalOffset.small}
            />
        );

        return (
            <View style={styles.imageItemContainer}>
                {textItem}
                {imageItem}
            </View>
        );
    } else {
        return textItem;
    }
};

const styles = StyleSheet.create({
    imageItemContainer: {
        flexDirection: 'column',
    },
});

export default ChatBubble;
