import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import * as yup from 'yup';
import { getModalHeader, ModalButtonType } from '../../../components/Navigation/NavButtons';
import Button from '../../../components/UIKit/items/Button';
import SingleLineInput from '../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../components/UIKit/items/Spacer';
import Page from '../../../components/UIKit/Layout/Page';
import i18n from '../../../i18n';
import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { DesktopHeaderType, ItemHeight } from '../../../theme.style';
import routes from '../../../routes';
import historyService from '../../../services/history';
import messageService from '../../../services/message';
import userService from '../../../services/user';
import { MobileKeyboardType } from '../../../theme.style.shared';

const enterEmailSchema = yup.object().shape({
    email: yup
        .string()
        .email(i18n.t('ChangeEmailMainPage::Please enter a valid email address.'))
        .required(i18n.t('ChangeEmailMainPage::Email is required')),
});

const ChangeEmailMainPage = (props: any) => {
    const { t } = useTranslation('ChangeEmailMainPage', { i18n });

    const submitEmail = async (values: { email: string }, actions: FormikActions<{ email: string }>): Promise<void> => {
        try {
            await userService.requestEmailChangeCode(values.email);
            actions.setSubmitting(false);
            historyService.push(routes.CHANGE_EMAIL_CODE, { email: values.email })
        } catch (err) {
            actions.setSubmitting(false);
            messageService.sendError(err.message);
            Keyboard.dismiss();
        }
    };

    return (
        <Page scrollable>
            <Formik
                validationSchema={enterEmailSchema}
                initialValues={{ email: '' }}
                onSubmit={submitEmail}
                enableReinitialize>
                {(formikProps: FormikProps<{ email: string }>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                    } = formikProps;
                    return (
                        <>
                            <SingleLineInput
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                placeholder={t('New email')}
                                autoFocus
                                mobileKeyboardType={MobileKeyboardType.email}
                                returnKeyType='next'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='none' />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                onPress={() => { handleSubmit() }}
                                disabled={!isValid || isSubmitting}
                                text={t(`Next`)} />
                        </>
                    )
                }}
            </Formik>
        </Page>
    );
};

export const navigationOptions = ({navigation}: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('ChangeEmailMainPage::Change Email'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: false,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close)
    }
};

// @ts-ignore
ChangeEmailMainPage.navigationOptions = navigationOptions;

export default withNavigation(ChangeEmailMainPage);