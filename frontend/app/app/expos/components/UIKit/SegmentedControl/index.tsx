import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FunctionComponent } from 'react';
import theme, { ItemHeight, Color, ItemWidth } from '../../../theme.style';
import Text from '../items/Text';

type SegmentedControlBarProps = {
    titles: Array<string>,
    selectedIndex?: number,
    externalLink?: string,
    onSelectionChange?: (index: number) => void
    onExternalLinkClick?: () => void
};

const SegmentedControlBar: FunctionComponent<SegmentedControlBarProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(props.selectedIndex || 0)

    return <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
            <View style={styles.narrowContainer}>
                { props.titles.map((item, index) => {
                    const selected = index === selectedIndex
                    return <TouchableOpacity onPress={() => {
                        setSelectedIndex(index);
                        props.onSelectionChange && props.onSelectionChange(index);
                    }} activeOpacity={0.6} key={index} style={[
                            styles.item,
                            selected ? styles.selected : styles.deselected
                        ]}>
                        <Text text={item} center semibold={selected} />
                    </TouchableOpacity>
                })}
                { props.externalLink && props.onExternalLinkClick &&
                    <TouchableOpacity onPress={props.onExternalLinkClick}
                        activeOpacity={0.6}
                        key={'externalLink'} style={styles.externalLinkContainer}>
                        <Text text={props.externalLink} success />
                    </TouchableOpacity>
                }
            </View>
        </View>
    </View>
};

type SegmentedControlProps = {
    items: Array<{title: string, page: any}>,
    selectedIndex?: number,
    externalLink?: string,
    onExternalLinkClick?: () => void,
    padded?: boolean,
};

const SegmentedControl: FunctionComponent<SegmentedControlProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(props.selectedIndex || 0)

    return <View style={styles.topContainer}>
        <View style={[styles.segmentedContainer, props.padded ? styles.padded : {}]}>
            <SegmentedControlBar
                titles={props.items.map((item) => item.title)}
                onSelectionChange={setSelectedIndex}
                externalLink={props.externalLink}
                onExternalLinkClick={props.onExternalLinkClick}
            />
        </View>
        <View style={styles.pageContainer}>
            {props.items[selectedIndex].page}
        </View>
    </View>
};

const styles = StyleSheet.create({
    topContainer: {
        flex: 1
    },
    padded: {
        paddingHorizontal: theme.horizontalPadding,
    },
    pageContainer: {
        flex: 1
    },
    segmentedContainer: {
        height: ItemHeight.default.valueOf(),
        flexGrow: 0,
    },
    itemContainer: {
        height: ItemHeight.default.valueOf(),
        flex: 1,
    },
    itemRow: {
        marginHorizontal: 16,
        flexDirection: 'row',
        borderBottomColor: Color.accent3.valueOf(),
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    item: {
        height: ItemHeight.default.valueOf(),
        justifyContent: 'center',
        borderBottomWidth: 3,
    },
    selected: {
        borderBottomColor: Color.black.valueOf(),
        
    },
    deselected: {
        borderBottomColor: Color.white.valueOf(),
        backgroundColor: Color.white.valueOf()
    },
    narrowContainer : {
        flexDirection: 'row',
        width: '100%',
        maxWidth: ItemWidth.wide.valueOf() - theme.horizontalPadding,
    },
    externalLinkContainer: {
        height: ItemHeight.default.valueOf(),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    externalLink: {
        color: Color.success.valueOf(),
        justifyContent: 'center',
    }
})

export default SegmentedControl;
