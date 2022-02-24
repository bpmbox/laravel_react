import React, { FunctionComponent } from 'react';
import Row from '../Layout/Row';
import { View, StyleSheet } from 'react-native';
import Item from '../Item';
import theme, { FontSize, ItemHeight, Color, FontWeight, HorizontalOffset } from '../../../theme.style';
import { shortWeekdayNames } from '../../../libs/datetime';

type WeekdayHeaderProps = {};

const WeekdayHeader: FunctionComponent<WeekdayHeaderProps> = (props) => {
    return <View style={styles.container}>
        <Row style={styles.row}>
            { shortWeekdayNames.map((weekday) => {
                return <View key={weekday} style={styles.item}>
                    <Item
                        text={weekday}
                        height={ItemHeight.small}
                        leftTextOffset={HorizontalOffset.tiny}
                        rightTextOffset={HorizontalOffset.tiny}
                        textSize={FontSize.small}
                        textWeight={FontWeight.normal}
                        textColor={Color.accent5}
                        centerText
                    />
                </View>
            })}
        </Row>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: theme.horizontalPadding
    },
    row: {
        width: '100%',
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default WeekdayHeader;
