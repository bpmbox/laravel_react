import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';

type WebViewProps = {
    sourceUri?: string,
    sourceHtml?: string,
} & ViewProps;

const WebView: FunctionComponent<WebViewProps> = (props) => {
    if (typeof(props.sourceUri) === 'undefined' && typeof(props.sourceHtml) === 'undefined') {
        // Silently fail. May add a placeholder view in the future.
        return <></>;
    }

    const sourceUri = props.sourceUri ? props.sourceUri : getHtmlSrc(props.sourceHtml);

    return <iframe
        src={sourceUri}
        style={{border: 0, width: '100%', height: '100%'}}
        title='Embed' aria-hidden={true} />;
};

const getHtmlSrc = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const iframe = tmp.getElementsByTagName('iframe')[0];
    return iframe.src;
}

export default WebView;
