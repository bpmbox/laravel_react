import { withNavigation } from '@react-navigation/core';
import get from 'lodash/get';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import Spacer from '../../components/UIKit/items/Spacer';
import Divider from '../../components/UIKit/items/Divider';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../theme.style';
import historyService from '../../services/history';
import { PARAM_ON_DONE } from '../../constants';
import { useTranslation } from 'react-i18next';
import Calendar from '../../components/UIKit/Calendar';
import Switch from '../../components/UIKit/items/Switch';
import SimpleListButton from '../../components/UIKit/items/SimpleListButton';
import DateTimeInput from '../../components/UIKit/Calendar/DateTimeInput';
import { DateTime } from 'luxon';
import { isEarlierThanOrEqualInDays, isLaterThanOrEqualInDays, isEarlierThan, isLaterThan, isDateValid } from '../../libs/datetime'
import { getRightActionHeader, getModalHeader, ModalButtonType } from '../../components/Navigation/NavButtons';

const DatePickerPage: FunctionComponent<NavigationInjectedProps> = props => {
    const { t } = useTranslation('DatePickerPage');
    const { navigation } = props;
    const {
        selection,
        allowToggleEndDate,
        allowToggleEndTime,
        onFinish,
    } = navigation.state.params;
    const [state, setState] = useState<
            {
                startDate: DateTime,
                endDate?: DateTime,
                includeEndDate: boolean,
                includeTime: boolean,
                startDateFocused: boolean,
                endDateFocused: boolean,
            }
        >({
            startDate: get(selection, 'startDate', DateTime.local().startOf('day')),
            endDate: get(selection, 'endDate', null),
            includeEndDate: isDateValid(get(selection, 'endDate', null)),
            includeTime: get(selection, 'includeTime', false),
            startDateFocused: true,
            endDateFocused: false,
        });

    useEffect(() => {
        navigation.setParams({
            [PARAM_ON_DONE]: () => {
                onFinish({
                    startDate: state.startDate,
                    endDate: state.includeEndDate ? state.endDate : null,
                    includeTime: state.includeTime
                });
                navigation.goBack();
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const handleIncludeEndDateChange = (includeEndDate) => {
        const endDate = includeEndDate ?
            state.startDate.plus({ day: 1 }) :
            null;
        setState({
            ...state,
            includeEndDate,
            endDate,
            startDateFocused: !includeEndDate,
            endDateFocused: includeEndDate,
        });
    }

    const handleOnIncludeTimeChange = (includeTime) => {
        let startDate = state.startDate;
        let endDate = state.endDate;
        if (!includeTime) {
            startDate = startDate.startOf('day');
            endDate = endDate ? endDate.startOf('day') : null;
        }
        setState({...state, includeTime, startDate, endDate });
    }

    const handleOnClear = () => {
        onFinish(null);
        navigation.goBack();
    }

    const handleOnDateSelected = (calendarDate: DateTime) => {
        let date = calendarDate;
        console.log("------------------------------------");
        console.log("Received date", date.toISO());
        console.log("Current selection", state.startDate.toISO());
        if (state.includeTime) {
            // Keep the previously selected time
            if (state.startDateFocused && state.startDate) {
                date = date.set({ hour: state.startDate.hour, minute: state.startDate.minute });
            } else if (state.endDateFocused && state.endDate) {
                date = date.set({ hour: state.endDate.hour, minute: state.endDate.minute });
            }
        }
        console.log("With time", date.toISO());
        if (!state.includeEndDate) {
            setState({ ...state, startDate: date });
        } else {
            if (state.startDateFocused) {
                if (!state.endDate) {
                    setState({ ...state, startDate: date });
                } else if (isEarlierThanOrEqualInDays(date, state.endDate)) {
                    setState({ ...state, startDate: date });
                } else {
                    setState({ ...state, endDate: date, startDateFocused: false, endDateFocused: true });
                }
            } else if (state.endDateFocused) {
                if (isLaterThanOrEqualInDays(date, state.startDate)) {
                    setState({ ...state, endDate: date });
                } else {
                    setState({ ...state, startDate: date, startDateFocused: true, endDateFocused: false });
                }
            }
        }
    }

    const handleOnStartDateInputChange = (startDate?: DateTime) => {
        console.log("handleOnStartDateInputChange", startDate && startDate.toISO())
        if (!!state.endDate && isEarlierThan(state.endDate, startDate)) {
            setState({ ...state, startDate, endDate: startDate.startOf('day') });
        } else {
            setState({ ...state, startDate });
        }
    }

    const handleOnEndDateInputChange = (endDate?: DateTime) => {
        if (!!endDate && isLaterThan(state.startDate, endDate)) {
            setState({ ...state, endDate, startDate: endDate.startOf('day') });
        } else {
            setState({ ...state, endDate });
        }
    }

    const handleOnStartDateFocused = () => {
        setState({ ...state, startDateFocused: true, endDateFocused: false });
    }

    const handleOnEndDateFocused = () => {
        setState({ ...state, startDateFocused: false, endDateFocused: true });
    }

    return (
        <Page
            scrollable
            desktopPadding={PaddingType.horizontalBottom}>
            <DateTimeInput
                includeTime={state.includeTime}
                date={state.startDate}
                focused={state.startDateFocused}
                onChangeDateTime={handleOnStartDateInputChange}
                onFocused={handleOnStartDateFocused}
            />
            { state.includeEndDate &&
                <DateTimeInput
                    includeTime={state.includeTime}
                    date={state.endDate}
                    focused={state.endDateFocused}
                    onChangeDateTime={handleOnEndDateInputChange}
                    onFocused={handleOnEndDateFocused} />
            }
            <Spacer height={ItemHeight.xsmall} />
            <Calendar
                startDate={state.startDate}
                endDate={state.endDate}
                includeEnd={state.includeEndDate}
                onDateSelected={handleOnDateSelected}
            />
            { (allowToggleEndDate || allowToggleEndTime) &&
                <Divider middle />
            }
            { allowToggleEndDate &&
                <Switch text={t`End Date`} toggled={state.includeEndDate} onPress={handleIncludeEndDateChange} />
            }
            { allowToggleEndTime &&
                <Switch text={t`Include Time`} toggled={get(selection, 'includeTime', false)} onPress={handleOnIncludeTimeChange} />
            }
            <Divider middle />
            <SimpleListButton text={t`Clear`} onPress={handleOnClear} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof navigation.getParam('onFinish') !== 'function') {
        navigation.pop();
        return null;
    }

    historyService.setNavigation(navigation);
    const rightHeader = getRightActionHeader(i18n.t('Done'), true, true, () => {
        navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
    });
    return {
        title: get(navigation, 'state.params.title', i18n.t('Date')),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: false,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
    };
};

// @ts-ignore
DatePickerPage.navigationOptions = navigationOptions;

export default withNavigation(DatePickerPage);
