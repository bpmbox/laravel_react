import React, { FunctionComponent, useState, memo } from 'react';
import Row from '../Layout/Row';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme, { FontSize, ItemHeight, Color, FontWeight, BackgroundType, HorizontalOffset, LineHeight, VerticalOffset, VerticalPosition, ItemWidth } from '../../../theme.style';
import { isInRangeDays } from '../../../libs/datetime';
import { DateTime } from 'luxon';
import { getTextStyle, getTextProps, getItemStyle, getBackgroundStyle } from '../Item/style';

type WeekRowProps = {
    dates: Array<{date: DateTime, isCurrentMonth: boolean}>,
    startDate?: DateTime,
    endDate?: DateTime,
    onDateSelected?: (DateTime) => void,
};

type DayItemProps = {
    date: DateTime,
    monthStartDate?: DateTime,
    monthEndDate?: DateTime,
    isCurrentMonth: boolean,
    onDateSelected?: (DateTime) => void,
};

// Exception to the rule: we use a custom React Native component
// instead of an Item. This is in order to make the Date Picker
// faster (using an Item for each of the month days in slow).
const DayItem: FunctionComponent<DayItemProps> = (props) => {
    const {
        date,
        monthStartDate,
        monthEndDate,
        isCurrentMonth,
        onDateSelected
    } = props;
    const [pressed, setPressed] = useState<boolean>(false);
    const isCurrentDay = DateTime.local().hasSame(date, 'day');
    const isStartDate = monthStartDate && monthStartDate.hasSame(date, 'day');
    const isEndDate = monthEndDate && monthEndDate.hasSame(date, 'day');
    const isInBetweenDate = monthStartDate && monthEndDate && isInRangeDays(date, monthStartDate, monthEndDate);
    const hasBackground = isStartDate || isEndDate || isInBetweenDate;

    const weekDayTextStyle = getTextStyle(
        FontSize.normal,
        isCurrentDay ? FontWeight.bold : FontWeight.normal,
        LineHeight.normal,
        hasBackground ? Color.white : (isCurrentMonth ? Color.black : Color.accent5),
        true,
        HorizontalOffset.tiny,
        HorizontalOffset.tiny,
        VerticalOffset.small,
        VerticalOffset.small,
        null,
        pressed,
        false
    );

    const textProps = getTextProps(1, false);
    const day = `${date.day}`;
    
    return <View style={styles.dayItemContainer}>
        <TouchableOpacity
            disabled={false}
            onPress={() => { onDateSelected && onDateSelected(date) }}
            onPressOut={() => { setPressed(false); }}
            onPressIn={() => { setPressed(true); }}
            activeOpacity={0.95}
        >
            { hasBackground &&
                <View style={styles.background} />
            }
            <View style={styles.dayItem}>
                <Text style={weekDayTextStyle.text} {...textProps}>
                    {day}
                </Text>
            </View>
        </TouchableOpacity>
    </View>;
}

const MemoizedDayItem = memo(DayItem);

const WeekRow: FunctionComponent<WeekRowProps> = (props) => {
    return <View style={styles.weekRowContainer}>
        <Row style={styles.weekRow}>
            { props.dates.map((date) => {
                return <MemoizedDayItem
                    key={date.date.day}
                    date={date.date}
                    monthStartDate={props.startDate}
                    monthEndDate={props.endDate}
                    isCurrentMonth={date.isCurrentMonth}
                    onDateSelected={props.onDateSelected}
                />;
            })}
        </Row>
    </View>;
}

type CalendarGridProps = {
    monthYear: DateTime,
    startDate?: DateTime,
    endDate?: DateTime,
    onDateSelected?: (DateTime) => void,
};

const CalendarGrid: FunctionComponent<CalendarGridProps> = (props) => {
    const numRows = 6;
    const monthStartDate = props.monthYear.startOf('month');
    const nextMonthStartDate = monthStartDate.plus({ month: 1 });
    const startWeekdayIndex = monthStartDate.weekday - 1;
    const daysInPastMonth = Array.from(Array(startWeekdayIndex).keys())
        .map((index) => {
            return {
                date: monthStartDate.plus({ day: index-startWeekdayIndex }),
                isCurrentMonth: false
            };
        });
    const daysInMonth = Array.from(Array(monthStartDate.daysInMonth).keys())
        .map((index) => {
            return {
                date: monthStartDate.plus({ day: index }),
                isCurrentMonth: true
            };
        });
    const daysInNextMonth = Array.from(Array(numRows * 7 - daysInPastMonth.length - daysInMonth.length).keys())
        .map((index) => {
            return {
                date: nextMonthStartDate.plus({ day: index }),
                isCurrentMonth: false
            };
        });
    const allDays = [...daysInPastMonth, ...daysInMonth, ...daysInNextMonth];
    return <>
        { Array.from(Array(numRows).keys()).map((index) => {
            return <WeekRow
                key={index}
                dates={allDays.slice(index*7, (index+1)*7)}
                startDate={props.startDate}
                endDate={props.endDate}
                onDateSelected={props.onDateSelected} />
        })
        }
    </>;
};

const styles = StyleSheet.create({
    weekRowContainer: {
        width: '100%',
        paddingHorizontal: theme.horizontalPadding
    },
    weekRow: {
        width: '100%',
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayItemContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    dayItem: getItemStyle(
        null,
        null,
        ItemHeight.default,
        null,
        VerticalPosition.middle,
        VerticalOffset.none,
        VerticalOffset.none,
        true,
        ItemWidth.fill,
        false
    ).item,
    background: getBackgroundStyle(
        BackgroundType.full,
        Color.success
    ).item
});

export default CalendarGrid;
