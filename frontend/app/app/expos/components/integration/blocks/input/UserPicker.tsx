import React, { FunctionComponent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemProps } from '../../../../components/UIKit/Item';
import Heading from '../../../../components/UIKit/items/Heading';
import Tag from '../../../../components/UIKit/items/Tag';
import Row from '../../../../components/UIKit/Layout/Row';
import { formatDisplayName } from '../../../../libs/user-utils';
import routes from '../../../../routes';
import { HorizontalOffset } from '../../../../theme.style';
import historyService from '../../../../services/history';

type UserPickerProps = {
    value?: {
        users: User[];
        userGroups: Group[];
    };
    attrs?: {
        allowMultiSelect?: boolean;
        disabled?: boolean;
        includeUserGroups?: boolean;
        label?: string;
        onChange?: (selection: (User | Group)[]) => void;
    };
} & ItemProps;

/**
 * The outer block for a user picker.
 * When the '+ Add People' button is clicked, pops up a UserPickerModal
 * to select people and groups. Most logic is found in UserPickerModal.
 */
const UserPicker: FunctionComponent<UserPickerProps> = (
    props: UserPickerProps
) => {
    const { t } = useTranslation('UserPicker');
    const defaultAttrs = {
        allowMultiSelect: true,
        disabled: false,
        includeUserGroups: true,
        label: t`User Picker`,
        onChange: (_selection: (User | Group)[]) => {},
    };
    const attrs = Object.assign(defaultAttrs, props.attrs || {});

    const [selection, setSelection] = useState([] as (User | Group)[]);

    // Called when the User Picker modal closes.
    // The final selection of users/groups is passed back as the parameter.
    const userPickerModalOnFinish = (selectedUsers: (User | Group)[]) => {
        setSelection(selectedUsers || []);
    };

    // Pops up the User Picker modal to select users and groups.
    const gotoUserPickerModal = useCallback(() => {
        historyService.pushModal(routes.USER_PICKER, userPickerModalOnFinish, {
            value: props.value,
            attrs: attrs,
            selection: selection,
        });
        // (disabling lint warning because adding props.value, etc.,
        // as a dependency introduces an infinite render cycle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    return (
        <>
            {!!attrs.label && <Heading text={attrs.label} />}

            <Row padding={HorizontalOffset.default} wrap>
                {selection.map(item => {
                    const name =
                        (item as Group).name || formatDisplayName(item as User);
                    return (
                        <Tag key={'userselection_' + item.id} title={name} />
                    );
                })}
                <Tag
                    key="userpicker_add_people"
                    title={t`+ Add People`}
                    onPress={gotoUserPickerModal}
                    disabled={attrs.disabled}
                />
            </Row>
        </>
    );
};

export default UserPicker;
