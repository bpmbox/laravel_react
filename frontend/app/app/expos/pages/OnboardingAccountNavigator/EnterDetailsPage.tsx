import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import assign from 'lodash/assign';
import React, { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import * as yup from 'yup';
import { createNavigationOptions } from '../../components/Navigation/NavButtons';
import ImagePicker from '../../components/UIKit/ImagePicker';
import Button from '../../components/UIKit/items/Button';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import SimpleListItem from '../../components/UIKit/items/SimpleListItem';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Page from '../../components/UIKit/Layout/Page';
import routes from '../../routes';
import { ItemWidth } from '../../theme.style';
import messageService from '../../services/message';
import userService from '../../services/user';
import AuthStore from '../../store/auth';
import { UserPurpose } from '../../types/enums';

const EnterDetailsPage = (props: any) => {
    const { currentUser } = AuthStore.useContainer();
    const [selectedUser, setSelectedUser] = useState(null);
    const navigation = props.navigation;
    const { t } = useTranslation('EnterDetailsPage');

    const choices = [
        { title: t`Personal use`, id: UserPurpose.PERSONAL },
        { title: t`My company`, id: UserPurpose.COMPANY },
        { title: t`My building or portfolio`, id: UserPurpose.BUILDING },
        { title: t`My community`, id: UserPurpose.COMMUNITY },
        { title: t`Something else`, id: UserPurpose.SOMETHING_ELSE },
    ];

    const validationSchema = yup.object().shape({
        givenName: yup.string().required(t`First name is required.`),
        familyName: yup.string().required(t`Last name is required.`),
        usage: yup.string().required(
            t('Please select what you will use {{product}} for.', {
                product: t`Brand::Tree`,
            })
        ),
    });

    interface ProfileFormValues {
        givenName: string;
        familyName: string;
        avatarUrl?: string;
        usage: string;
    }

    const handleFormSubmit = async (
        values: ProfileFormValues,
        actions: FormikActions<ProfileFormValues>
    ): Promise<void> => {
        actions.setSubmitting(false);
        Keyboard.dismiss();
        try {
            await userService.registerAccountUser({
                givenName: values.givenName,
                familyName: values.familyName,
                purpose: values.usage,
                avatarUrl: values.avatarUrl,
            });
            navigation.navigate(routes.ONBOARDING_SPACE);
        } catch (err) {
            console.error('Error occurred while registration.', err);
            messageService.sendError(t`An error occurred while setting up your profile.`);
        }
    };

    const INITIAL_VALUES: ProfileFormValues = { givenName: '', familyName: '', usage: '' };
    const initialValues: ProfileFormValues = assign(INITIAL_VALUES, currentUser);

    const onSelect = useCallback(id => {
        setSelectedUser(id);
    }, []);

    return (
        <Page scrollable>
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                isInitialValid={() => validationSchema.isValidSync(initialValues)}
                onSubmit={handleFormSubmit}>
                {(formikProps: FormikProps<ProfileFormValues>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                    } = formikProps;

                    const isDisabled = !isValid || isSubmitting;

                    return (
                        <View>
                            <ImagePicker
                                allowSelection
                                profile
                                round
                                includeButton
                                buttonTitle={t`Set Photo`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                                onUploaded={(fileUrl: string) => {
                                    setFieldValue('avatarUrl', fileUrl);
                                }}
                            />
                            {currentUser && currentUser.email && (
                                <SectionHeading
                                    text={currentUser.email}
                                    desktopWidth={ItemWidth.narrow}
                                    desktopCenterItem={true}
                                />
                            )}
                            <SingleLineInput
                                testID={'GivenNameInput'}
                                onChangeText={handleChange('givenName')}
                                onBlur={handleBlur('givenName')}
                                value={values.givenName}
                                placeholder={t`First name`}
                                autoFocus
                                returnKeyType="next"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="words"
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                            <SingleLineInput
                                testID={'FamilyNameInput'}
                                onChangeText={handleChange('familyName')}
                                onBlur={handleBlur('familyName')}
                                value={values.familyName}
                                placeholder={t`Last name`}
                                returnKeyType="next"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="words"
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                            <SectionHeading
                                text={t`What will you use Tree for?`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />
                            {choices.map(({ title, id }) => (
                                <SimpleListItem
                                    testID={`ReasonSelection_${id}`}
                                    key={id}
                                    text={title}
                                    checked={selectedUser === id}
                                    desktopWidth={ItemWidth.narrow}
                                    desktopCenterItem={true}
                                    onPress={() => {
                                        onSelect(id);
                                        handleChange('usage')(id);
                                    }}
                                />
                            ))}
                            <Spacer />
                            <Button
                                testID={'SubmitButton'}
                                onPress={() => handleSubmit()}
                                disabled={isDisabled}
                                text={t`Next`}
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

const EnterDetailsPageWithNavigation = withNavigation(EnterDetailsPage);

// @ts-ignore
EnterDetailsPageWithNavigation.path = 'details'; //override path for better web URLs

// @ts-ignore
EnterDetailsPageWithNavigation.navigationOptions = createNavigationOptions(
    null,
    null,
    { hideHeaderOnDesktop: true },
    false
);

export default EnterDetailsPageWithNavigation;
