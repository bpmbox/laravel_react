import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, {
    FunctionComponent,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import {
    MANDATORY_PERMISSION,
    takeChanges,
} from '../../libs/integrations';
import useDebouncedState from '../../libs/use-debounced-state';
import integrationService from '../../services/integration';
import messageService from '../../services/message';
import { Spacer } from '../../components/integration';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Select from '../../components/UIKit/items/Select';
import SimpleListItem from '../../components/UIKit/items/SimpleListItem';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import { PaddingType } from '../../theme.style';

type IntegrationConfigurationPageProps = {
    integration: NSIntegration.Integration;
    config: NSIntegration.Config;
} & NavigationInjectedProps;

type IntegrationFormValues = {
    uiHook: string;
    permissions: string[];
};

const IntegrationConfigurationPage: FunctionComponent<IntegrationConfigurationPageProps> = props => {
    const { t } = useTranslation('IntegrationConfigurationPage');
    const { integration, config } = props;
    const [currentIntegration, setCurrentIntegration] = useState<
        NSIntegration.Integration
    >(integration);
    // Tracks current changes in the form.
    const [changes, setChanges] = useDebouncedState(null, 500);
    // tracks queued complete changes.
    const completedChangesRef = useRef<NSIntegration.Integration>(null);

    const intialValues = {
        uiHook: currentIntegration.uiHook,
        permissions: currentIntegration.permissions,
    };

    // -- Observers --
    // debounced form change observerr
    useEffect(() => {
        if (!changes) {
            return;
        }

        (async () => {
            try {
                let newChanges = takeChanges(changes, intialValues);
                if ('permissions' in changes) {
                    // Always append the can_view permission (hidden to the user)
                    newChanges = {
                        ...newChanges,
                        permissions: [
                            MANDATORY_PERMISSION.codename,
                            ...changes.permissions.filter(
                                (p: string) =>
                                    p !== MANDATORY_PERMISSION.codename
                            ),
                        ],
                    };
                }
                const updatedIntegration = await integrationService.updateIntegration(
                    currentIntegration.id,
                    newChanges
                );

                const isTextChange = !!newChanges.hasOwnProperty('uiHook');
                                      
                if (isTextChange) {
                    // If this is a text input, defer refreshing the form until user
                    // unfocus so they don't get interrupted while typing.
                    completedChangesRef.current = updatedIntegration;
                } else {
                    // If not a text control, user probably is not typing,
                    // go ahead and apply the change.
                    setCurrentIntegration(updatedIntegration);
                }

                messageService.sendSuccess(t`Changes saved.`);
            } catch (err) {
                messageService.sendError(t`Error updating integration.`);

                // reset form changes on blur if we have error saving.
                completedChangesRef.current = currentIntegration;
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changes]);

    // -- Form Handlers --
    const handleFromSubmit = (
        values: IntegrationFormValues,
        _actions: FormikActions<IntegrationFormValues>
    ): void => {
        setChanges(values);
    };

    const selectedPermissions = config.defaultPermissionChoices.filter(
        permission =>
            currentIntegration.permissions.includes(permission.codename)
    );

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <Formik
                initialValues={intialValues}
                enableReinitialize
                isInitialValid
                onSubmit={handleFromSubmit}>
                {(
                    formikProps: FormikProps<IntegrationFormValues>
                ): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        errors,
                        touched,
                        resetForm,
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

                            setCurrentIntegration(
                                completedChangesRef.current
                            );
                            completedChangesRef.current = null;

                        };
                    };

                    return (
                        <>
                            <SectionHeading text={t`UI Hook`} />
                            <SingleLineInput
                                onChangeText={evt => {
                                    handleChange('uiHook')(evt);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                                onBlur={wrappedOnBlur('uiHook')}
                                value={values.uiHook}
                                placeholder={t`Enter URL`}
                                returnKeyType="go"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="words"
                            />
                            <Text
                                text={t`[Learn more about Hooks](https://treedocs.now.sh/docs/v1/hooks/introduction/)`}
                                small
                                light
                                markdown
                            />
                            <SectionHeading text={t`Permissions`} />
                            <Select
                                title={t`Select Permissions`}
                                actionTitle={t`Select permissions`}
                                multi
                                values={config.defaultPermissionChoices.filter(
                                    p =>
                                        p.codename !==
                                        MANDATORY_PERMISSION.codename
                                )}
                                currentSelection={selectedPermissions}
                                headerRenderer={() => (
                                    <>
                                        <Text
                                            text={t`If your integration requires fine-level access control, you can use permissions. Select the permissions that users can be granted to access your integration.`}
                                            small
                                            light
                                        />
                                        <Spacer />
                                    </>
                                )}
                                titleRenderer={permission => permission.label}
                                itemRenderer={(
                                    permission,
                                    selected,
                                    _disabled,
                                    itemProps
                                ) => {
                                    return (
                                        <SimpleListItem
                                            text={permission.label}
                                            checked={selected}
                                            {...itemProps}
                                        />
                                    );
                                }}
                                onSelectionChange={permissions => {
                                    handleChange('permissions')(
                                        permissions.map(
                                            permission => permission.codename
                                        )
                                    );
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                            />
                            <Text
                                text={t`[Learn more about Permissions](https://treedocs.now.sh/docs/v1/advanced/permissions/)`}
                                small
                                light
                                markdown
                            />
                        </>
                    );
                }}
            </Formik>
        </Page>
    );
};

export default withNavigation(IntegrationConfigurationPage);
