import React, { FunctionComponent } from 'react';
import { BackgroundType } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';
import { IconId } from '../../../assets/native/svg-icons';

type IconButtonProps = {
    iconId: IconId
} & ItemProps;

const IconButton: FunctionComponent<IconButtonProps> = (props) => {
    return <Item
        leftIconId={props.iconId}
        pressedBackgroundType={BackgroundType.wideButton}
        touchable={true}
        {...omit(props, 'pressedBackgroundType')}
    />
};

export default IconButton;
