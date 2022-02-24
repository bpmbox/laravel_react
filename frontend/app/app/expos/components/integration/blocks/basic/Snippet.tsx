import React from 'react';
import { FunctionComponent } from 'react';
import SnippetItem from '../../../../components/UIKit/items/Snippet';
import { ItemProps } from '../../../../components/UIKit/Item';
import omit from 'lodash/omit';

type SnippetProps = {
    value: string;
} & ItemProps;

const Snippet: FunctionComponent<SnippetProps> = (props) => {
    let extraProps = {}

    return (
        <>
            <SnippetItem
                text={props.value}
                textSelectable
                {...extraProps}
                {...omit(props, 'value', 'attrs')} />
        </>
    );
};

export default Snippet;
