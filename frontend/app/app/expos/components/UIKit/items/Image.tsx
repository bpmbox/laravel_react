import React, { FunctionComponent } from 'react';
import { ItemHeight, ImageAspectRatio } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';

type ImageProps = {
    source: string,
    aspectRatio?: ImageAspectRatio,
    zoomEnabled?: boolean,
} & ItemProps;

const Image: FunctionComponent<ImageProps> = (props) => {
    return <Item
        height={ItemHeight.flex}
        imageUrl={props.source}
        imageAspectRatio={props.aspectRatio}
        {...omit(props, 'source', 'aspectRatio')}
    />
};

export default Image;
