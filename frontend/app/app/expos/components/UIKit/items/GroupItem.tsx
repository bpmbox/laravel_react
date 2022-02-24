import React, { FunctionComponent } from 'react';
import { IconId } from '../../../assets/native/svg-icons';
import Item, { ItemProps } from '../Item';
import {
    BackgroundType,
    HorizontalOffset,
    IconPosition,
    IconSize,
    IconType,
} from '../../../theme.style';

type ComponentProps = {
    group: Group;
    toggled?: boolean;
    onPress?: (event?: any) => void;
} & ItemProps;

const Component: FunctionComponent<ComponentProps> = (
    props: ComponentProps
) => {
    return (
        <Item
            text={props.group.name}
            touchable={typeof props.toggled === 'undefined' && !!props.onPress}
            onPress={props.onPress}
            leftIconId={IconId.multicolor_followers}
            leftIconSize={IconSize.small}
            leftIconType={IconType.round}
            leftIconPosition={IconPosition.middle}
            textNumberOfLines={0}
            pressedBackgroundType={BackgroundType.full}
            leftTextOffset={HorizontalOffset.xxxlarge}
            rightTextOffset={HorizontalOffset.large}
            toggled={props.toggled}
        />
    );
};

export default Component;
