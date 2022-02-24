import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import omit from 'lodash/omit';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemProps } from '../../../../components/UIKit/Item';
import Select from '../../../../components/UIKit/items/Select';
import SimpleListItem from '../../../../components/UIKit/items/SimpleListItem';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';

type SingleSelectProps = {
    value: {
        items: string[];
        selectedIndex?: number;
    }
    attrs?: {
        label?: string;
    }
} & EventEmitterProps & ItemProps;

const getSelectedIndex = (items, selectedItem, defaultValue) => {
    const index = indexOf(items, selectedItem)
    if (index < 0) {
        return defaultValue;
    }
    return index;
}

const getCurrentSelection = (items, index) => {
    const item = get(items, `[${index}]`, null);
    if (item === null) {
        return [];
    }
    return [item];
}

const SingleSelect: FunctionComponent<SingleSelectProps> = (props) => {
    const { t } = useTranslation('SingleSelect');
    const actionTitle = get(props, 'attrs.label', t`Select...`);
    const items = get(props, 'value.items', []);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const selectedIndex = getSelectedIndex(items, selectedItem, get(props, 'value.selectedIndex', -1));

    const handleOnChange = (newValue) => {
        setSelectedItem(newValue);
        props.onChange && props.onChange(indexOf(items, newValue));
    }

    return <Select
        title={actionTitle}
        actionTitle={defaultTo(selectedItem, actionTitle)}
        values={items}
        allowDeselect
        currentSelection={getCurrentSelection(items, selectedIndex)}
        titleRenderer={(item) => item }
        itemRenderer={(item, selected, _, props) => {
            return <SimpleListItem text={item} unchecked={selected} {...props} />
        }}
        onItemSelected={handleOnChange}
        {...omit(props, 'value', 'attrs', 'onSelectionChange')}
    />
};

export default SingleSelect;
