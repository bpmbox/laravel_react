import React, { FunctionComponent } from 'react';
import { TextInput } from 'react-native';
import { ItemProps } from '../Item';
import defaultTo from 'lodash/defaultTo';

type AutoExpandingTextInputProps = {
    customstyle?: any
} & ItemProps;

const AutoExpandingTextInput: FunctionComponent<AutoExpandingTextInputProps> = (props) => {
    return <TextInput
        multiline={true}
        style={{ ...defaultTo(props.customstyle, {}) }}
        {...props}
    />
};

export default AutoExpandingTextInput;
