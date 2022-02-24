import { withNavigation } from '@react-navigation/core';
import React from 'react';
import Item, { ItemProps } from '../Item';
import omit from 'lodash/omit';
import { isMobilePlatform } from '../../../libs/platform';

type PickerProps<T extends any> = {
    values: string[];
    dropdownFunction?: (selection: T) => void;
    selectedValue?: string;
} & ItemProps;

const height = isMobilePlatform ? 200 : 50;

const Picker: <T extends any>(props: PickerProps<T>) => any = (props) => {

    return <Item
        touchable={true}
        height={height}
        dropdownFunction={props.dropdownFunction}
        dropdownList={props.values}
        selectedValue={props.selectedValue}
        {...omit(props,
            'values',
            'dropdownFunction',
            'selectedValue',
        )} />
};

export default withNavigation(Picker);
