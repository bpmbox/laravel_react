import React, { FunctionComponent } from 'react';
import { ItemHeight, Color, FontSize, BackgroundType, HorizontalOffset, VerticalOffset, ToastType } from '../../../theme.style';
import Item from '../Item';

type ToastProps = {
    text: string,
    type?: ToastType,
};

const Toast: FunctionComponent<ToastProps> = (props) => {
    return <Item
        text={props.text}
        textNumberOfLines={0}
        centerText
        textColor={Color.white}
        textSize={FontSize.small}
        height={ItemHeight.flex}
        topTextOffset={VerticalOffset.xlarge}
        leftTextOffset={HorizontalOffset.large}
        rightTextOffset={HorizontalOffset.large}
        bottomTextOffset={VerticalOffset.xlarge}
        backgroundType={BackgroundType.wideButton}
        backgroundColor={Color.accent8}
    />
};

export default Toast;
