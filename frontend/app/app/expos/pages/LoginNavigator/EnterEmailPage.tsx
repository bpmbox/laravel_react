import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { FunctionComponent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { createNavigationOptions } from '../../components/Navigation/NavButtons';
import Button from '../../components/UIKit/items/Button';
import Heading from '../../components/UIKit/items/Heading';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { isMobilePlatform } from '../../libs/platform';
import { PARAM_EMAIL, PARAM_REDIRECT } from '../../constants';
import { ItemHeight, ItemWidth } from '../../theme.style';
import routes from '../../routes';
import authService from '../../services/auth';
import messageService from '../../services/message';
import { MobileKeyboardType } from '../../theme.style.shared';
import { triggerOnEnter } from '../../libs/ui-utils';

const enterEmailSchema = yup.object().shape({
    email: yup
        .string()
        .email(i18n.t('EnterEmailPage::Please enter a valid email address.'))
        .required(i18n.t('EnterEmailPage::Email is required')),
});

type EmailFormValues = {
    email: string;
};

const EnterEmailPage: FunctionComponent<{ navigation: any }> = props => {
    const { t } = useTranslation('EnterEmailPage', { i18n });
    const { navigation } = props;
    const email = navigation.getParam('email');
    const redirectPath = navigation.getParam(PARAM_REDIRECT);

    // Side effect to navigate to next page when email is submitted.
    const handleFormSubmit = async (
        values: EmailFormValues,
        actions: FormikActions<EmailFormValues>
    ): Promise<void> => {
        actions.setSubmitting(true);

        try {
            await authService.requestEmailCode(values.email);
            actions.setSubmitting(false);
            navigation.navigate(routes.LOGIN_ENTER_LOGIN_CODE, {
                [PARAM_REDIRECT]: redirectPath,
                [PARAM_EMAIL]: values.email,
            });
        } catch (err) {
            actions.setSubmitting(false);

            if (err.type === 'AuthNotWhitelisted') {
                navigation.navigate(routes.LOGIN_REQUEST_ACCESS);
                return;
            }

            console.error('Error requesting email code', err);
            messageService.sendError(
                t`An error has occurred while requesting email code.`
            );
        }
    };

    return (
        <Page scrollable>
            <Formik
                validationSchema={enterEmailSchema}
                initialValues={{ email: email || '' }}
                isInitialValid={_p =>
                    enterEmailSchema.isValidSync({ email: email || '' })
                }
                onSubmit={handleFormSubmit}>
                {(
                    formikProps: FormikProps<EmailFormValues>
                ): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                    } = formikProps;
                    return (
                        <>
                            { !isMobilePlatform && <Spacer height={ItemHeight.xxlarge} /> }
                            <Heading
                                text={t('Enter Your Email')}
                                h3
                                autoCapitalize='none'
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true} />
                            <SingleLineInput
                                testID='EmailTextInput'
                                onChangeText={handleChange('email')}
                                onKeyPress={triggerOnEnter(handleSubmit)}
                                value={values.email}
                                placeholder={t('Email')}
                                autoFocus
                                mobileKeyboardType={MobileKeyboardType.email}
                                returnKeyType='next'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='none'
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                testID='EmailPageNextButton'
                                onPress={() => handleSubmit()}
                                disabled={!isValid || isSubmitting}
                                text={t('Next')}
                                autoCapitalize='none'
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true}
                            />
                        </>
                    );
                }}
            </Formik>
        </Page>
    );
};

// @ts-ignore
EnterEmailPage.navigationOptions = createNavigationOptions(
    i18n.t('EnterEmailPage::Email'),
    null,
    { hideHeaderOnDesktop: true },
    false
);

// @ts-ignore
EnterEmailPage.path = 'email'; //override path for better web URLs

export default withNavigation(EnterEmailPage);
