import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import omit from 'lodash/omit';
import React, { useState } from 'react';
import routes from '../../../routes';
import { BackgroundType, Color, ItemHeight } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { DateTime } from 'luxon';
import { dateTimeFormat, dateFormat, isDateValid } from '../../../libs/datetime';
import i18n from '../../../i18n';
import get from 'lodash/get';

export type DatePickerState = {
    startDate?: DateTime,
    endDate?: DateTime,
    includeTime?: boolean,
};

type DatePickerProps = {
    title: string;
    actionTitle?: string;
    allowToggleEndDate?: boolean;
    allowToggleEndTime?: boolean;
    initialSelection?: DatePickerState;
    onDatePickerChange?: (state?: DatePickerState) => void;
} & ItemProps & {
    navigation: any;
};

const formatTitle = (state: DatePickerState | null, fallbackTitle: string) => {
    if (!isDateValid(get(state, 'startDate', null))) {
        return fallbackTitle;
    }
    const format = state.includeTime ? dateTimeFormat : dateFormat;
    const startDate = state.startDate.toFormat(format);
    if (isDateValid(get(state, 'endDate', null))) {
        const endDate = state.endDate.toFormat(format);
        return i18n.t('{{startDate}} → {{endDate}}', {startDate, endDate})
    } else {
        return startDate;
    }
}

const DatePicker: (props: DatePickerProps) => any = (props) => {
    const { navigation } = props;
    const [selection, setSelection] = useState<DatePickerState | null>(props.initialSelection);

    const handleSelection = (selection) => {
        setSelection(selection);
        props.onDatePickerChange && props.onDatePickerChange(selection);
    }

    const handlePress = () => {
        navigation.push(routes.DATE_PICKER, {
            selection,
            title: props.title,
            allowToggleEndDate: defaultTo(props.allowToggleEndDate, false),
            allowToggleEndTime: defaultTo(props.allowToggleEndTime, false),
            onFinish: handleSelection
        });
    }

    return <Item
        text={formatTitle(selection, defaultTo(props.actionTitle, props.title))}
        textColor={Color.success}
        height={ItemHeight.default}
        textNumberOfLines={1}
        onPress={handlePress}
        touchable={true}
        pressedBackgroundType={BackgroundType.full}
        minHeight={ItemHeight.default}
        {...omit(props,
            'title',
            'actionTitle',
            'multi',
            'allowDeselect',
            'values',
            'initialSelection',
            'currentSelection',
            'disabledSelection',
            'titleRenderer',
            'itemRenderer',
            'emptyRenderer',
            'headerRenderer',
            'onSelectionChange',
            'onItemSelected',
        )}
    />
};

export default withNavigation(DatePicker);
