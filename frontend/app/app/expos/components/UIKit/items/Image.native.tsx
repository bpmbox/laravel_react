import React, { FunctionComponent, useState } from 'react';
import { ItemHeight, ImageAspectRatio } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { Modal } from 'react-native';
import {default as _ImageViewer} from 'react-native-image-zoom-viewer';
import defaultTo from 'lodash/defaultTo';

export type ImageProps = {
    source: string,
    aspectRatio?: ImageAspectRatio,
    zoomEnabled?: boolean,
} & ItemProps;

const Image: FunctionComponent<ImageProps> = (props) => {

    const [isImageViewerDisplayed, setIsImageViewerDisplayed] = useState<boolean>(false);

    const showImageViewer = () => {
        setIsImageViewerDisplayed(true)
    }

    const closeImageViewer = () => {
        setIsImageViewerDisplayed(false)
    }

    const didTapOnPress = () => {
        if (isImageViewerDisplayed) {
            closeImageViewer()
        } else {
            showImageViewer()
        }
    }

    const zoomEnabled = defaultTo(props.zoomEnabled, true);

    return (isImageViewerDisplayed ?
        <Modal visible transparent>
            <_ImageViewer imageUrls={[{'url': props.source}]} onSwipeDown={closeImageViewer} enableSwipeDown={true} />
        </Modal> : 
        <Item height={ItemHeight.flex}
            imageUrl={props.source}
            imageAspectRatio={props.aspectRatio}
            touchable={zoomEnabled}
            onPress={zoomEnabled ? didTapOnPress : null}
            {...props}/>
    )
};

export default Image;