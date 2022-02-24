import get from 'lodash/get';
import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
import { ButtonSize, ButtonType } from '../../../../theme.style';
import { WithEventEmitter, WithItem, WithPageProps, WithAction } from '../../../../pages/Integration/Page';
import { ItemProps } from '../../../UIKit/Item';
import ButtonItem from '../../../UIKit/items/Button';

export type ButtonAttrType = 'success' | 'warning' | 'error' | 'secondary' | 'text';
export type ButtonAttrSize = 'small' | 'normal' | 'large';

type ButtonProps = {
    value: string;
    attrs?: {
        type?: ButtonAttrType;
        size?: ButtonAttrSize;
        fill?: boolean;
        disabled?: boolean;
    } & WithAction;
} & EventEmitterProps & ItemProps & WithPageProps
  & WithEventEmitter & WithItem;

const Button: FunctionComponent<ButtonProps> = (props) => {
    const onButtonPress = () => {
        if (!get(props, 'attrs.disabled', false) &&
            get(props, 'attrs.onClick', null)) {
            props.onClick(props.attrs.onClick)
        }
    };

    return <ButtonItem
        text={props.value}
        type={getType(get(props, 'attrs.type', 'success') as ButtonAttrType)}
        size={getSize(get(props, 'attrs.size', 'normal'))}
        disabled={get(props, 'attrs.disabled', false)}
        desktopFitWidth={!get(props, 'attrs.fill', false)}
        onPress={onButtonPress}
        {...omit(props, 'value', 'attrs', 'onPress')}
    />
};

const getType = (type: ButtonAttrType): ButtonType => {
    switch (type) {
        case 'success': return ButtonType.success;
        case 'warning': return ButtonType.warning;
        case 'error': return ButtonType.error;
        case 'secondary': return ButtonType.secondary;
        case 'text': return ButtonType.text;
    }
}

const getSize = (size: ButtonAttrSize): ButtonSize => {
    switch (size) {
        case 'small': return ButtonSize.small;
        case 'normal': return ButtonSize.normal;
        case 'large': return ButtonSize.large;
    }
}

export default Button;
