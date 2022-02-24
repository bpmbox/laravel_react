import omit from 'lodash/omit';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import SingleLineInput from '../../../../components/UIKit/items/SingleLineInput';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
import get from 'lodash/get';
import MultilineInput from '../../../UIKit/items/MultilineInput';

export type CapitalizationType = 'none' | 'sentences' | 'words' | 'characters';

const getCapitalizationType = (text) => {
    switch (text) {
        case 'sentences': return 'sentences';
        case 'words': return 'words';
        case 'characters': return 'characters';
        default: return null;
    }
}

type InputProps = {
    value: string;
    attrs?: {
        label?: string;
        placeholder?: string;
        disabled?: boolean;
        multiline?: boolean;
        secure?: boolean;
        autocorrect?: boolean;
        capitalize?: CapitalizationType;
        showUser?: any;
        name?: string;
        localData?: any;
        localOut?: any;
    }
} & EventEmitterProps & ItemProps;

const Input: FunctionComponent<InputProps> = (props) => {
    const [value, setValue] = useState<string>(props.value);

    const multiline = get(props, 'attrs.multiline', false);
    const label = get(props, 'attrs.label', null);
    const placeholder = get(props, 'attrs.placeholder', null);
    const disabled = get(props, 'attrs.disabled', false);
    const secure = get(props, 'attrs.secure', false);
    const autocorrect = get(props, 'attrs.autocorrect', false);
    const capitalization = getCapitalizationType(get(props, 'attrs.capitalize', null));

    const remainingProps = omit(props, 'value', 'inputLegend', 'placeholder',
        'secureTextEntry', 'autoCorrect', 'spellCheck', 'autoCapitalize',
        'disabled', 'returnKeyType', 'onChangeText');

    useEffect(() => {
        setValue(props.value)
    }, [props.value]);

    const onChangeText = (text) => {
        setValue(text);
        props.onChange && props.onChange(text);
    }

    if(props.attrs.showUser === true && props.value === "" ){
        //global['givenName'] = currentUser.givenName;
        //global['familyName'] = currentUser.familyName;

        return (
            <SingleLineInput
                value={global['givenName'] + global['familyName']}
                inputLegend={label}
                placeholder={placeholder}
                secureTextEntry={secure}
                autoCorrect={autocorrect}
                spellCheck={false}
                autoCapitalize={capitalization}
                disabled={disabled}
                returnKeyType="next"
                onChangeText={onChangeText}
                {...remainingProps}
            />
        );
    }


    if (multiline) {
        return <MultilineInput
            value={value}
            inputLegend={label}
            placeholder={placeholder}
            secureTextEntry={secure}
            autoCorrect={autocorrect}
            spellCheck={false}
            autoCapitalize={capitalization}
            disabled={disabled}
            returnKeyType='next'
            onChangeText={onChangeText}
            {...remainingProps}
        />
    }

    return <SingleLineInput
        value={value}
        inputLegend={label}
        placeholder={placeholder}
        secureTextEntry={secure}
        autoCorrect={autocorrect}
        spellCheck={false}
        autoCapitalize={capitalization}
        disabled={disabled}
        returnKeyType='next'
        onChangeText={onChangeText}
        {...remainingProps}
    />
};

export default Input;
