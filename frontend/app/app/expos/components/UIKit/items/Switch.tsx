import React, { FunctionComponent } from 'react';
import { ItemHeight } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';
import defaultTo from 'lodash/defaultTo';

type SwitchProps = {
    toggled?: boolean;
} & ItemProps;

const Switch: FunctionComponent<SwitchProps> = props => {
    return (
        <Item
            height={ItemHeight.default}
            toggled={defaultTo(props.toggled, false)}
            {...props.inputLegend}
            {...omit(props, 'legend', 'rightTextInput', 'leftTextInput')}
        />
    );
};

export default Switch;
