import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';
import { ItemHeight } from '../../../theme.style';

type QRProps = {
    value: string
} & ItemProps;

const QR: FunctionComponent<QRProps> = (props) => {
    return <Item
        height={ItemHeight.flex}
        qrValue={props.value}
        desktopWidth={props.desktopWidth}
        desktopCenterItem={props.desktopCenterItem}
        {...omit(props, 'narrow', 'small', 'fit')} />
};

export default QR;
