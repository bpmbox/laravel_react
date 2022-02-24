import React, { FunctionComponent, useState, useEffect } from 'react';
import MonthHeader from './MonthHeader';
import WeekdayHeader from './WeekdayHeader';
import { DateTime } from 'luxon';
import CalendarGrid from './CalendarGrid';
import Spacer from '../items/Spacer';
import { ItemHeight } from '../../../theme.style';

type CalendarProps = {
    startDate: DateTime,
    endDate?: DateTime,
    includeEnd?: boolean,
    onDateSelected?: (date: DateTime) => void
};

type CalendarState = {
    startDate: DateTime,
    endDate?: DateTime,
    monthYear: DateTime,
};

const Calendar: FunctionComponent<CalendarProps> = (props) => {
    const [values, setValues] = useState<CalendarState>({
        startDate: props.startDate,
        endDate: props.endDate,
        monthYear: props.startDate.startOf('month')
    });

    useEffect(() => {
        setValues({
            ...values,
            startDate: props.startDate,
            endDate: props.endDate,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startDate, props.endDate, props.includeEnd])
    
    const onPrevPress = () => {
        setValues({
            ...values,
            monthYear: values.monthYear.plus({ month: -1})
        });
    }

    const onNextPress = () => {
        setValues({
            ...values,
            monthYear: values.monthYear.plus({ month: 1})
        });
    }

    return <>
        <MonthHeader monthYear={values.monthYear} onPrevPress={onPrevPress} onNextPress={onNextPress} />
        <Spacer height={ItemHeight.xsmall} />
        <WeekdayHeader />
        <CalendarGrid
            monthYear={values.monthYear}
            startDate={values.startDate}
            endDate={values.endDate}
            onDateSelected={props.onDateSelected}/>
    </>;
};

export default Calendar;
