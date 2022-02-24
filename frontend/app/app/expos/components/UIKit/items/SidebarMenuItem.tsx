import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { ItemHeight, IconSize, IconType } from '../../../theme.style';
import { IconId } from '../../../assets/native/svg-icons';
import omit from 'lodash/omit';

type SidebarMenuItemProps = {
    iconActive: IconId,
    iconInactive: IconId,
    active?: boolean,
} & ItemProps;

const SidebarMenuItem: FunctionComponent<SidebarMenuItemProps> = (props) => {
    return <Item
        onPress={props.onPress}
        touchable={props.onPress !== undefined}
        height={ItemHeight.default}
        leftIconId={props.active ? props.iconActive : props.iconInactive}
        leftIconSize={IconSize.normal}
        leftIconType={IconType.rounded}
        {...omit(props, 'iconActive', 'iconInactive', 'active')}
    />;
};

export default SidebarMenuItem;
