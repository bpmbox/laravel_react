import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import sortBy from 'lodash/sortBy';
import React, { FunctionComponent, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationInjectedProps } from 'react-navigation';
import * as yup from 'yup';
import {
    dynamicDesktopModalHeight,
    getModalHeader,
    ModalButtonType,
} from '../../../../components/Navigation/NavButtons';
import Button from '../../../../components/UIKit/items/Button';
import MultilineInput from '../../../../components/UIKit/items/MultilineInput';
import MultilineSubtitle from '../../../../components/UIKit/items/MultilineSubtitle';
import SectionHeading from '../../../../components/UIKit/items/SectionHeading';
import Select from '../../../../components/UIKit/items/Select';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import Spacer from '../../../../components/UIKit/items/Spacer';
import Text from '../../../../components/UIKit/items/Text';
import UserGroupSelectionItem from '../../../../components/UIKit/items/UserGroupSelectionItem';
import Page from '../../../../components/UIKit/Layout/Page';
import i18n from '../../../../i18n';
import { defaultStackNavigationOptions } from '../../../../libs/nav/config';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../../../theme.style';
import groupService, {
    GROUP_ADDED_EVENT,
    GROUP_MEMBERS_UPDATED_EVENT,
    GROUP_REMOVED_EVENT,
    GROUP_UPDATED_EVENT,
} from '../../../../services/group';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import { Role, roleDescription, roleToString } from '../../../../types/enums';
import { SpaceContext } from '../../SpaceContext';
import { MobileKeyboardType } from '../../../../theme.style.shared';

const USER_ROLES = [Role.GUEST, Role.MEMBER, Role.ADMIN, Role.OWNER];

type InvitePageProps = {
    space: Space;
    __groupService?: NSGroupService.IGroupService;
    __spaceService?: SpaceServiceTypes.ISpacesService;
} & NavigationInjectedProps;

type GroupListState = {
    groups: NSGroupService.GroupWithMemberCount[];
    isLoading: boolean;
    isError: boolean;
};

type InvitationFormValues = {
    email: string;
    role: Role;
    groups: Group[];
    message: string;
};

const InvitePage: FunctionComponent<InvitePageProps> = props => {
    const { navigation } = props;
    const { space, role } = useContext(SpaceContext);
    const { t } = useTranslation('InvitePage');
    const [groupListState, setGroupListState] = useState<GroupListState>({
        groups: [],
        isLoading: true,
        isError: false,
    });
    const __groupService: NSGroupService.IGroupService = props.__groupService || groupService;

    // -- Initial Data --
    const fetchGroups = async () => {
        try {
            const groups = await __groupService.getGroups(space, true);
            setGroupListState({ groups: sortBy(groups, ['name']), isLoading: false, isError: false });
        } catch (err) {
            setGroupListState({ groups: [], isLoading: false, isError: true });
        }
    };

    useEffect(() => {
        fetchGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space]);

    useEffect(() => {
        const events = [GROUP_ADDED_EVENT, GROUP_REMOVED_EVENT, GROUP_UPDATED_EVENT, GROUP_MEMBERS_UPDATED_EVENT];
        events.forEach(event => __groupService.addListener(event, fetchGroups));
        return () => {
            events.forEach(event => __groupService.removeListener(event, fetchGroups));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email(t`Please enter a valid email address.`)
            .required(t`Email is required`),
        role: yup.string().required(),
    });

    const handleFormSubmit = async (
        values: {
            email: string;
            role: Role;
            groups: Group[];
            message: string;
        },
        actions: FormikActions<{ email: string; role: Role; groups: Group[]; message: string }>
    ): Promise<void> => {
        
            try {
                const emailArray = values.email.split(';');
                emailArray.forEach(async function(email) {
                    validationSchema.isValid({email:email,role:values.role})
                    .then(async function (valid) {
                        if(valid){
                            await spaceService.sendInvitation(space, {
                                email: email,
                                role: values.role,
                                groups: values.groups,
                                customMessage: values.message,
                            });
                        }
                    })
                });
                actions.setSubmitting(false);
                messageService.sendSuccess(t('Invitation sent to {{email}}.', { email: values.email }));
                navigation.goBack();
            } catch (err) {
                if (i18n.exists(`Errors::${err.code}`)) {
                    messageService.sendError(i18n.t(`Errors::${err.code}`));
                } else {
                    messageService.sendError(t`An error occurred while sending invitation.`);
                }
                actions.setSubmitting(false);
            }
    };

    // -- Render --
    let message = null;
    let allowedRoles = [];

    if (role === Role.OWNER) {
        allowedRoles = [Role.GUEST, Role.MEMBER, Role.ADMIN, Role.OWNER];
    } else if (role === Role.ADMIN) {
        message = t`As an Admin, you can grant other users Guest or Member roles only. To grant other roles, you need to be an Owner.`;
        allowedRoles = [Role.GUEST, Role.MEMBER];
    } else {
        message = t`Only Admins and Owners can grant roles.`;
    }

    return (
        <Page scrollable desktopPadding={PaddingType.all} listensToContentSizeChangeWithNavigation={navigation}>
            <Formik
                //validationSchema={validationSchema}
                initialValues={{ email: '', role: Role.MEMBER, groups: [], message: '' }}
                enableReinitialize
                onSubmit={handleFormSubmit}>
                {(formikProps: FormikProps<InvitationFormValues>): ReactNode => {
                    const { values, handleSubmit, isSubmitting, handleChange, handleBlur } = formikProps;
                    return (
                        <>
                            <SectionHeading text={t`Email`} />
                            <SingleLineInput
                                testID="EmailInput"
                                text={t`Email`}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                placeholder={t`Enter email address`}
                                autoFocus
                                returnKeyType="next"
                                mobileKeyboardType={MobileKeyboardType.email}
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="none"
                            />
                            <SectionHeading text={t`Invite as`} />
                            <Select
                                title={t`Select Role`}
                                values={USER_ROLES}
                                initialSelection={[Role.MEMBER]}
                                titleRenderer={roleToString}
                                headerRenderer={() => {
                                    return <Text text={message} small />;
                                }}
                                itemRenderer={(
                                    roleItem: Role,
                                    selected: Role[],
                                    _disabled: boolean,
                                    itemProps: any
                                ) => {
                                    const disabled = !allowedRoles.includes(roleItem);
                                    return (
                                        <MultilineSubtitle
                                            title={roleToString(roleItem)}
                                            subtitle={roleDescription(roleItem)}
                                            checked={selected}
                                            disabled={disabled}
                                            {...itemProps}
                                        />
                                    );
                                }}
                                onItemSelected={selection => handleChange('role')(selection)}
                            />
                            <SectionHeading text={t`Add to groups (optional)`} />
                            <Select
                                title={t`Select Groups`}
                                multi
                                allowDeselect
                                values={groupListState.groups}
                                initialSelection={[]}
                                titleRenderer={group => group.name}
                                emptyRenderer={() => (
                                    <>
                                        <Spacer />
                                        <Text text={t`There are no groups in this space.`} light small center />
                                    </>
                                )}
                                itemRenderer={(
                                    group: Group,
                                    _selected: Group[],
                                    _disabled: boolean,
                                    itemProps: any
                                ) => <UserGroupSelectionItem group={group} {...itemProps} />}
                                onSelectionChange={(selection: Group[]) => handleChange('groups')(selection)}
                            />
                            <SectionHeading text={t`Custom message (optional)`} />
                            <MultilineInput
                                onChangeText={handleChange('message')}
                                onBlur={handleBlur('message')}
                                value={values.message}
                                placeholder={t`Enter a message...`}
                                returnKeyType="go"
                                autoCorrect={true}
                                spellCheck={true}
                                numberOfLines={3}
                                autoCapitalize="sentences"
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                testID="SubmitInvite"
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                                text={t`Send Invitation`}
                            />
                        </>
                    );
                }}
            </Formik>
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);

    return {
        title: i18n.t('InvitePage::Invite User'),
        desktopHeaderType: DesktopHeaderType.none,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        ...dynamicDesktopModalHeight(navigation, DesktopHeaderType.none, 536),
    };
};

// @ts-ignore
InvitePage.navigationOptions = navigationOptions;

// @ts-ignore
// Use the path of PeopleList page so when the modal link is shared, it
// uses directs the user to the people list page instead.
InvitePage.path = 'settings/people'; //override path for better web URLs

export default withNavigation(InvitePage);
