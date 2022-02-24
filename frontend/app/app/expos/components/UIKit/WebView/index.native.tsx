import React, { FunctionComponent } from 'react';
import { WebView as ReactNativeWebView } from 'react-native-webview';
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
    
    const source = props.sourceUri ?
        { uri: props.sourceUri } :
        { html: props.sourceHtml };
    return <ReactNativeWebView
        originWhitelist={['*']}
        source={source}
        style={{ width: '100%', height: '100%', borderWidth: 0 }} />
};

export default WebView;
