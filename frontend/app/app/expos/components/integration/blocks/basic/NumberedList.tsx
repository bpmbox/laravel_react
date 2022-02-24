import React, { FunctionComponent } from 'react';
import NumberedItem from '../../../../components/UIKit/items/NumberedItem';
import { ItemProps } from '../../../../components/UIKit/Item';
import omit from 'lodash/omit';

type BlockProps = {
    values?: string[];
} & ItemProps;

const Block: FunctionComponent<BlockProps> = (props) => {
    const values = props.values || [];
    return (
        <>
            {values.map(((item, index) => (
                <NumberedItem
                    key={index + 1}
                    textSelectable
                    text={item}
                    counter={index + 1}
                    {...omit(props, 'values')} />
            )))}
        </>
    );
};

export default Block;
