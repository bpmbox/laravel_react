import React, { FunctionComponent, useState, useEffect, ReactNode } from 'react';
import { Formik, FormikActions, FormikProps } from 'formik';
import Row from '../Layout/Row';
import { View, StyleSheet } from 'react-native';
import { Color } from '../../../theme.style';
import { DateTime } from 'luxon';
import SingleLineInput from '../items/SingleLineInput';
import defaultTo from 'lodash/defaultTo';
import useDebouncedState from '../../../libs/use-debounced-state';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { dateFormat, timeFormat } from '../../../libs/datetime';
import getTranslate from '../../../libs/get-translate';

const { t } = getTranslate('DateTimeInput');

type DateTimeInputProps = {
    includeTime?: boolean,
    date?: DateTime,
    focused?: boolean,
    onChangeDateTime?: (datetime: DateTime) => void,
    onFocused?: () => void,
};

type DateInputFormValues = {
    date: string;
    time: string;
};

const DateTimeInput: FunctionComponent<DateTimeInputProps> = (props) => {
    const [changes, setChanges] = useDebouncedState<DateInputFormValues | null>(null, 500);
    const [focused, setFocused] = useState<boolean>(false);

    const initialValues: DateInputFormValues = {
        date: defaultTo(props.date, DateTime.local()).toFormat(dateFormat),
        time: defaultTo(props.date, DateTime.local()).toFormat(timeFormat)
        // TODO: handle localization, but this means also handling parsing
        // date: defaultTo(props.date, DateTime.local()).toLocaleString({ day: 'numeric', month: 'short', year: 'numeric' }),
        // time: defaultTo(props.date, DateTime.local()).toLocaleString(DateTime.TIME_SIMPLE)
    };

    // Observer on debounced form changes
    useEffect(() => {
        if (!changes) {
            return;
        }
        let newDate = DateTime.fromFormat(changes.date, dateFormat);
        if (props.includeTime) {
            const newTime = DateTime.fromFormat(changes.time, timeFormat);
            newDate = newDate.set({ hour: newTime.hour, minute: newTime.minute });
        }
        if (newDate.isValid && props.onChangeDateTime) {
            props.onChangeDateTime(newDate);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changes]);

    useEffect(() => {
        setFocused(defaultTo(props.focused, false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.focused]);

    const validationSchema = yup.object().shape({
        date: yup.string()
            .test('date-valid', t`Invalid date.`, (text) => {
                if (isEmpty(text)) {
                    return false;
                }
                return DateTime.fromFormat(text, dateFormat).isValid;
            }),
        time: yup.string()
            .test('time-valid', t`Invalid time.`, (text) => {
                if (isEmpty(text)) {
                    return false;
                }
                return DateTime.fromFormat(text, timeFormat).isValid;
            }),
    });

    const handleUpdatedValues = (values: DateInputFormValues, _actions: FormikActions<DateInputFormValues>) => {
        setChanges(values);
    };

    const handleFocused = () => {
        props.onFocused && props.onFocused()
    }

    return <Row style={styles.row}>
        <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleUpdatedValues}>
            {(formikProps: FormikProps<DateInputFormValues>): ReactNode => {
                const {
                    values,
                    handleSubmit,
                    handleBlur,
                    handleChange,
                } = formikProps;

                return (
                    <>
                        <View style={styles.dateContainer}>
                            <SingleLineInput
                                onChangeText={evt => {
                                    handleChange('date')(evt);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                                onBlur={handleBlur('date')}
                                onFocus={handleFocused}
                                textColor={focused ? Color.success : Color.black}
                                value={values.date}
                                returnKeyType='next'
                                autoCorrect={false}
                                spellCheck={false} />
                        </View>
                        { defaultTo(props.includeTime, false) &&
                            <View style={styles.timeContainer}>
                                <SingleLineInput
                                    onChangeText={evt => {
                                        handleChange('time')(evt);
                                        // Called in next promise cycle to allow validation to resolve.
                                        setImmediate(handleSubmit);
                                    }}
                                    onFocus={handleFocused}
                                    onBlur={handleBlur('time')}
                                    textColor={Color.black}
                                    value={values.time}
                                    returnKeyType='next'
                                    autoCorrect={false}
                                    spellCheck={false}
                                />
                            </View>
                        }
                    </>
                );
            }}
        </Formik>
    </Row>;
};

const styles = StyleSheet.create({
    row: {
        width: '100%',
        display: 'flex'
    },
    dateContainer: {
        flex: 1,
    },
    timeContainer: {
        flex: 1,
    },
});

export default DateTimeInput;
