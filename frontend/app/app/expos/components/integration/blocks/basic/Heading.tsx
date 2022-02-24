import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import HeadingItem from '../../../../components/UIKit/items/Heading';
import { WithItem, WithPageProps } from '../../../../pages/Integration/Page';

type HeadingProps = {
    value: string,
    depth?: number
} & ItemProps & WithPageProps & WithItem;

const Heading: FunctionComponent<HeadingProps> = (props) => {
    const depth = props.depth || 1;

    return <HeadingItem
        text={props.value}
        textSelectable
        h1={depth === 1}
        h2={depth === 2}
        h3={depth === 3}
        h4={depth === 4}
        h5={depth === 5}
        h6={depth === 6}
        flex
        {...omit(props, 'value', 'depth')}
    />
};

export default Heading;
