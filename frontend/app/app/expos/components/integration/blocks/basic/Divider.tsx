import get from 'lodash/get';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import DividerItem from '../../../../components/UIKit/items/Divider';
import { ItemHeight } from '../../../../theme.style';

type DividerProps = {
    attrs?: {
        margin?: boolean,
    },
} & ItemProps;

const Divider: FunctionComponent<DividerProps> = (props) => {
    const height = get(props, 'attrs.margin', 'true') === 'false' ? ItemHeight.zero : ItemHeight.default
    return (
        <DividerItem
            middle
            height={height}
            {...props} />
    );
};

export default Divider;
