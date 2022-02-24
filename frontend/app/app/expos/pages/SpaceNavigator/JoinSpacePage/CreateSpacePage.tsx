// TODO: Figure out how to reuse OnboardingSpacePage/CreatePage - I just made a copy to get around compile errors. - DL
import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import * as yup from 'yup';
import { getModalHeader, ModalButtonType } from '../../../components/Navigation/NavButtons';
import ImagePicker from '../../../components/UIKit/ImagePicker';
import Button from '../../../components/UIKit/items/Button';
import SectionHeading from '../../../components/UIKit/items/SectionHeading';
import SingleLineInput from '../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../components/UIKit/items/Spacer';
import Text from '../../../components/UIKit/items/Text';
import Page from '../../../components/UIKit/Layout/Page';
import i18n from '../../../i18n';
import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { slugBlacklist } from '../../../libs/space-validators/slug-blacklist';
import { PARAM_SPACE } from '../../../constants';
import routes from '../../../routes';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../theme.style';
import historyService from '../../../services/history';
import spaceService from '../../../services/space';
import AuthStore from '../../../store/auth';

const CreateSpacePage = (props: any) => {
    const { t } = useTranslation('CreateSpacePage');
    const { navigation } = props;
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

        try {
            const space = await spaceService.createSpace(values.spaceName, values.spaceUrl, values.spaceIcon);

            // Redirect to created space.
            navigation.navigate(routes.MAIN_SPACE_REDIRECT, {
                [PARAM_SPACE]: space,
                key: space.slug,
            });
        } catch (e) {
            // TODO: use Error code.
            if (e.message === 'SpaceSlugAlreadyExists') {
                setSlugError(t`Already taken.`);
            } else {
                console.error(e);
                setSlugError(t`Unable to validate your space domain.`);
            }
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
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
                            <Text text={t`A space is where your community comes to life. You can create or join other spaces later.`} light small />
                            <ImagePicker space allowSelection includeButton buttonTitle={t`Set Logo`} onUploaded={(fileUrl: string) => {
                                setFieldValue('spaceIcon', fileUrl);
                            }}/>
                            <SectionHeading text={t`Space name`} />
                            <SingleLineInput
                                testID='SpaceNameInput'
                                onChangeText={handleChange('spaceName')}
                                onBlur={handleBlur('spaceName')}
                                value={values.spaceName}
                                placeholder={t('E.g. company name')}
                                // Only autoFocus on Native, use autoFocus on Web will lose the transition animation
                                autoFocus={Platform.OS !== 'web'}
                                returnKeyType='next'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='words' />
                            <SectionHeading text={t`Space domain`} />
                            <SingleLineInput
                                testID='SpaceUrlInput'
                                onChangeText={handleChange('spaceUrl')}
                                onBlur={handleBlur('spaceUrl')}
                                value={values.spaceUrl}
                                inputLegend='withtree.com/'
                                placeholder={t('domain')}
                                returnKeyType='go'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='none' />
                            { slugError  &&
                                <Text text={slugError} danger small />
                            }
                            <Spacer height={ItemHeight.xsmall} />
                            <Text text={t`Invite people to join the space by sharing this link.`} light small />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                testID='SubmitButton'
                                onPress={() => handleSubmit()}
                                disabled={!isValid || isSubmitting}
                                text={t('Create Space')}
                            />

                            {currentUser && currentUser.email &&
                                (
                                <>
                                    <Spacer height={ItemHeight.xsmall} />
                                    <Text text={t('Using account: {{email}}', { email: currentUser.email })} light small />
                                    <Spacer height={ItemHeight.xsmall} />
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

export const navigationOptions = ({navigation}: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('CreateSpacePage::Create a Space'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: false,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close)
    }
};

// @ts-ignore
CreateSpacePage.navigationOptions = navigationOptions;

// @ts-ignore
CreateSpacePage.path = '';

export default withNavigation(CreateSpacePage);
