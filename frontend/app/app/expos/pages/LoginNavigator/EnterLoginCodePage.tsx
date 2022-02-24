import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { FunctionComponent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import * as yup from 'yup';
import i18n from '../../i18n';
import authService from '../../services/auth';
import messageService from '../../services/message';
import { createNavigationOptions } from '../../components/Navigation/NavButtons';
import Button from '../../components/UIKit/items/Button';
import SimpleListButton from '../../components/UIKit/items/SimpleListButton';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import { PARAM_CODE, PARAM_EMAIL } from '../../constants';
import { useEmailLoginFlow } from './controller';
import { ItemWidth, ItemHeight } from '../../theme.style';
import { isMobilePlatform } from '../../libs/platform';
import Heading from '../../components/UIKit/items/Heading';
import { triggerOnEnter } from '../../libs/ui-utils';

type ValidationCodeFormValues = {
    email: string;
    code: string;
}

const EnterLoginCodePage: FunctionComponent<{ navigation: any }> = props => {
    const { t } = useTranslation('EnterLoginCodePage');
    const { navigation } = props;
    const email = navigation.getParam(PARAM_EMAIL);
    const code = navigation.getParam(PARAM_CODE);

    const validationSchema = yup.object().shape({
        code: yup.string().required(t`Validation code is required`),
    });

    const handleEmailLogin = useEmailLoginFlow();
    const handleFormSubmit = async (
        values: ValidationCodeFormValues,
        actions: FormikActions<ValidationCodeFormValues>
    ): Promise<void> => {
        Keyboard.dismiss();
        try {
            await handleEmailLogin(values.email, values.code);
        } catch (err) {
            console.error('Error login with email/code', err);
            messageService.sendError(
                t`Unable to verify your login code. Please check your input and try again.`
            );
        }
        actions.setSubmitting(false);
    };

    const onResendLoginCodePress = async () => {
        try {
            await authService.requestEmailCode(email);
            messageService.sendSuccess(
                t('A new login code has been sent to {{email}}.', {
                    email: email,
                })
            );
        } catch (err) {
            messageService.sendError(err.message);
        }
    };

    return (
        <Page scrollable>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ code: code || '', email: email }}
                isInitialValid={_p =>
                    validationSchema.isValidSync({ code: code })
                }
                onSubmit={(values, actions): Promise<void> =>
                    handleFormSubmit({ ...values, email: email }, actions)
                }>
                {(
                    formikProps: FormikProps<ValidationCodeFormValues>
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
                                text={t('Enter Your Login Code')}
                                h3
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true}
                            />
                            <SingleLineInput
                                testID="EnterLoginCodePageCodeInput"
                                onChangeText={handleChange('code')}
                                onKeyPress={triggerOnEnter(handleSubmit)}
                                value={values.code}
                                placeholder={t('Login code')}
                                autoFocus
                                returnKeyType="go"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="none"
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                testID="EnterLoginCodePageNextButton"
                                onPress={() => {
                                    handleSubmit();
                                }}
                                disabled={!isValid || isSubmitting}
                                text={t('Next')}
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Text
                                text={t(
                                    'A login code has been sent to {{email}}.',
                                    { email: email }
                                )}
                                light
                                small
                                desktopWidth={ItemWidth.xnarrow}
                                desktopCenterItem={true}
                            />
                            <SimpleListButton
                                text={t`Didn't receive it? Resend login code`}
                                onPress={onResendLoginCodePress}
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
EnterLoginCodePage.navigationOptions = createNavigationOptions(
    i18n.t('EnterLoginCodePage::Validation Code'),
    null,
    { hideHeaderOnDesktop: true },
    false
);

// @ts-ignore
EnterLoginCodePage.path = 'validate'; //override path for better web URLs

export default withNavigation(EnterLoginCodePage);
