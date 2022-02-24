import React, { FunctionComponent } from 'react';
import Blockquote from '../../../../components/UIKit/items/Blockquote';
import { ItemProps } from '../../../../components/UIKit/Item';
import omit from 'lodash/omit';

type QuoteProps = {
    value: string;
} & ItemProps;

const Quote: FunctionComponent<QuoteProps> = (props) => {
    return <Blockquote
        text={props.value}
        textSelectable
        desktopWidth={props.desktopWidth}
        {...omit(props, 'value')}/>
};

export default Quote;
