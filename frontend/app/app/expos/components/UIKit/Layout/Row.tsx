import React, { FunctionComponent } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { HorizontalOffset, ItemWidth } from '../../../theme.style';
import { isMobilePlatform } from '../../../libs/platform';
import defaultTo from 'lodash/defaultTo';

type RowProps = {
    padding?: HorizontalOffset,
    padded?: boolean,
    wrap?: boolean,
    desktopWidth?: ItemWidth,
    desktopCenterItem?: boolean,
} & ViewProps

const Row: FunctionComponent<RowProps> = (props) => {
    const offset = props.padded ? HorizontalOffset.default : (!props.padding ? HorizontalOffset.none : props.padding);
    const desktopWidth = defaultTo(props.desktopWidth, ItemWidth.fill);
    const desktopCenterItem = defaultTo(props.desktopCenterItem, false);
    const desktopMaxWidth = (isMobilePlatform || desktopWidth === ItemWidth.fill || desktopWidth === ItemWidth.fit) ?
        {} :
        {
            width: '100%',
            maxWidth: desktopWidth.valueOf(),
        };
    const desktopAlignSelf = (isMobilePlatform || !desktopCenterItem) ?
        {} :
        {
            alignSelf: 'center',
        } as any;

    return <View {...props} style={[
            desktopMaxWidth,
            styles.view,
            props.style,
            desktopAlignSelf,
            props.wrap ? styles.wrap : {}, {
                paddingHorizontal: offset.valueOf(),
                paddingVertical: offset.valueOf(),
            }]}>
        {props.children}
    </View>
};

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrap: {
        flexWrap: 'wrap',
        marginVertical: 10,
    },
});

export default Row;
