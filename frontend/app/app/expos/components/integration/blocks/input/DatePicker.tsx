import get from 'lodash/get';
import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemProps } from '../../../../components/UIKit/Item';
import DatePickerItem from '../../../../components/UIKit/items/DatePicker';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
import { DateTime } from 'luxon';
import defaultTo from 'lodash/defaultTo';

type DatePickerProps = {
    value: {
        startDate: string,
        endDate?: string,
        includeTime?: boolean,
    },
    attrs?: {
        label?: string;
        allowEndDate?: boolean;
        allowTime?: boolean;
        name?: string;
    }
} & EventEmitterProps & ItemProps;

const parseDate = (text: string | null, allowTime: boolean) => {
    try {
        const date = DateTime.fromISO(text);
        return allowTime ? date : date.startOf('day');
    } catch {
        return null;
    }
}

const DatePicker: FunctionComponent<DatePickerProps> = (props) => {
    const { t } = useTranslation('DatePicker');
    const label = get(props, 'attrs.label', t`Pick a date...`);
    const allowEndDate = get(props, 'attrs.allowEndDate', true);
    const allowTime = get(props, 'attrs.allowTime', true);
    const normalizedStartDate = props.value && parseDate(props.value.startDate, allowTime);
    const normalizedEndDate = (props.value && allowEndDate) ? parseDate(props.value.endDate, allowTime) : null;
    const normalizeIncludeTime = (props.value && allowTime) ? defaultTo(props.value.includeTime, true) : false;
    const initialSelection = {
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        includeTime: normalizeIncludeTime,
    }

    const handleOnChange = (newValue) => {
        props.onChange && props.onChange(newValue);
    }

    return <DatePickerItem
        title={label}
        actionTitle={label}
        allowToggleEndDate={allowEndDate}
        allowToggleEndTime={allowTime}
        initialSelection={initialSelection}
        onDatePickerChange={handleOnChange}
        {...omit(props, 'value', 'attrs', 'onDatePickerChange')}
    />
};

export default DatePicker;
