import React, { FunctionComponent } from 'react';
import { SvgUri } from 'react-native-svg';
import { Image } from 'react-native';


const RemoteImage: FunctionComponent<NSRemoteImage.RemoteImageProps> = (props) => {
    const { uri, style } = props;

    if (uri.split('.').pop().toLowerCase() === 'svg') {
        return <SvgUri width={style.width} height={style.height} style={style} uri={uri} />;
    }
    return <Image style={style} source={{uri}} />;
};

export default RemoteImage;
