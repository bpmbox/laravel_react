import React, { FunctionComponent } from 'react';
import ReactNative, { TouchableOpacity } from 'react-native';
import Text from '../items/Text';

type NavTextButtonProps = {
    text: string,
    emphasized?: boolean,
    disabled?: boolean,
} & ReactNative.TouchableOpacityProps

const NavTextButton: FunctionComponent<NavTextButtonProps> = (props) => {
    if (props.disabled) {
        return <Text link disabled text={props.text} semibold={props.emphasized} />;
    }
    return <TouchableOpacity onPress={props.onPress}>
        <Text link text={props.text} semibold={props.emphasized} />
    </TouchableOpacity>
};

export default NavTextButton;
