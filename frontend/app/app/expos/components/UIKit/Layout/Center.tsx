import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

const Center: FunctionComponent<ViewProps> = props => (
    <View {...props} style={[styles.view, props.style]}>
        {props.children}
    </View>
);

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Center;
