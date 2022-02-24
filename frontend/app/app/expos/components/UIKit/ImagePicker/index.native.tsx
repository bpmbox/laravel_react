import React, { useState, FunctionComponent } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import RnImagePicker, { ImagePickerOptions } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import defaultTo from 'lodash/defaultTo';
import { ButtonType, ButtonSize, Color, ItemHeight } from '../../../theme.style';
import messageService from '../../../services/message';
import commonService from '../../../services/common';
import Spacer from '../items/Spacer';
import Row from '../Layout/Row';
import Button from '../Button';
import { ImagePreview } from './ImagePreview';
import { resizeImage, resizeImageSupported } from '../../../libs/image-resize';
import { RESIZE_MAX_SIZE } from './constants';

const ImagePicker: FunctionComponent<NSImagePicker.ImagePickerProps> = props => {
    const { t } = useTranslation('ImagePicker');
    const {
        allowSelection,
        buttonTitle: buttonTitleProp,
        customComponent,
        disabled,
        imageUrl,
        includeButton,
        integration,
        onError,
        onUploaded,
        profile,
        round,
        setIsUploading: setIsUploadingProp,
        space,
    } = props;
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string>(imageUrl || '');
    const setIsUploadingFunc = setIsUploadingProp || setIsUploading;

    const options = {
        title: '',
        takePhotoButtonTitle: t`Take Photo`,
        chooseFromLibraryButtonTitle: t`Choose from Library`,
        tintColor: Color.black.valueOf(),
        allowsEditing: true,
        storageOptions: {
            skipBackup: true,
            path: 'images',
            cameraRoll: true,
            waitUntilSaved: true,
        },
    } as ImagePickerOptions;

    const fixImageFileUri = (uri: string) => {
        if (Platform.OS === 'android' && !uri.startsWith('file:')) {
            uri = 'file://' + uri;
        }
        return uri;
    };

    const showImagePicker = () => {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        RnImagePicker.showImagePicker(options, async response => {
            setIsUploadingFunc(false);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error:', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button:', response.customButton);
            } else {
                let fileUri = response.uri;

                // 'path' property can be better for loading image because it contains
                // the local file name rather than an obfuscated URL
                if (response.path) {
                    fileUri = fixImageFileUri(response.path);
                }

                let fileSize = response && response.data ? response.data.length : 0;
                if (resizeImageSupported(fileUri) && fileSize > commonService.getMaxUploadFileSize()) {
                    // try to resize the image
                    try {
                        const resizeResponse = await resizeImage(fileUri, RESIZE_MAX_SIZE, RESIZE_MAX_SIZE);
                        if (resizeResponse) {
                            fileUri = fixImageFileUri(resizeResponse.path);
                            fileSize = resizeResponse.size;
                        }
                    } catch (err) {
                        console.warn('ImagePicker', 'Unable to resize image:', err);
                    }
                }

                // if image is still too large, display error message
                if (fileSize > commonService.getMaxUploadFileSize()) {
                    const msg = t`Image file is too large. Please try with an image that is less than 3 MB in size.`;
                    if (onError) {
                        onError(new Error(msg));
                    } else {
                        messageService.sendError(msg);
                    }
                    return;
                }

                try {
                    setIsUploadingFunc(true);
                    const imgUrl = await commonService.uploadImage(fileUri);
                    setPreviewImageUrl(fileUri);
                    onUploaded && onUploaded(imgUrl);
                    setIsUploadingFunc(false);
                } catch (err) {
                    onError && onError(err);
                    setIsUploadingFunc(false);
                }
            }
        });
    };

    const buttonTitle = defaultTo(buttonTitleProp, t`Set Photo`);
    const previewUrl = imageUrl || previewImageUrl;

    let avatar = (
        <ImagePreview
            previewUrl={previewUrl}
            isUploading={isUploading}
            round={round}
            profile={profile}
            space={space}
            integration={integration}
            includeButton={includeButton}
            buttonTitle={buttonTitle}
        />
    );

    if (!allowSelection) {
        return <Row padded>{avatar}</Row>;
    }

    // allow a custom component UI for the image picker,
    // rather than the image preview and button
    if (customComponent) {
        return (
            <TouchableOpacity onPress={showImagePicker} disabled={disabled || isUploading} activeOpacity={0.9}>
                {customComponent}
            </TouchableOpacity>
        );
    }

    return (
        <Row padded>
            <TouchableOpacity onPress={showImagePicker} activeOpacity={0.9}>
                {avatar}
            </TouchableOpacity>

            {includeButton && (
                <>
                    <Spacer horizontal height={ItemHeight.xsmall} />
                    <View>
                        <Button
                            onPress={showImagePicker}
                            title={buttonTitle}
                            type={ButtonType.success}
                            size={ButtonSize.small}
                        />
                    </View>
                </>
            )}
        </Row>
    );
};

export default ImagePicker;
