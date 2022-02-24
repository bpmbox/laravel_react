import React, { FunctionComponent } from 'react';
import { ItemHeight, VerticalPosition, DividerPadding, VerticalOffset } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type MultilineInputProps = {} & ItemProps;

const MultilineInput: FunctionComponent<MultilineInputProps> = (props) => {
    return <Item
        height={ItemHeight.xlarge}
        leftTextInput={true}
        multilineInput
        topItemOffset={VerticalOffset.small}
        textPosition={VerticalPosition.top}
        dividerPadding={DividerPadding.small}
        dividerPosition={VerticalPosition.bottom}
        {...props} />
};

export default MultilineInput;
