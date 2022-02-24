import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { FontSize, FontWeight, ItemHeight, IconSize } from '../../../theme.style';
import { IconId } from '../../../assets/native/svg-icons';
import omit from 'lodash/omit';

type ModalCloseHeaderProps = {
    title?: string,
    showClose?: boolean,
    onClosePress?: () => any,
} & ItemProps;

const ModalCloseHeader: FunctionComponent<ModalCloseHeaderProps> = (props) => {
    return <>
        <Item
            text={props.title}
            height={ItemHeight.large}
            textNumberOfLines={1}
            textSize={FontSize.h3}
            textWeight={FontWeight.bold}
            rightIconId={props.showClose ? IconId.feather_close_stroke_accent4 : null}
            rightIconSize={IconSize.normal}
            onRightIconPress={props.showClose ? props.onClosePress : null}
            {...omit(props, 'title', 'showClose', 'onClosePress')} />
        </>
};

export default ModalCloseHeader;
