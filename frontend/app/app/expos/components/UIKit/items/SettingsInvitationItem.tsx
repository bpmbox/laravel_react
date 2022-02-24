import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import {
    BackgroundType,
    HorizontalOffset,
    IconType,
    IconSize,
    ItemHeight,
    FontSize,
    FontWeight,
    Color,
    IconBackgroundType,
} from '../../../theme.style';
import { roleToString } from '../../../types/enums';
import pick from 'lodash/pick';
import { getAvatarProps } from '../../../libs/ui-utils';
import { useTranslation } from 'react-i18next';
import { formatDisplayName } from '../../../libs/user-utils';

type SettingsInvitationItemProps = {
    invitation: Invitation;
    showRole?: boolean;
    onRolePress?: () => void;
} & ItemProps;

const SettingsInvitationItem: FunctionComponent<SettingsInvitationItemProps> = props => {
    const {t} = useTranslation('SettingsInvitationItem');
    const touchable =
        typeof props.onPress !== 'undefined' && props.onPress !== null;
    const remainingProps = pick(props, 'desktopWidth');

    const { invitation } = props;
    
    const text = (invitation.user && invitation.user.givenName)
        ? formatDisplayName(invitation.user)
        : invitation.email;

    const subtext = (invitation.user && invitation.user.givenName) ?
        invitation.email :
        null;

    const avatarUrl = invitation.user ? invitation.user.avatarUrl : null;
    const avatarText = invitation.user
        ? invitation.user.givenName
        : invitation.email;

    return (
        <Item
            text={text}
            textColor={Color.black}
            subText={subtext}
            touchable={touchable}
            accessoryText={
                props.showRole ?
                    t('{{role}} (Pending)', {
                        role: roleToString(invitation.role)
                    }) :
                    null
            }
            accessoryTextColor={Color.success}
            accessoryTextWeight={FontWeight.medium}
            onAccessoryTextPress={props.onRolePress}
            onPress={props.onPress}
            subTextColor={Color.accent5}
            subTextNumberOfLines={1}
            subTextSize={FontSize.small}
            height={ItemHeight.large}
            leftTextOffset={HorizontalOffset.xxxxlarge}
            leftIconSize={IconSize.medium}
            leftIconType={IconType.round}
            leftIconBackgroundType={IconBackgroundType.plainOutlineLight}
            pressedBackgroundType={BackgroundType.none}
            {...getAvatarProps(avatarUrl, avatarText)}
            {...remainingProps}
        />
    );
};

export default SettingsInvitationItem;
