import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import defaultTo from 'lodash/defaultTo';
import find from 'lodash/find';
import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Category, categoryFromCodename, categoryIcon, categoryName, takeChanges } from '../../libs/integrations';
import { setSecretNavigationVar } from '../../libs/secret-nav-var';
import useDebouncedState from '../../libs/use-debounced-state';
import useElementMountedRef from '../../libs/use-element-mounted-ref';
import alertService from '../../services/alert';
import integrationService from '../../services/integration';
import messageService from '../../services/message';
import ImagePicker from '../../components/UIKit/ImagePicker';
import Divider from '../../components/UIKit/items/Divider';
import MultilineInput from '../../components/UIKit/items/MultilineInput';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Select from '../../components/UIKit/items/Select';
import SimpleListButton from '../../components/UIKit/items/SimpleListButton';
import SimpleListItem from '../../components/UIKit/items/SimpleListItem';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Page from '../../components/UIKit/Layout/Page';
import historyService from '../../services/history';
import FullPageLoading from '../General/FullPageLoading';
import { integrationGeneralSettingsValidationSchema } from './CreateIntegrationPage';
import { PaddingType, ItemHeight } from '../../theme.style';

type IntegrationGeneralPageProps = {
    integration: NSIntegration.Integration;
    config: NSIntegration.Config;
} & NavigationInjectedProps;

type IntegrationFormValues = {
    name: string;
    logo: string;
    shortDesc: string;
    fullDesc: string;
    category: string;
};

const IntegrationGeneralPage: FunctionComponent<IntegrationGeneralPageProps> = props => {
    // -- Props --
    const { t } = useTranslation('IntegrationGeneralPage');
    const { integration, config } = props;

    // -- State --
    const [currentIntegration, setCurrentIntegration] = useState<NSIntegration.Integration>(integration);
    const [changes, setChanges] = useDebouncedState<NSIntegration.UpdateIntegrationParams>(null, 500);
    // tracks queued complete changes.
    const completedChangesRef = useRef<NSIntegration.Integration>(null);
    // Element mounted ref for use of updating title as we edit.
    const mountedRef = useElementMountedRef();

    // -- Computed Values --
    const selectedCategory = find(config.categoryChoices, c => c.codename === currentIntegration.category);

    const {name, logo, shortDesc, fullDesc, category} = currentIntegration;
    const initialValues = {name, logo, shortDesc, fullDesc, category};

    // Observer on debounced form changes
    useEffect(() => {
        if (!changes) {
            return;
        }

        const newChanges = takeChanges(changes, initialValues);
        (async () => {
            messageService.sendMessage(t`Saving changes.`);
            try {
                const updatedIntegration = await integrationService.updateIntegration(
                    currentIntegration.id,
                    newChanges
                );

                const isTextChange =
                    !!newChanges.hasOwnProperty('name') ||
                    newChanges.hasOwnProperty('shortDesc') ||
                    newChanges.hasOwnProperty('fullDesc');

                if (isTextChange) {
                    // If this is a text input, defer refreshing the form until user
                    // unfocus so they don't get interrupted while typing.
                    completedChangesRef.current = updatedIntegration;
                } else {
                    // If not a text control, user probably is not typing,
                    // go ahead and apply the change immediately.
                    setCurrentIntegration(updatedIntegration);
                }

                messageService.sendSuccess(t`Changes saved.`);

                setSecretNavigationVar(props.navigation, 'integrationName', updatedIntegration.name, mountedRef);
            } catch (err) {
                console.error('Unable to save changes', err);
                messageService.sendError(t`Error updating integration.`);

                // reset form changes on blur if we have error saving.
                completedChangesRef.current = currentIntegration;
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changes]);

    // This get called on form changes.  We'll use the values to update the debounced state.
    const handleUpdatedValues = (values: IntegrationFormValues, _actions: FormikActions<IntegrationFormValues>) => {
        setChanges(values);
    };

    const customValidator = async (values: object) => {
        try {
            await integrationGeneralSettingsValidationSchema.validate(values);
        } catch (err) {
            console.debug('IntegrationGeneralPage: Form error', err);
            messageService.sendError(t('Invalid input.'));
        }
    };

    const onDeletePress = () => {
        alertService.alert(
            t('Delete {{integrationName}}?', {
                integrationName: currentIntegration.name,
            }),
            t('The integration will no longer be available to any user.'),
            [
                { text: t`Cancel`, style: 'cancel' },
                {
                    text: t`Delete`,
                    style: 'destructive',
                    onPress: handleDeleteIntegration,
                },
            ],
            true
        );
    };

    const handleDeleteIntegration = async () => {
        try {
            await integrationService.deleteIntegration(currentIntegration.id);
            historyService.goBack();
            messageService.sendError(t`The installation has been deleted.`);
        } catch (err) {
            messageService.sendError(
                t('An error occurred: {{deleteIntegrationError}}', {
                    deleteIntegrationError: err,
                })
            );
        }
    };

    // -- Render --
    if (!currentIntegration) {
        return <FullPageLoading />;
    }

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <Formik
                validate={customValidator}
                validationSchema={integrationGeneralSettingsValidationSchema}
                initialValues={initialValues}
                enableReinitialize
                isInitialValid
                onSubmit={handleUpdatedValues}>
                {(formikProps: FormikProps<IntegrationFormValues>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        touched,
                        resetForm,
                        errors,
                    } = formikProps;

                    const wrappedOnBlur = (field: string) => {
                        return (evt: NativeSyntheticEvent<TargetedEvent>) => {
                            handleBlur(field)(evt);

                            // On field blur, check if we have updates we need to
                            // apply to the form.
                            if (completedChangesRef.current === null) {
                                // if we unfocus while there is a field error, reset
                                // this field.
                                if (touched[field] && errors[field]) {
                                    resetForm();
                                }
                                return;
                            }

                            setCurrentIntegration(completedChangesRef.current);
                            completedChangesRef.current = null;
                        };
                    };

                    return (
                        <>
                            <ImagePicker
                                integration
                                includeButton
                                allowSelection
                                buttonTitle={values.logo ? t`Change Icon` : t`Set Icon`}
                                imageUrl={values.logo || ''}
                                onUploaded={(fileUrl: string) => {
                                    setFieldValue('logo', fileUrl);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                            />
                            <SectionHeading text={t`Name`} />
                            <SingleLineInput
                                text={t`Name`}
                                onChangeText={evt => {
                                    handleChange('name')(evt);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                                onBlur={wrappedOnBlur('name')}
                                value={values.name}
                                placeholder={t`Enter a name`}
                                returnKeyType="next"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="words"
                            />
                            <SectionHeading text={t`Short Description`} />
                            <SingleLineInput
                                text={t`Short description`}
                                onChangeText={evt => {
                                    handleChange('shortDesc')(evt);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                                onBlur={wrappedOnBlur('shortDesc')}
                                value={values.shortDesc}
                                placeholder={t`Enter a short description`}
                                returnKeyType="next"
                                autoCorrect={true}
                                spellCheck={true}
                                autoCapitalize="sentences"
                            />
                            <SectionHeading text={t`Full Description`} />
                            <MultilineInput
                                text={t`Full description`}
                                onChangeText={evt => {
                                    handleChange('fullDesc')(evt);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                                onBlur={wrappedOnBlur('fullDesc')}
                                value={values.fullDesc}
                                placeholder={t`Enter full description`}
                                returnKeyType="next"
                                autoCorrect={true}
                                spellCheck={true}
                                autoCapitalize="sentences"
                            />
                            <SectionHeading text={t`Category`} />
                            <Select
                                title={t`Select a Category`}
                                actionTitle={t`Select a category`}
                                values={config.categoryChoices}
                                currentSelection={selectedCategory ? [selectedCategory] : []}
                                titleRenderer={category =>
                                    categoryName(
                                        defaultTo(categoryFromCodename(category.codename), Category.productivity)
                                    )
                                }
                                itemRenderer={(category, selected, _disabled, itemProps) => {
                                    const c = defaultTo(categoryFromCodename(category.codename), Category.productivity);
                                    return (
                                        <SimpleListItem
                                            text={categoryName(c)}
                                            iconId={categoryIcon(c)}
                                            checked={selected}
                                            {...itemProps}
                                        />
                                    );
                                }}
                                onItemSelected={category => {
                                    handleChange('category')(category.codename);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                            />
                            <Divider middle />
                            <SectionHeading text={t`Danger Zone`} />
                            <SimpleListButton text={t`Delete Integration`} danger onPress={onDeletePress} />
                            <Spacer height={ItemHeight.xsmall} />
                        </>
                    );
                }}
            </Formik>
        </Page>
    );
};

export default withNavigation(IntegrationGeneralPage);
