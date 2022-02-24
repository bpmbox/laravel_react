import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import omit from 'lodash/omit';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemProps } from '../../../../components/UIKit/Item';
import Select from '../../../../components/UIKit/items/Select';
import SimpleListItem from '../../../../components/UIKit/items/SimpleListItem';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
let count = 0;
let inval = "1111"

type MultiSelectProps = {
    value: {
        items: string[];
        selectedIndex?: number;
    };
    attrs?: {
        name?: string;
        label?: string;
    };
} & EventEmitterProps &
    ItemProps;

const getSelectedIndices = (items, selectedItems, defaultSelectedIndices) => {

    const indices = selectedItems
        .map(item => {
            return indexOf(items, item);
        })
        .filter(index => {
            return index >= 0;
        });
    // console.log(indices.length + 'indecete length');
    // console.log(count + 'count =============');
    // console.log("inval =========== "+inval)
    // console.log("inval length =========== "+inval.length)
    // console.log("indices.length"+indices.length )

    if(inval.length === 0){
        console.log("inval is null ")
        return indices.sort();
    }

    if(inval === "1111"){
        return defaultSelectedIndices.sort();
        //return indices.sort();
    }

    if(inval !== "1111" && indices.length !== 0){
        return indices.sort();
    }

    if(inval !== "1111" && indices.length === 0){
        return defaultSelectedIndices.sort();
    }
    //else{
    //    return defaultSelectedIndices.sort();
    //}

    if (selectedItems.length === 0 || indices.length === 0){
        //count = 1
    }


   //return defaultSelectedIndices.sort();

    console.log(count)
    if (count === 0) {
        count = count + 1
        console.log('reterun default');
        return defaultSelectedIndices.sort();
    }

    if (selectedItems.length === 0) {
        console.log('reterun selectdItem');
        count = 0;
        return indices.sort();
    }

    if (indices.length === 0) {
        console.log('reterun indices');
        count = 0;
        return indices.sort();
    }
    return indices.sort();
};

const getCurrentSelection = (items, selectedIndices) => {
    //console.log("selected getCurrent")
    return selectedIndices
        .map(index => {
            return get(items, `[${index}]`, null);
        })
        .filter(item => {
            return item !== null;
        });
};

const formatActionTitle = (items, actionTitle) => {
    if (items.length === 0) {
        return actionTitle;
    }
    return items.join(', ');
};

const MultiSelect: FunctionComponent<MultiSelectProps> = props => {

    const { t } = useTranslation('MultiSelect');
    const actionTitle = get(props, 'attrs.label', t`Select...`);
    const items = get(props, 'value.items', []);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const selectedIndices = getSelectedIndices(items, selectedItems, get(props, 'value.selectedIndices', []));

    const handleOnChange = newValue => {

        count = count + 1;
        setSelectedItems(newValue);
        //if(newValue.length > 0)
            inval = newValue
        props.onChange && props.onChange(getSelectedIndices(items, newValue, []));
    };

    return (
        <Select
            title={actionTitle}
            actionTitle={formatActionTitle(selectedItems, actionTitle)}
            values={items}
            multi
            allowDeselect
            currentSelection={getCurrentSelection(items, selectedIndices)}
            titleRenderer={item => item}
            itemRenderer={(item, selected, _, props) => {
                return <SimpleListItem text={item} checked={selected} {...props} />;
            }}
            onSelectionChange={handleOnChange}
            {...omit(props, 'value', 'attrs', 'onSelectionChange')}
        />
    );
};

export default MultiSelect;
