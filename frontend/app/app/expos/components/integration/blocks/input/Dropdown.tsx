import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import React, { FunctionComponent, useState } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import Picker from '../../../../components/UIKit/items/Picker';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';

type DropdownProps = {
    value: {
        items: string[];
        selectedIndex?: number;
    }
    attrs?: {
        label?: string;
    }
} & EventEmitterProps & ItemProps;

const Dropdown: FunctionComponent<DropdownProps> = (props) => {
    const items = get(props, 'value.items', []);
    const [selectedValue, setSelectedValue] = useState<string | null>(items[0]);

    const handleOnChange = (newValue) => {
        setSelectedValue(newValue)
        props.onChange && props.onChange(indexOf(items, newValue));
    }
    return (        
        <Picker
            selectedValue={selectedValue}
            values={items}
            dropdownFunction={handleOnChange}
            {...props}
        />
    );
    }

export default Dropdown;
