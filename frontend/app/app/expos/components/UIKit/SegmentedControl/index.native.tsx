import React, { useState, FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import theme, { ItemHeight, Color } from '../../../theme.style';
import Text from '../items/Text';
import Page from '../Layout/Page';

type SegmentedControlItemProps = {
    titles: Array<string>,
    selectedIndex?: number,
    onSelectionChange?: (index: number) => void
};

const SegmentedControlItem: FunctionComponent<SegmentedControlItemProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(props.selectedIndex || 0)

    return <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
        { props.titles.map((item, index) => {
            const selected = index === selectedIndex
            return <TouchableOpacity onPress={() => {
                setSelectedIndex(index);
                props.onSelectionChange && props.onSelectionChange(index);
            }} activeOpacity={0.6} key={index} style={[
                    styles.item,
                    index === 0 ? styles.itemLeft : (index === props.titles.length - 1 ? styles.itemRight : styles.itemMiddle),
                    selected ? styles.selected : styles.deselected
                ]}>
                <Text text={item} center small medium white={selected} />
            </TouchableOpacity>
        })}
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

    return <Page>
        <View style={styles.segmentedContainer}>
            <SegmentedControlItem titles={props.items.map((item) => item.title)} onSelectionChange={setSelectedIndex}/>
        </View>
        <View style={styles.pageContainer}>
            {props.items[selectedIndex].page}
        </View>
    </Page>
};

const styles = StyleSheet.create({
    pageContainer: {
        flexGrow: 1,
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
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
    },
    item: {
        height: ItemHeight.default.valueOf() - 8,
        flex: 1,
        borderColor: Color.black.valueOf(),
        borderRightWidth: theme.borderWidth,
        borderTopWidth: theme.borderWidth,
        borderBottomWidth: theme.borderWidth,
        justifyContent: 'center',
    },
    itemLeft: {
        borderTopLeftRadius: theme.radius,
        borderBottomLeftRadius: theme.radius,
        borderLeftWidth: theme.borderWidth,
    },
    itemRight: {
        borderTopRightRadius: theme.radius,
        borderBottomRightRadius: theme.radius,
    },
    itemMiddle: {},
    selected: {
        backgroundColor: Color.black.valueOf(),
    },
    deselected: {
        backgroundColor: Color.white.valueOf(),
    }
})

export default SegmentedControl;
