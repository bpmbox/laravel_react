import React, { FunctionComponent } from 'react';
import { ItemHeight, BackgroundType, HorizontalOffset, VerticalOffset, IconSize, IconType, IconPosition, FontSize, CalloutType } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { IconId } from '../../../assets/native/svg-icons';
import defaultTo from 'lodash/defaultTo';
import omit from 'lodash/omit';

type CalloutProps = {
    type?: CalloutType,
    mini?: boolean,
    iconUrl?: boolean,
} & ItemProps;

const Callout: FunctionComponent<CalloutProps> = (props) => {
    const textSize = defaultTo(props.mini, false) ? FontSize.small : FontSize.normal;
    let extras = {};
    if (props.iconUrl) {
        extras = {
            leftIconImageUrl: props.iconUrl,
        };
    } else if (props.type) {
        extras = {
            leftIconId: getIcon(defaultTo(props.type, CalloutType.info)),
        };
    }
    return <Item
        text={props.text}
        textSelectable={props.textSelectable}
        textNumberOfLines={0}
        textSize={textSize}
        backgroundType={BackgroundType.narrow}
        leftTextOffset={HorizontalOffset.xxxlarge}
        rightTextOffset={HorizontalOffset.large}
        topTextOffset={VerticalOffset.large}
        bottomTextOffset={VerticalOffset.large}
        height={ItemHeight.flex}
        leftIconSize={IconSize.xsmall}
        leftIconType={IconType.rounded}
        leftIconPosition={IconPosition.topLeftOffset}
        markdown
        {...extras}
        {...omit(props, 'info', 'success', 'warning', 'error', 'mini')} />
};

const getIcon = (type: CalloutType): IconId => {
    switch (type) {
        case CalloutType.info: return IconId.feather_info_filled_success;
        case CalloutType.success: return IconId.feather_check_filled_green;
        case CalloutType.warning: return IconId.feather_warning_filled_warning;
        case CalloutType.error: return IconId.feather_error_filled_error;
    }
}

export default Callout;
