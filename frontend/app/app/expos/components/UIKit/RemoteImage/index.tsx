import { Image } from 'react-native';
import React, { FunctionComponent } from 'react';

const RemoteImage: FunctionComponent<NSRemoteImage.RemoteImageProps> = (props) => {
    const { uri, style } = props;
    return <Image style={style} source={{uri}} />;
};

export default RemoteImage;
