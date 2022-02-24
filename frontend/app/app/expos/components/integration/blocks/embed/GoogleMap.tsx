import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import WebView from '../../../../components/UIKit/items/WebView';
import omit from 'lodash/omit';
import { ItemHeight } from '../../../../theme.style';
import get from 'lodash/get';

type GoogleMapProps = {
    value: string;
    attrs?: {
        fullscreen?: boolean;
        tall?: boolean;
    };
} & ItemProps;

const GoogleMap: FunctionComponent<GoogleMapProps> = (props) => {
    const height = get(props, 'attrs.fullscreen', false) ? ItemHeight.fill : get(props, 'attrs.tall', false) ? ItemHeight.embedlarge : ItemHeight.embedsmall;
    const sourceHtml = `<iframe src="${props.value}" width="100%" height="100%" />`;
    return <WebView
        sourceHtml={sourceHtml}
        height={height}
        {...omit(props, 'value')}/>
};

export default GoogleMap;
