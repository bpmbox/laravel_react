import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { ItemHeight } from '../../../theme.style';
import omit from 'lodash/omit';

type DigitInputProps = {
    numDigits?: number,
    onChangeDigits?: (string) => void,
} & ItemProps;

const DigitInput: FunctionComponent<DigitInputProps> = (props) => {
    return <Item
        height={ItemHeight.large}
        digitInput
        numDigitInput={props.numDigits || 4}
        onChangeDigits={props.onChangeDigits}
        {...omit(props, 'numDigits', 'onChangeDigits')}
    />;
};

export default DigitInput;
