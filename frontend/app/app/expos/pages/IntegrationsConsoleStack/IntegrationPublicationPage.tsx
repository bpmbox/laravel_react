import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import historyService from '../../services/history';
import messageService from '../../services/message';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Divider from '../../components/UIKit/items/Divider';
import Text from '../../components/UIKit/items/Text';
import Page from '../../components/UIKit/Layout/Page';
import routes from '../../routes';
import i18n from '../../i18n';
import Select from '../../components/UIKit/items/Select';
import SimpleListButton from '../../components/UIKit/items/SimpleListButton';
import integrationService from '../../services/integration';
import find from 'lodash/find';
import MultilineSubtitle from '../../components/UIKit/items/MultilineSubtitle';
import { takeChanges } from '../../libs/integrations';
import { PaddingType } from '../../theme.style';
import useDebouncedState from '../../libs/use-debounced-state';
import { useState } from 'react';

type IntegrationPublicationPageProps = {
    integration: NSIntegration.Integration;
    config: NSIntegration.Config;
};

const descriptionForAccessType = access => {
    switch (access.codename) {
        case 'published':
            return i18n.t(
                'IntegrationPublicationPage::The integration is available for everyone to install from the Marketplace.'
            );
        case 'restricted':
            return i18n.t(
                'IntegrationPublicationPage::The integration is available only to spaces that you designate.'
            );
        case 'unpublished':
            return i18n.t(
                'IntegrationPublicationPage::Only you can access the integration. It does not appear on the Marketplace.'
            );
    }
    return '';
};

const IntegrationPublicationPage: FunctionComponent<IntegrationPublicationPageProps> = props => {
    const { t } = useTranslation('IntegrationPublicationPage');
    const { integration, config } = props;
    // Debounced state without a maxWait is used on refreshing the integrration view
    // to prevent updating values while the user is still editing.
    const [currentIntegration, setCurrentIntegration] = useState<
        NSIntegration.Integration
    >(integration);
    const [changes, setChanges] = useDebouncedState<IntegrationFormValues>(
        null,
        500
    );

    type IntegrationFormValues = {
        access: string;
        restrictedSpaces: Space[];
    };

    const intialValues = {
        access: currentIntegration.access,
        restrictedSpaces: currentIntegration.restrictedSpaces,
    };

    // Observe debounced changes
    useEffect(() => {
        if (!changes) {
            return;
        }
        (async () => {
            try {
                const newChanges = takeChanges(changes, intialValues);
                const updatedIntegration = await integrationService.updateIntegration(
                    currentIntegration.id,
                    newChanges
                );
                setCurrentIntegration(updatedIntegration);
                messageService.sendSuccess(t`Changes saved.`);
            } catch (err) {
                messageService.sendError(t`Error updating integration.`);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changes]);

    // -- Input Handlers --

    const handleSubmitForm = (
        values: IntegrationFormValues,
        _actions: FormikActions<IntegrationFormValues>
    ): void => {
        setChanges(values);
    };

    const handleSetRestrictedSpaces = async (spaces: Space[]) => {
        try {
            const newChanges = {
                restrictedSpaceSlugs: spaces.map(space => space.slug),
            };
            const updatedIntegration = await integrationService.updateIntegration(
                currentIntegration.id,
                newChanges
            );
            setCurrentIntegration(updatedIntegration);
        } catch (err) {
            messageService.sendError(t`Error updating integration.`);
        }
    };

    const onSpaceSelectPress = () => {
        historyService.push(routes.INTEGRATIONS_CONSOLE_SELECT_SPACES, {
            restrictedSpaces: currentIntegration.restrictedSpaces,
            onFinish: handleSetRestrictedSpaces,
        });
    };

    const selectedAccess = find(config.accessChoices, c => {
        return c.codename === currentIntegration.access;
    });
    const isRestricted = selectedAccess.codename === 'restricted';
    const hasRestrictedSpaces =
        currentIntegration.restrictedSpaces &&
        currentIntegration.restrictedSpaces.length > 0;
    const restrictedSpacesButtonLabel = hasRestrictedSpaces
        ? currentIntegration.restrictedSpaces
              .map(space => space.name)
              .join(', ')
        : t`Select Spaces`;

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <Formik
                initialValues={intialValues}
                enableReinitialize
                isInitialValid
                onSubmit={handleSubmitForm}>
                {(
                    formikProps: FormikProps<IntegrationFormValues>
                ): ReactNode => {
                    const { handleSubmit, handleChange } = formikProps;
                    return (
                        <>
                            <SectionHeading text={t`Access`} />
                            <Select
                                title={t`Select Access Type`}
                                actionTitle={t`Select access type`}
                                values={config.accessChoices}
                                currentSelection={
                                    selectedAccess ? [selectedAccess] : []
                                }
                                titleRenderer={access => access.label}
                                itemRenderer={(
                                    access,
                                    selected,
                                    _disabled,
                                    itemProps
                                ) => {
                                    return (
                                        <MultilineSubtitle
                                            title={access.label}
                                            subtitle={descriptionForAccessType(
                                                access
                                            )}
                                            checked={selected}
                                            {...itemProps}
                                        />
                                    );
                                }}
                                onItemSelected={(access: {
                                    codename: string;
                                }) => {
                                    handleChange('access')(access.codename);
                                    // Called in next promise cycle to allow validation to resolve.
                                    setImmediate(handleSubmit);
                                }}
                            />
                            {isRestricted && (
                                <>
                                    <SectionHeading
                                        text={t`Restricted to spaces`}
                                    />
                                    <Text
                                        text={t`The integration will be accessible only on these spaces.`}
                                        small
                                        light
                                    />
                                    <SimpleListButton
                                        text={restrictedSpacesButtonLabel}
                                        onPress={onSpaceSelectPress}
                                    />
                                </>
                            )}
                            <Divider middle />
                            <Text
                                text={t`[Learn more about Marketplace access](https://treedocs.now.sh/docs/v1/getting-started/)`}
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

export default withNavigation(IntegrationPublicationPage);
