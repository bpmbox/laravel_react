import React, { FunctionComponent } from 'react';
import SpacerItem from '../../../../components/UIKit/items/Spacer';
import { ItemProps } from '../../../../components/UIKit/Item';
import { ItemHeight } from '../../../../theme.style';

type SpacerProps = {} & ItemProps;

const Spacer: FunctionComponent<SpacerProps> = (props) => {
    return (
        <SpacerItem height={ItemHeight.xsmall} {...props}/>
    );
};

export default Spacer;
