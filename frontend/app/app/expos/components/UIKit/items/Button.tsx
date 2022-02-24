import React, { FunctionComponent } from 'react';
import { ItemHeight, ButtonType, ButtonSize } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';

type ButtonProps = {
    narrow?: boolean,
    fit?: boolean,
    type?: ButtonType,
    size?: ButtonSize,
    invert?: boolean,
    desktopFitWidth?: boolean,
    hideLinkBackgroundOnPress?: boolean,
} & ItemProps;

const Button: FunctionComponent<ButtonProps> = (props) => {
    const remainingProps = omit(props, 'narrow', 'small', 'fit');
    const height = ItemHeight.medium;

    return <Item
        onPress={props.onPress}
        disabled={get(props, 'disabled', false)}
        buttonText={props.text}
        buttonType={props.type}
        buttonSize={defaultTo(props.size, ButtonSize.normal)}
        buttonInvert={props.invert}
        buttonDesktopFitWidth={props.desktopFitWidth}
        narrowContent={props.narrow}
        height={height}
        {...remainingProps} />
};

export default Button;
