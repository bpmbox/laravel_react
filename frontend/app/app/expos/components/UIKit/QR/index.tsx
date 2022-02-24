import React, { FunctionComponent } from 'react';
import QRCode from 'react-qr-code';
import {View} from 'react-native';

type QRProps = {
    value: string,
    size: number,
};

const QR: FunctionComponent<QRProps> = (props) => {
    if (Array.isArray(props.value)) {
        return <View/>
    }
    return <QRCode value={props.value} size={props.size} />;
};

export default QR;
