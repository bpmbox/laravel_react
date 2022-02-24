import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

const Component: FunctionComponent<ViewProps> = props => (
    <View {...props} style={[styles.view, props.style]}>
        {props.children}
    </View>
);

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default Component;
