import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import * as yup from 'yup';
import ImagePicker from '../../components/UIKit/ImagePicker';
import Button from '../../components/UIKit/items/Button';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { slugBlacklist } from '../../libs/space-validators/slug-blacklist';
import { PARAM_SPACE } from '../../constants';
import routes from '../../routes';
import { ItemWidth } from '../../theme.style';
import spaceService from '../../services/space';
import AuthStore from '../../store/auth';

const CreatePage = (props: { navigation: any; }) => {
    const { navigation } = props;
    const { t } = useTranslation('CreatePage');
    const {currentUser} = AuthStore.useContainer();
    const [slugError, setSlugError] = useState<string | null>(null);

    const validationSchema = yup.object().shape({
        spaceIcon: yup.string(),
        spaceName: yup.string().required(t`Space name is required.`),
        spaceUrl: yup.string()
            .lowercase()
            .matches(/^([\w-_])+$/, t`Only valid URL characters allowed.`)
            .notOneOf(slugBlacklist),
    });

    type SpaceFormValues = {
        spaceName: string;
        spaceUrl?: string;
        spaceIcon?: string;
    };

    const handleSubmit = async (values: SpaceFormValues, actions: FormikActions<SpaceFormValues>): Promise<void> => {
        setSlugError(null);
        Keyboard.dismiss();
        try {
            const space = await spaceService.createSpace(values.spaceName, values.spaceUrl, values.spaceIcon);

            // Redirect to created space
            navigation.navigate(routes.MAIN_SPACE_REDIRECT, { [PARAM_SPACE]: space });
        } catch (e) {
            // TODO: use Error code.
            if (e.message === 'SpaceSlugAlreadyExists') {
                setSlugError(t`Already taken.`)
            } else {
                console.error(e);
                setSlugError(t`Unable to validate your space url.`);
            }
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Page scrollable>
            <Formik
                validationSchema={validationSchema}
                initialValues={{spaceName: '', spaceUrl: ''}}
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<SpaceFormValues>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue
                    } = formikProps;

                    return (
                        <View>
                            <Text
                                text={t`A space is where your community comes to life. You can create or join other spaces later.`}
                                light
                                small
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                                />
                            <ImagePicker
                                allowSelection
                                space
                                includeButton
                                buttonTitle={t`Set Logo`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                                onUploaded={(fileUrl: string) => {
                                    setFieldValue('spaceIcon', fileUrl);
                                }}/>
                            <SectionHeading
                                text={t`Space name`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true} />
                            <SingleLineInput
                                testID={'SpaceNameInput'}
                                onChangeText={handleChange('spaceName')}
                                onBlur={handleBlur('spaceName')}
                                value={values.spaceName}
                                placeholder={t('E.g. company name')}
                                autoFocus
                                returnKeyType='next'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='words'
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true} />
                            <SectionHeading
                                text={t`Space domain`}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}/>
                            <SingleLineInput
                                testID={'SpaceUrlInput'}
                                onChangeText={handleChange('spaceUrl')}
                                onBlur={handleBlur('spaceUrl')}
                                value={values.spaceUrl}
                                inputLegend='withtree.com/'
                                placeholder={t('URL')}
                                returnKeyType='go'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='none'
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}/>

                            { slugError  &&
                                <Text
                                    text={slugError}
                                    danger
                                    small
                                    desktopWidth={ItemWidth.narrow}
                                    desktopCenterItem={true} />
                            }
                            <Spacer />
                            <Text
                                text={t`Invite people to join the space by sharing this link.`}
                                light
                                small
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}/>
                            <Spacer />
                            <Button
                                testID={'SubmitButton'}
                                onPress={() => handleSubmit()}
                                disabled={!isValid || isSubmitting}
                                text={t('Create Space')}
                                desktopWidth={ItemWidth.narrow}
                                desktopCenterItem={true}
                            />

                            {currentUser && currentUser.email &&
                                (
                                <>
                                    <Spacer />
                                    <Text
                                        text={t('Using account: {{email}}', { email: currentUser.email })}
                                        light
                                        small
                                        desktopWidth={ItemWidth.narrow}
                                        desktopCenterItem={true}
                                        />
                                </>
                                )
                            }
                        </View>
                    )
                }}
            </Formik>
        </Page>
    );
};

CreatePage.navigationOptions = {
    title: i18n.t('CreatePage::Create a Space'),
}

// @ts-ignore
CreatePage.path = 'create'; //override path for better web URLs

export default withNavigation(CreatePage);
