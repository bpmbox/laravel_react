import React, { FunctionComponent } from 'react';
import defaultTo from 'lodash/defaultTo';

import Item, { ItemProps } from '../Item';
import {
    BackgroundType,
    HorizontalOffset,
    IconType,
    IconSize,
    ItemHeight,
} from '../../../theme.style';
import { getUserIconProps } from '../../../libs/ui-utils';
import { formatDisplayName } from '../../../libs/user-utils';

type ComponentProps = {
    user: User;
    selected?: boolean;
} & ItemProps;

const Component: FunctionComponent<ComponentProps> = props => {
    return (
        <Item
            text={formatDisplayName(props.user)}
            touchable={!!props.touchable || !!props.onPress}
            onPress={props.onPress}
            leftTextOffset={HorizontalOffset.xxxlarge}
            height={ItemHeight.default}
            leftIconSize={IconSize.small}
            leftIconType={IconType.round}
            pressedBackgroundType={BackgroundType.full}
            checked={defaultTo(props.checked || props.selected, false)}
            {...getUserIconProps(props.user)}
        />
    );
};

export default Component;
