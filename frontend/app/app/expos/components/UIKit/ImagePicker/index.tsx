import defaultTo from 'lodash/defaultTo';
import React, { SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { resizeImage, resizeImageSupported } from '../../../libs/image-resize';
import { isMobilePlatform } from '../../../libs/platform';
import commonService from '../../../services/common';
import messageService from '../../../services/message';
import { ButtonType, ButtonSize, ItemHeight } from '../../../theme.style';
import { ImagePreview } from './ImagePreview';
import Button from '../items/Button';
import Spacer from '../items/Spacer';
import Row from '../Layout/Row';
import { RESIZE_MAX_SIZE } from './constants';

const ImagePicker: React.FunctionComponent<NSImagePicker.ImagePickerProps> = props => {
    const { t } = useTranslation('ImagePicker');
    const {
        allowSelection,
        buttonTitle: buttonTitleProp,
        customComponent,
        desktopWidth,
        desktopCenterItem,
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

    const [previewImageUrl, setPreviewImageUrl] = useState(imageUrl);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const hiddenInputObj = useRef<any>(null);
    const setIsUploadingFunc = setIsUploadingProp || setIsUploading;

    const dragEnterHandler = (evt: React.DragEvent<HTMLDivElement>): void => {
        if (!allowSelection) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        setIsDragOver(true);
    };

    const dragLeaveHandler = (evt: React.DragEvent<HTMLDivElement>): void => {
        if (!allowSelection) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        setIsDragOver(false);
    };

    /**
     * Checks whether the given image file is too large to be uploaded.
     * If so, resizes it and returns the resized image as a data blob.
     * If not, returns the original file.
     */
    const checkResizeImage = async (file: File): Promise<File | Blob> => {
        const fileSize = file.size || 0;
        if (resizeImageSupported(file.name) && fileSize > commonService.getMaxUploadFileSize()) {
            // try to resize the image
            try {
                const resizeResponse = await resizeImage(file, RESIZE_MAX_SIZE, RESIZE_MAX_SIZE);
                if (resizeResponse) {
                    return resizeResponse.data as Blob;
                }
            } catch (err) {
                console.warn('ImagePicker', 'Unable to resize image:', err);
            }
        }

        return file;
    };

    const uploadToS3 = async (file: File) => {
        if (!allowSelection) {
            return;
        }

        setIsUploadingFunc(true);

        // maybe resize the image
        const possiblyResized = await checkResizeImage(file);

        // if image is still too large, display error message
        if (file.size > commonService.getMaxUploadFileSize()) {
            const msg = t`Image file is too large. Please try with an image that is less than 3 MB in size.`;
            if (onError) {
                onError(new Error(msg));
            } else {
                messageService.sendError(msg);
            }
            return;
        }

        // Get the uploadUrl Data
        try {
            const imgUrl = await commonService.uploadImage(possiblyResized);
            setPreviewImageUrl(imgUrl);
            setIsUploading(false);
            return imgUrl;
        } catch (err) {
            if (onError) {
                onError(err);
            } else {
                console.warn('Error uploading image:', err);
                messageService.sendError(t`Error uploading image.`);
            }
            setIsUploading(false);
        }
    };

    const dropHandler = async (evt: React.DragEvent<HTMLDivElement>): Promise<void> => {
        if (!allowSelection) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        setIsDragOver(false);

        const dt = evt.dataTransfer;
        if (dt && dt.files && onUploaded) {
            if (dt.files[0].type.startsWith('image/')) {
                const file = dt.files[0];
                const imgUrl = await uploadToS3(file);
                onUploaded(imgUrl);
            }
        }
    };

    const handleFileSelected = async (evt: SyntheticEvent<HTMLInputElement>): Promise<void> => {
        if (!allowSelection) {
            return;
        }

        evt.preventDefault();

        const fileInput = evt.target as HTMLInputElement;
        if (fileInput) {
            const selectedFile = (fileInput.files && fileInput.files[0]) || null;
            if (selectedFile) {
                const imgUrl = await uploadToS3(selectedFile);
                onUploaded && onUploaded(imgUrl);
            }
        }
    };

    const buttonTitle = defaultTo(buttonTitleProp, t`Set Photo`);
    const previewUrl = imageUrl || previewImageUrl;

    let avatar = (
        <ImagePreview
            allowSelection={allowSelection}
            previewUrl={previewUrl}
            isUploading={isUploading}
            isDragOver={isDragOver}
            round={round}
            profile={profile}
            space={space}
            integration={integration}
            includeButton={includeButton}
            buttonTitle={buttonTitle}
        />
    );

    let extras = {};
    if (!isMobilePlatform) {
        if (desktopWidth) {
            extras = {
                desktopWidth: desktopWidth,
                ...extras,
            };
        }
        if (desktopCenterItem) {
            extras = {
                desktopCenterItem: desktopCenterItem,
                ...extras,
            };
        }
    }

    if (!allowSelection) {
        return (
            <Row {...extras} padded>
                {avatar}
            </Row>
        );
    }

    // Hidden file input element to handle file uploads
    const hiddenInput = (
        <input
            ref={hiddenInputObj}
            style={{
                display: customComponent ? 'none' : 'inline',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 2,
                opacity: 0,
                cursor: 'pointer',
            }}
            type="file"
            onChange={handleFileSelected}
            accept="image/*"
            title={t`Click to upload a new image`}
            disabled={disabled || !allowSelection}
        />
    );

    // cause a click event on the hidden input to pop up the file chooser
    const simulateInputClick = () => {
        if (hiddenInputObj.current) {
            hiddenInputObj.current.click();
        }
    };

    // allow a custom component UI for the image picker,
    // rather than the image preview and button
    if (customComponent) {
        return (
            <TouchableOpacity onPress={simulateInputClick} disabled={disabled || isUploading} activeOpacity={0.9}>
                <View>
                    {customComponent}
                    {hiddenInput}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <Row padded {...extras}>
            <div
                style={{
                    position: 'relative',
                    zIndex: 3,
                }}
                onDragEnter={dragEnterHandler}
                onDragLeave={dragLeaveHandler}
                onDrop={dropHandler}>
                {hiddenInput}
                {avatar}
            </div>

            {includeButton && (
                <>
                    <Spacer horizontal height={ItemHeight.xsmall} />
                    <View>
                        {hiddenInput}
                        <Button
                            text={buttonTitle}
                            type={ButtonType.success}
                            size={ButtonSize.small}
                            desktopFitWidth={true}
                        />
                    </View>
                </>
            )}
        </Row>
    );
};

export default ImagePicker;
