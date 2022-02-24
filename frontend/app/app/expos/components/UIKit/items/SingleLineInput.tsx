import React, { FunctionComponent } from 'react';
import { ItemHeight, VerticalPosition, DividerPadding } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';

type SingleLineInputProps = {
    legend?: boolean
} & ItemProps;

const SingleLineInput: FunctionComponent<SingleLineInputProps> = (props) => {
    const extras = props.legend ? {
        rightTextInput: true,
    } : {
        leftTextInput: true,
    }

    return <Item
        height={ItemHeight.default}
        numberOfLines={1}
        dividerPadding={DividerPadding.small}
        dividerPosition={VerticalPosition.bottom}
        {...props.inputLegend}
        {...extras}
        {...omit(props, 'legend', 'rightTextInput', 'leftTextInput')} />
};

export default SingleLineInput;
