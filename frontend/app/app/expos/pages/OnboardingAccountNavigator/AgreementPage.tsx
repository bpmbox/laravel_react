import { withNavigation } from '@react-navigation/core';
import { Formik, FormikProps } from 'formik';
import assign from 'lodash/assign';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import * as yup from 'yup';
import { createNavigationOptions } from '../../components/Navigation/NavButtons';
import Button from '../../components/UIKit/items/Button';
import Spacer from '../../components/UIKit/items/Spacer';
import Page from '../../components/UIKit/Layout/Page';
import routes from '../../routes';
import { ItemWidth } from '../../theme.style';
import messageService from '../../services/message';
import AuthStore from '../../store/auth';
import historyService from '../../services/history';
import i18n from '../../i18n';

const AgreementPage = (props: any) => {
    const { currentUser } = AuthStore.useContainer();
    const [agreeUserPolicy, setAgreeUserPolicy] = useState(false);
    const [agreePrivacyPolicy, setAgreePrivacyPolicy] = useState(false);
    const navigation = props.navigation;
    const { t } = useTranslation('AgreementPage');

    const validationSchema = yup.object().shape({
        userPolicy: yup.boolean().oneOf([true], "同意が必要です。"),
        privacyPolicy: yup.boolean().oneOf([true], "同意が必要です。"),
    });

    interface ProfileFormValues {
        userPolicy: boolean;
        privacyPolicy: boolean;
    }

    const handleFormSubmit = async (): Promise<void> => {
        try {
            navigation.navigate(routes.LOGIN_ENTER_EMAIL);
        } catch (err) {
            console.error('Error occurred while registration.', err);
            messageService.sendError(t`An error occurred while setting up your profile.`);
        }
    };

    const INITIAL_VALUES: ProfileFormValues = {userPolicy: false, privacyPolicy: false };
    const initialValues: ProfileFormValues = assign(INITIAL_VALUES, currentUser);

    const openUserPolicy = () => {
        historyService.push(routes.SETTINGS_USER_POLICY);
    };

    const openPrivacyPolicy = () => {
        historyService.push(routes.SETTINGS_PRIVACY_POLICY);
    };

    const gotoEnterDetails = () => {
        historyService.push(routes.ONBOARDING_ACCOUNT_ENTER_DETAILS);
    };

    return (
        <Page scrollable>
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                isInitialValid={() => validationSchema.isValidSync(initialValues)}
                onSubmit={handleFormSubmit}>
                {(formikProps: FormikProps<ProfileFormValues>): ReactNode => {
                    const {
                        isValid,
                        isSubmitting,
                        handleChange,
                    } = formikProps;

                    const isDisabled = !isValid || isSubmitting;

                    return (
                        <View>
                            <Spacer />
                            <View style={styles.text}>
                                <Text
                                    style={{fontSize: 20}}>
                                    {`本アプリケーションのご利用には、\n下記の各利用規約等をご確認いただき、\n同意していただく必要があります。`}
                                </Text>
                            </View>
                            <Spacer />
                            <View style={{marginLeft:30, flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleChange('userPolicy')(!agreeUserPolicy)
                                        setAgreeUserPolicy(!agreeUserPolicy)
                                    }}>
                                    {agreeUserPolicy
                                            ?
                                            <Image
                                            style={styles.imagebutton}
                                            source={require('../../assets/images/checked.png')}
                                            />
                                            :
                                            <View style={styles.box}></View>
                                        }
                                </TouchableOpacity>            
                                <View style={styles.buttontext}>
                                    <Text　
                                        style={{color: '#0050ff',fontSize: 17}}
                                        onPress={openUserPolicy}>
                                        {'利用規約'}
                                    </Text>
                                    <Text style={{fontSize: 17}}>{'に同意します。'}</Text>
                                </View>
                            </View>
                            <Spacer />
                            <View style={{marginLeft:30, flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleChange('privacyPolicy')(!agreePrivacyPolicy)
                                        setAgreePrivacyPolicy(!agreePrivacyPolicy)
                                    }}>
                                    {agreePrivacyPolicy
                                        ?
                                        <Image
                                        style={styles.imagebutton}
                                        source={require('../../assets/images/checked.png')}
                                        />
                                        :
                                        <View style={styles.box}></View>
                                    }
                                </TouchableOpacity>
                                <View style={styles.buttontext}>
                                    <Text　
                                        style={{color: '#0050ff', fontSize: 17}}
                                        onPress={openPrivacyPolicy}
                                        >
                                        {'プライバシーポリシー'}
                                    </Text>
                                    <Text style={{fontSize: 17}}>{'に同意します。'}</Text>
                                </View>
                            </View>
                            <Spacer />
                            <Button
                                testID={'SubmitButton'}
                                onPress={gotoEnterDetails}
                                disabled={isDisabled}
                                text={t`同意する`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                        </View>
                    );
                }}
            </Formik>
        </Page>
    );
};

const styles = StyleSheet.create({
    text: {
        marginRight:'auto', 
        marginLeft:'auto', 
        marginTop:'auto', 
        marginBottom:'auto' 
    },
    imagebutton: {
        width: 30,
        height: 30, 
    },
    buttontext: {
        marginLeft:15, 
        marginTop:'auto',
        marginBottom:'auto',
        flexDirection: 'row' 
    },
    box: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#aaaaaa',
        justifyContent: "center",
        alignItems: "center",
        marginTop:'auto', 
        marginBottom:'auto', 
      },
});

const AgreementPageWithNavigation = withNavigation(AgreementPage);

// @ts-ignore
AgreementPageWithNavigation.path = 'agreement'; //override path for better web URLs

// @ts-ignore
AgreementPageWithNavigation.navigationOptions = createNavigationOptions(
    i18n.t('AgreementPage::同意事項'),
    null,
    { hideHeaderOnDesktop: false },
    true
);

export default AgreementPageWithNavigation;
