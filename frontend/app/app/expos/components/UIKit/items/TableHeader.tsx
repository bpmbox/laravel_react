import React, { FunctionComponent } from 'react';
import theme, { ItemHeight, FontSize, HorizontalOffset, BackgroundType, Color } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { View, StyleSheet } from 'react-native';
import defaultTo from 'lodash/defaultTo';

type TableHeaderProps = {
    includeTopBorder?: boolean,
    includeBottomBorder?: boolean,
} & ItemProps;

const TableHeader: FunctionComponent<TableHeaderProps> = (props) => {
    const style = {
        borderTopWidth: defaultTo(props.includeTopBorder, true) ? theme.borderWidth : 0,
        borderBottomWidth: defaultTo(props.includeBottomBorder, true) ? theme.borderWidth : 0,
    }
    return <View style={[styles.container, style]}>
        <Item
            height={ItemHeight.default}
            textSize={FontSize.normal}
            textColor={Color.accent6}
            textNumberOfLines={1}
            leftTextOffset={HorizontalOffset.default}
            backgroundType={BackgroundType.full}
            backgroundColor={Color.accent2}
            {...props} />
    </View>
};

const styles = StyleSheet.create({
    container: {
        borderTopColor: Color.accent3.valueOf(),
        borderBottomColor: Color.accent3.valueOf(),
    }
});

export default TableHeader;
