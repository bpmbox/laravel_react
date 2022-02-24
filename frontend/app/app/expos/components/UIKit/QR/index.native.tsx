import React, { FunctionComponent } from 'react';
import QRCode from 'react-native-qrcode-svg';

type QRProps = {
    value: string,
    size: number,
};

const QR: FunctionComponent<QRProps> = (props) => {
    return <QRCode value={props.value} size={props.size} />;
};

export default QR;
