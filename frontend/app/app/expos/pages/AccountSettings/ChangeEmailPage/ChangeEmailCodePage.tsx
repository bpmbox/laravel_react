import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import * as yup from 'yup';
import { getModalHeader, ModalButtonType } from '../../../components/Navigation/NavButtons';
import Button from '../../../components/UIKit/items/Button';
import SimpleListButton from '../../../components/UIKit/items/SimpleListButton';
import SingleLineInput from '../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../components/UIKit/items/Spacer';
import Text from '../../../components/UIKit/items/Text';
import Page from '../../../components/UIKit/Layout/Page';
import i18n from '../../../i18n';
import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { PARAM_CODE, PARAM_EMAIL } from '../../../constants';
import routes from '../../../routes';
import { DesktopHeaderType, ItemHeight, ItemWidth } from '../../../theme.style';
import authService from '../../../services/auth';
import historyService from '../../../services/history';
import messageService from '../../../services/message';
import userService from '../../../services/user';

const codeSchema = yup.object().shape({
    code: yup.string().required(),
});

const ChangeEmailCodePage = props => {
    const { t } = useTranslation('ChangeEmailCodePage', { i18n });
    const { navigation } = props;
    const email = navigation.getParam(PARAM_EMAIL) || '';
    const code = navigation.getParam(PARAM_CODE) || '';

    // -- Init --
    useEffect(() => {
        // Prevent user from navigating directly to this page without email param.
        if (email) {
            return;
        }
        const parentNav = navigation.dangerouslyGetParent();
        if (!parentNav || parentNav.state.index === 0) {
            navigation.navigate(routes.TAB_SPACE_SETTINGS_GENERAL);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    // -- Handlers --
    const submitCode = async (
        values: { code: string },
        actions: FormikActions<{ code: string }>
    ): Promise<void> => {
        Keyboard.dismiss();
        try {
            await authService.updateEmail(email, values.code);
            actions.setSubmitting(false);
            // Pop 2x in order to exit past the enter email screen.
            const parentNav = navigation.dangerouslyGetParent();
            parentNav.pop();
            setImmediate(() => {
                parentNav.pop();
            });
            messageService.sendSuccess(t`Your email has been updated.`);
        } catch (err) {
            actions.setSubmitting(false);
            messageService.sendError(err.message);
        }
    };

    const onResendCodePress = async () => {
        try {
            await userService.requestEmailChangeCode(email);
            messageService.sendSuccess(
                t('A new verification code has been sent to {{email}}.', {
                    email: email,
                })
            );
        } catch (err) {
            messageService.sendError(err.message);
        }
    };

    // -- Render --
    return (
        <Page scrollable>
            <Formik
                validationSchema={codeSchema}
                initialValues={{ code: code }}
                isInitialValid={_p => codeSchema.isValidSync({ code: code })}
                onSubmit={submitCode}>
                {(formikProps: FormikProps<{ code: string }>): ReactNode => {
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
                                testID="ChangeEmailCodePageInput"
                                onChangeText={handleChange('code')}
                                onBlur={handleBlur('code')}
                                value={values.code}
                                placeholder={t('Verification code')}
                                autoFocus
                                returnKeyType="go"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="none"
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                testID="ChangeEmailCodePageVerifyButton"
                                onPress={() => {
                                    handleSubmit();
                                }}
                                disabled={!isValid || isSubmitting}
                                text={t`Verify`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Text
                                text={t(
                                    'A verification code has been sent to {{email}}.',
                                    { email: email }
                                )}
                                light
                                small
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                            <SimpleListButton
                                text={t`Didn't receive it? Resend verification code`}
                                onPress={onResendCodePress}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                        </>
                    );
                }}
            </Formik>
        </Page>
    );
};

const navigationOptions = ({navigation}: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('ChangeEmailCodePage::Enter your verification code'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: false,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close)
    }
};

// @ts-ignore
ChangeEmailCodePage.navigationOptions = navigationOptions;

export default withNavigation(ChangeEmailCodePage);
