import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { BackgroundType,Color, ItemHeight } from '../../../theme.style';
import defaultTo from 'lodash/defaultTo';
import omit from 'lodash/omit';

type SimpleListButtonProps = {
    danger?: boolean,
    multiline?: boolean,
} & ItemProps;

const SimpleListButton: FunctionComponent<SimpleListButtonProps> = (props) => {
    const textColor = props.danger ? Color.error : Color.success

    let heightProps = {}
    if (defaultTo(props.multiline, false)) {
        heightProps = {
            textNumberOfLines: 3,
            height: ItemHeight.flex,
            minHeight: ItemHeight.default,
        }
    }
    return <Item
        text={props.text}
        touchable={props.onPress !== undefined}
        onPress={props.onPress}
        textColor={textColor}
        pressedBackgroundType={BackgroundType.full}
        {...heightProps}
        {...omit(props, 'danger', 'multiline')}/>
};

export default SimpleListButton;
