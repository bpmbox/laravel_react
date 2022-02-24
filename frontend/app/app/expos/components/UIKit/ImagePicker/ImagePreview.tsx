import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import theme, { IconSize, Color } from '../../../theme.style';
import Spinner from '../Spinner';
import Icon from '../Icon';
import Text from '../items/Text';
import React from 'react';
import { IconId } from '../../../assets/native/svg-icons';
import Center from '../Layout/Center';
import RemoteImage from '../RemoteImage';

type ImagePreviewProps = {
    previewUrl?: string;
    round?: boolean;
    isUploading?: boolean;
    isDragOver?: boolean;
    profile?: boolean;
    space?: boolean;
    integration?: boolean;
    includeButton?: boolean;
    buttonTitle?: string;
    allowSelection?: boolean;
}

export const ImagePreview = (props: ImagePreviewProps) => {
    const { t } = useTranslation('ImagePreview');

    const style = StyleSheet.create({
        image: {
            borderRadius: theme.radius,
            width: 100,
            height: 100,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Color.accent3.valueOf(),
            backgroundColor: Color.accent2.valueOf(),
        },
        container: {
            borderRadius: theme.radius,
            width: 100,
            height: 100,
            backgroundColor: Color.accent2.valueOf(),
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Color.accent3.valueOf(),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    if (props.allowSelection && props.isDragOver) {
        return (
            <Center style={style.container}>
                <Text text={t`Drop your image`} mini light center />
            </Center>
        );
    }

    if (props.isUploading) {
        return (
            <Center style={style.container}>
                <Spinner small />
            </Center>
        );
    }

    if (props.previewUrl) {
        return <RemoteImage uri={props.previewUrl} style={style.image} />;
    }

    return (
        <View style={style.container}>
            <Icon svgIconId={IconId.feather_camera_filled_accent4} iconSize={IconSize.normal} />
        </View>
    );
};
