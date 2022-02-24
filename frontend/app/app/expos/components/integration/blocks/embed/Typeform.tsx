import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import WebView from '../../../../components/UIKit/items/WebView';
import omit from 'lodash/omit';
import { ItemHeight } from '../../../../theme.style';
import get from 'lodash/get';

type TypeformProps = {
    value: string;
    attrs?: {
        fullscreen?: boolean;
        tall?: boolean;
    };
} & ItemProps;

const Typeform: FunctionComponent<TypeformProps> = (props) => {
    const height = get(props, 'attrs.fullscreen', false) ? ItemHeight.fill : get(props, 'attrs.tall', false) ? ItemHeight.embedlarge : ItemHeight.embedsmall;
    return <WebView
        sourceUri={props.value}
        height={height}
        {...omit(props, 'value')}/>
};

export default Typeform;
