import React from 'react';
import { FunctionComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import { IconId } from '../../../assets/native/svg-icons';
import theme, { Color, FontSize, FontWeight, FontWeightType } from '../../../theme.style';
import {
    IconSize,
    VerticalOffset,
} from '../../../theme.style';

type TagXProps = {
    disabled?: boolean;
    onPress?: () => void;
    onPressX?: () => void;
    title: string;
};

const TagX: FunctionComponent<TagXProps> = props => {
    return (
        <View style={styles.tagX}>
            <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
                <Text style={styles.tagXText}>{props.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.tagXX}
                onPress={props.onPressX}
                disabled={props.disabled}>
                <Icon svgIconId={IconId.system_x} iconSize={IconSize.xxsmall} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tagX: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.accent2.valueOf(),
        borderRadius: theme.rem,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: VerticalOffset.medium.valueOf(),
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    tagXText: {
        color: Color.black.valueOf(),
        fontSize: FontSize.small.valueOf(),
        fontWeight: FontWeight.bold.valueOf() as FontWeightType,
    },

    tagXX: {
        marginStart: 8,
        justifyContent: 'center',
    },
});

export default TagX;
