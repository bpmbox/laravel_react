import React from 'react';
import { FunctionComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme, { Color, FontSize, FontWeight, FontWeightType } from '../../../theme.style';

type TagProps = {
    disabled?: boolean;
    onPress?: () => void;
    title: string;
};

const Tag: FunctionComponent<TagProps> = props => {
    if (props.onPress) {
        return (
            <TouchableOpacity
                style={styles.tag}
                onPress={props.onPress}
                disabled={props.disabled}>
                <Text style={styles.tagText}>{props.title}</Text>
            </TouchableOpacity>
        );
    } else {
        return (
            <View style={styles.tag}>
                <Text style={styles.tagText}>{props.title}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    tag: {
        borderRadius: theme.radius,
        backgroundColor: Color.accent2.valueOf(),
        marginEnd: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    tagText: {
        color: Color.black.valueOf(),
        fontSize: FontSize.small.valueOf(),
        fontWeight: FontWeight.bold.valueOf() as FontWeightType,
    },
});

export default Tag;
