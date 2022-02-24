import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';

type WebViewProps = {
    sourceUri?: string,
    sourceHtml?: string,
} & ItemProps;

const WebView: FunctionComponent<WebViewProps> = (props) => {
    const source = props.sourceUri ?
        { webViewUrl: props.sourceUri } :
        { webViewHtml: props.sourceHtml };
    return <Item
        {...source}
        {...omit(props, 'sourceUri', 'sourceHtml')}
    />
};

export default WebView;
