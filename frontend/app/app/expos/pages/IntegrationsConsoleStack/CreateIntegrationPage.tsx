import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import defaultTo from 'lodash/defaultTo';
import find from 'lodash/find';
import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getModalHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import ImagePicker from '../../components/UIKit/ImagePicker';
import Button from '../../components/UIKit/items/Button';
import MultilineInput from '../../components/UIKit/items/MultilineInput';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Select from '../../components/UIKit/items/Select';
import SimpleListItem from '../../components/UIKit/items/SimpleListItem';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { Category, categoryFromCodename, categoryIcon, categoryName } from '../../libs/integrations';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import routes from '../../routes';
import historyService from '../../services/history';
import integrationService from '../../services/integration';
import messageService from '../../services/message';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../theme.style';

export const integrationGeneralSettingsValidationSchema = yup.object().shape({
    name: yup.string().required(),
    logo: yup.string().required(),
    shortDesc: yup.string().required(i18n.t('CreateIntegrationPage::Short description is required.')).min(10, i18n.t('CreateIntegrationPage::Short description should be at least 10 characters.')).max(100, i18n.t('CreateIntegrationPage::Short description should be at most 100 characters.')),
    fullDesc: yup.string().required(i18n.t('CreateIntegrationPage::Full description is required.')).min(10, i18n.t('CreateIntegrationPage::Full description should be at least 10 characters.')).max(400, i18n.t('CreateIntegrationPage::Full description should be at most 400 characters.')),
    category: yup.string().required(),
});

const CreateIntegrationPage: FunctionComponent<any> = (props) => {
    const { t } = useTranslation('CreateIntegrationPage');
    const { navigation } = props;
    const [config, setConfig] = useState<NSIntegration.Config>({ categoryChoices: [], typeChoices: [], accessChoices: [], defaultPermissionChoices: [] });

    type IntegrationFormValues = {
        name: string;
        logo: string;
        shortDesc: string;
        fullDesc: string;
        category: string;
    };

    const intialValues = { name: '', logo: '', shortDesc: '', fullDesc: '', category: '' };

    const handleSubmit = async (values: IntegrationFormValues, actions: FormikActions<IntegrationFormValues>): Promise<void> => {
        try {
            await integrationService.createIntegration({
                name: values.name,
                logo: values.logo,
                shortDesc: values.shortDesc,
                fullDesc: defaultTo(values.fullDesc, ""),
                category: values.category,
                type: 'native',
                // TODO: replace
                url: 'https://tree-contentful-integration.now.sh',
                access: 'unpublished',
                permissions: ['can_view'],
                restrictedSpaceSlugs: []
            });
            messageService.sendSuccess(t`Integration created.`);
            navigation.goBack()
        } catch (err) {
            messageService.sendError(t`Error creating integration.`);
        } finally {
            actions.resetForm();
        }
    }

    const loadConfig = async () => {
        try {
            const config = await integrationService.getConfig();
            setConfig(config);
        } catch (err) {}
    };

    useEffect(() => {
        loadConfig()
    }, []);

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <Formik
                validationSchema={integrationGeneralSettingsValidationSchema}
                initialValues={intialValues}
                enableReinitialize
                onSubmit={handleSubmit}>
                {(formikProps: FormikProps<IntegrationFormValues>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue
                    } = formikProps;

                    const selectedCategory = find(config.categoryChoices, (c) => c.codename === values.category);

                    return (
                        <>
                            <SectionHeading text={t`Name`} />
                            <SingleLineInput
                                text={t`Name`}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                placeholder={t`Enter a name`}
                                returnKeyType='next'
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='words' />
                            <SectionHeading text={t`Icon`} />
                            <ImagePicker integration includeButton allowSelection buttonTitle={values.logo ? t`Change Icon` : t`Set Icon`} imageUrl={values.logo || ''} onUploaded={(fileUrl: string) => {
                                setFieldValue('logo', fileUrl);
                            }}/>
                            <SectionHeading text={t`Short Description`} />
                            <SingleLineInput
                                text={t`Short description`}
                                onChangeText={handleChange('shortDesc')}
                                onBlur={handleBlur('shortDesc')}
                                value={values.shortDesc}
                                placeholder={t`Enter a short description`}
                                returnKeyType='next'
                                autoCorrect={true}
                                spellCheck={true}
                                autoCapitalize='sentences' />
                            <Text text={t`At least 10 chars, at most 100.`} light mini />
                            <SectionHeading text={t`Full Description`} />
                            <MultilineInput
                                text={t`Full description`}
                                onChangeText={handleChange('fullDesc')}
                                onBlur={handleBlur('fullDesc')}
                                value={values.fullDesc}
                                placeholder={t`Enter full description`}
                                returnKeyType='next'
                                autoCorrect={true}
                                spellCheck={true}
                                autoCapitalize='sentences' />
                            <SectionHeading text={t`Category`} />
                            <Select
                                modalRoute={routes.ITEM_PICKER}
                                title={t`Select a Category`}
                                actionTitle={t`Select a category`}
                                values={config.categoryChoices}
                                currentSelection={selectedCategory ? [selectedCategory] : []}
                                titleRenderer={(category) => categoryName(defaultTo(categoryFromCodename(category.codename), Category.productivity)) }
                                itemRenderer={(category, selected, disabled, props) => {
                                    const c = defaultTo(categoryFromCodename(category.codename), Category.productivity);
                                    return <SimpleListItem text={categoryName(c)} iconId={categoryIcon(c)} checked={selected} {...props} />
                                }}
                                onItemSelected={(category) => handleChange('category')(category.codename)}
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button text={t`Create Integration`} onPress={() => handleSubmit()} disabled={!isValid || isSubmitting} />
                            <Spacer height={ItemHeight.xsmall} />
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
        title: i18n.t('CreateIntegrationPage::New Integration'),
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: true,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel)
    }
};

// @ts-ignore
CreateIntegrationPage.navigationOptions = navigationOptions;

export default withNavigation(CreateIntegrationPage);
