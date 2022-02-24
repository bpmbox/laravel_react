/* istanbul ignore file */
import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { dynamicDesktopModalHeight, getModalHeader, ModalButtonType } from '../../../../components/Navigation/NavButtons';
import Button from '../../../../components/UIKit/items/Button';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../../theme.style';
import groupService from '../../../../services/group';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import { SpaceContext } from '../../SpaceContext';

const CreateUserGroupPage = (props: any) => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);
    const { t } = useTranslation('CreateUserGroupPage');
    
    const validationSchema = yup.object().shape({
        name: yup.string().required(),
    });

    type GroupFormValues = {
        name: string;
    };

    // -- Handlers --

    const handleSubmit = async (
        values: { name: string },
        actions: FormikActions<{ name: string }>
    ): Promise<void> => {
        try {
            await groupService.addGroup(space, values.name);
            messageService.sendSuccess(t('Group {{groupName}} has been created.', { groupName: values.name }));
            actions.setSubmitting(false);
            navigation.pop();
        } catch (err) {
            messageService.sendError(err.message);
            actions.setSubmitting(false);
        }
    }

    return (
        <Page scrollable desktopPadding={PaddingType.all} listensToContentSizeChangeWithNavigation={navigation}>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ name: '' }}
                enableReinitialize
                onSubmit={handleSubmit}>
                {(formikProps: FormikProps<GroupFormValues>): ReactNode => {
                    const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur
                    } = formikProps;
                    return (
                        <>
                            <SectionHeading text={t`Name`} />
                            <SingleLineInput
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                placeholder={t('Enter group name...')}
                                returnKeyType='go'
                                autoFocus
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize='sentences' />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button onPress={() => handleSubmit()} disabled={!isValid || isSubmitting} text={t('Create Group')} />
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
        title: i18n.t('CreateUserGroupPage::New Group'),
        desktopHeaderType: DesktopHeaderType.none,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.close),
        ...dynamicDesktopModalHeight(navigation, DesktopHeaderType.none, 185)
    }
};

// @ts-ignore
CreateUserGroupPage.navigationOptions = navigationOptions;

// @ts-ignore
// Use the path of PeopleList page so when the modal link is shared, it
// uses directs the user to the people list page instead.
CreateUserGroupPage.path = 'settings/people'; //override path for better web URLs

export default withNavigation(CreateUserGroupPage);
