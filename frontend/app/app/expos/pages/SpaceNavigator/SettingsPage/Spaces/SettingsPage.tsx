import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import * as yup from 'yup';
import { IconId } from '../../../../assets/native/svg-icons';
import ImagePicker from '../../../../components/UIKit/ImagePicker';
import Button from '../../../../components/UIKit/items/Button';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import SimpleListButton from '../../../../components/UIKit/items/SimpleListButton';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Text from '../../../../components/UIKit/items/Text';
import Page from '../../../../components/UIKit/Layout/Page';
import { PARAM_SLUG, PARAM_SPACESWITCHER_HIDE_HEADER_BUTTONS } from '../../../../constants';
import i18n from '../../../../i18n';
import { copyToClipboard } from '../../../../libs/clipboard';
import { slugBlacklist } from '../../../../libs/space-validators/slug-blacklist';
import routes from '../../../../routes';
import alertService from '../../../../services/alert';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import trackingService from '../../../../services/tracking';
import AuthStore from '../../../../store/auth';
import { ItemHeight, ItemWidth } from '../../../../theme.style';
import { isAtLeastAdmin, Role } from '../../../../types/enums';
import { SpaceContext } from '../../SpaceContext';
import { useLeaveSpaceDialog } from './SettingsPage.manager';

type SpaceFormValues = {
    spaceName: string;
    spaceUrl?: string;
    spaceIconUrl?: string | null;
};

const SpaceSettingsPage = (props: any) => {
    const { navigation } = props;
    const { t } = useTranslation('SpaceSettingsPage');
    const { currentUser } = AuthStore.useContainer();
    const { space, role } = useContext(SpaceContext);
    const [slugError, setSlugError] = useState<string | null>(null);

    const { show: showLeaveSpaceDialog } = useLeaveSpaceDialog();

    const validationSchema = yup.object().shape({
        spaceIcon: yup.string(),
        spaceName: yup.string().required(t`Space name is required.`),
        spaceUrl: yup
            .string()
            .required()
            .lowercase()
            .matches(/^([\w-_])+$/, t`Only valid URL characters allowed.`)
            .notOneOf(slugBlacklist),
    });

    const doRedirect = async () => {
        try {
            const spaces = await spaceService.getSpaces();
            if (spaces.length > 0) {
                // First navigate to Main with a different space populated.
                let navError;              
                try {
                    navigation.navigate(
                        routes.MAIN,
                        {
                            [PARAM_SLUG]: spaces[0].slug,
                        },
                        // Then navigate to space switcher so user can choose a new space.
                        NavigationActions.navigate({
                            routeName: routes.SPACE_SWITCHER,
                            params: {
                                [PARAM_SPACESWITCHER_HIDE_HEADER_BUTTONS]: true,
                            },
                        })
                    );
                } catch (err) {
                    navError = err;
                    // Swallow error during navigation.  There will be a temporarily 'slug' will be undefined when
                    // deleting or leaving a space.
                }
                
                if( historyService.currentRouteName !== routes.MAIN && navError) {
                    // Log error if we suspect the navigation did not succeed, for troubleshooting.
                    console.error('SettingsPage: Redirection to new space failed.', navError);
                }                
            } else {
                historyService.navigateAsRoot(routes.ONBOARDING_SPACE_JOIN);
            }
        } catch (err) {
            messageService.sendError(err.message);
        }
    };

    const handleDeleteSpace = async () => {
        try {
            const success = await spaceService.deleteSpace(space);
            await trackingService.removeLastVisitedSpace(currentUser.id);

            if (success) {
                messageService.sendSuccess(t('The space {{spaceName}} has been deleted.', { spaceName: space.name }));
                await doRedirect();
            } else {
                messageService.sendError(t('The space {{spaceName}} could not be deleted.', { spaceName: space.name }));
            }
        } catch (err) {
            messageService.sendError(err.message);
        }
    };

    const onLeaveSpacePress = async () => {
        await showLeaveSpaceDialog();
    };

    const onDeleteSpacePress = () => {
        // TODO: add 'Enter space name' field
        alertService.alert(
            t`Delete Space`,
            t`Deleting your space will delete all associated data, including pages and messages. This action cannot be reverted.`,
            [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Delete`, style: 'destructive', onPress: handleDeleteSpace },
            ]
        );
    };

    const handleSubmitForm = async (
        values: SpaceFormValues,
        actions: FormikActions<SpaceFormValues>
    ): Promise<void> => {
        setSlugError(null);
        Keyboard.dismiss();
        try {
            await spaceService.updateSpace({
                id: space.id,
                name: values.spaceName,
                slug: values.spaceUrl || '',
                iconUrl: values.spaceIconUrl,
            });
            messageService.sendSuccess(t`The space has been updated.`);
        } catch (e) {
            // TODO: use Error code.
            setSlugError(t`Already taken`);
        } finally {
            actions.setSubmitting(false);
        }
    };

    const onCopyPress = async domain => {
        copyToClipboard(`https://withtree.com/${domain}`);
        messageService.sendSuccess(t`Link copied to clipboard!`);
    };

    const initialValues: SpaceFormValues = { spaceName: space.name, spaceUrl: space.slug, spaceIconUrl: space.iconUrl };
    const canEdit = isAtLeastAdmin(role);
    const canDelete = role === Role.OWNER;

    return (
        <Page scrollable>
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmitForm}>
                {(formikProps: FormikProps<SpaceFormValues>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                    } = formikProps;
                    return (
                        <View>
                            <ImagePicker
                                space
                                includeButton
                                allowSelection={canEdit}
                                buttonTitle={values.spaceIconUrl ? t`Change Logo` : t`Set Logo`}
                                imageUrl={values.spaceIconUrl || ''}
                                desktopWidth={ItemWidth.narrow}
                                onUploaded={(fileUrl: string) => {
                                    setFieldValue('spaceIconUrl', fileUrl);
                                }}
                            />
                            <SectionHeading text={t('space1')} />
                            {canEdit ? (
                                <SingleLineInput
                                    onChangeText={handleChange('spaceName')}
                                    onBlur={handleBlur('spaceName')}
                                    value={values.spaceName}
                                    placeholder={t('E.g. company name')}
                                    returnKeyType="next"
                                    autoCorrect={false}
                                    spellCheck={false}
                                    autoCapitalize="words"
                                    desktopWidth={ItemWidth.narrow}
                                />
                            ) : (
                                <Text text={values.spaceName} />
                            )}
                            <SectionHeading text={t(`Space domain`)} />
                            {canEdit ? (
                                <SingleLineInput
                                    testID="SpaceUrlInput"
                                    onChangeText={handleChange('spaceUrl')}
                                    onBlur={handleBlur('spaceUrl')}
                                    value={values.spaceUrl}
                                    inputLegend="withtree.com/"
                                    placeholder={t('domain')}
                                    returnKeyType="go"
                                    autoCorrect={false}
                                    spellCheck={false}
                                    autoCapitalize="none"
                                    desktopWidth={ItemWidth.narrow}
                                    rightIconId={IconId.feather_copy_stroke_accent4}
                                    onRightIconPress={() => onCopyPress(values.spaceUrl)}
                                />
                            ) : (
                                <Text
                                    text={t('withtree.com/{{domain}}', { domain: values.spaceUrl })}
                                    rightIconId={IconId.feather_copy_stroke_accent4}
                                    onRightIconPress={() => onCopyPress(values.spaceUrl)}
                                    desktopWidth={ItemWidth.narrow}
                                />
                            )}
                            {slugError && <Text text={slugError} danger small />}
                            {/* <Spacer /> */}
                            <Text text={t`Invite people to join the space by sharing this link.`} light small />
                            {canEdit && (
                                <>
                                    <Spacer height={ItemHeight.xsmall} />
                                    <Button
                                        testID="UpdateButton"
                                        onPress={() => handleSubmit()}
                                        disabled={!isValid || isSubmitting}
                                        text={t('Update')}
                                        desktopFitWidth
                                        desktopWidth={ItemWidth.narrow}
                                    />
                                </>
                            )}
                            <Spacer height={ItemHeight.xsmall} />
                            <SectionHeading text={t(`Danger Zone`)} />
                            <SimpleListButton
                                danger
                                text={t`Leave Space`}
                                onPress={onLeaveSpacePress}
                                desktopWidth={ItemWidth.narrow}
                            />
                            {canDelete && (
                                <SimpleListButton
                                    danger
                                    text={t`Delete Space`}
                                    onPress={onDeleteSpacePress}
                                    desktopWidth={ItemWidth.narrow}
                                />
                            )}
                            <Spacer height={ItemHeight.xsmall} />
                        </View>
                    );
                }}
            </Formik>
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        // header: null,
        title: i18n.t('SpaceSettingsPage::Settings'),
    };
};

// @ts-ignore
SpaceSettingsPage.navigationOptions = navigationOptions;

// @ts-ignore
SpaceSettingsPage.path = 'space'; //override path for better web URLs

export default withNavigation(SpaceSettingsPage);
