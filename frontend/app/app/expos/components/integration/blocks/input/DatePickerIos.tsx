import get from 'lodash/get';
import omit from 'lodash/omit';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemProps } from '../../../UIKit/Item';
import DatePickerItem from '../../../UIKit/items/DatePicker';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
import { DateTime } from 'luxon';
import { isMobilePlatform } from '../../../../libs/platform';
import DatePickerIosItem from '../../../UIKit/react-native-datepicker'

type DatePickerIosProps = {
    value: {
        startDate: string
    },
    attrs: {
        name?: string;
    };
} & EventEmitterProps & ItemProps;

const parseDate = (text: string | null) => {
    try {
        const date = DateTime.fromISO(text);
        return date.startOf('day');
    } catch {
        return null;
    }
}
const toDoubleDigits = function(num) {
    num += "";
    if (num.length === 1) {
        num = "0" + num;
    }
    return num;
};
const yyyymmdd = function(val?) {
    const date = val? new Date(val) : new Date();
    const yyyy = date.getFullYear();
    const mm = toDoubleDigits(date.getMonth() + 1);
    const dd = toDoubleDigits(date.getDate());
    return `${yyyy}-${mm}-${dd}`;
};

const DatePickerIos: FunctionComponent<DatePickerIosProps> = (props) => {
    const { t } = useTranslation('DatePicker');
    const label = get(props, 'attrs.label', t`Pick a date...`);
    const normalizedStartDate = props.value && parseDate(props.value.startDate);
    const initialSelection = {
        startDate: normalizedStartDate,
        endDate: null,
        includeTime: null,
    }
    const [selectedValue, setSelectedValue] = useState<string | null>(yyyymmdd(parseDate(props.value.startDate)));

    const handleOnChange = (newValue) => {
        props.onChange && props.onChange(yyyymmdd(newValue.startDate));
    }
    const handleOnChangeIos = (newValue) => {
        setSelectedValue(newValue.date)
        props.onChange && props.onChange(newValue.date);
    }

    if(isMobilePlatform){
        // スタイル設定も含めてreact-native-datepickerの内部で実施しているので、UIKit/items/を経由しない。
        return (
            <DatePickerIosItem
                style={{width: 200}}
                date={selectedValue}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginTop:20,
                        marginLeft: 0
                    }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {handleOnChangeIos({date: date})}}
            />
        )
    }else{
        // react-native-datepickerがweb用にコンパイルできないので、既存のデータピッカーで代用
        return <DatePickerItem
            title={label}
            actionTitle={label}
            allowToggleEndDate={false}
            allowToggleEndTime={false}
            initialSelection={initialSelection}
            onDatePickerChange={handleOnChange}
            {...omit(props, 'value', 'attrs', 'onDatePickerChange')}
        />
    }
};

export default DatePickerIos;
