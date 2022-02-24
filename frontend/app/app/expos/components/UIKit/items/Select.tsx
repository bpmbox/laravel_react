import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import omit from 'lodash/omit';
import React, { useEffect, useState } from 'react';
import routes from '../../../routes';
import { BackgroundType, Color, ItemHeight } from '../../../theme.style';
import Item, { ItemProps } from '../Item';

type SelectProps<T extends any> = {
    title: string;
    actionTitle?: string;
    multi?: boolean;
    allowDeselect?: boolean;
    values: T[];
    initialSelection?: T[];
    currentSelection?: T[];
    disabledSelection?: T[];
    titleRenderer: (item: T) => string;
    itemRenderer: (item: T, selected: T[], disabled: boolean, props: any) => any;
    emptyRenderer?: () => any;
    headerRenderer?: () => any;
    onSelectionChange?: (selection: T[]) => void;
    onItemSelected?: (selection: T) => void;
} & ItemProps & {
    navigation: any;
};

const Select: <T extends any>(props: SelectProps<T>) => any = (props) => {
    const { navigation } = props;
    const [selection, setSelection] = useState(props.initialSelection || []);

    // -- Init --
    useEffect(() => {
        if (props.currentSelection) {
            setSelection(props.currentSelection);
        }
    }, [props.currentSelection])

    const handleSelection = (selection) => {
        setSelection(selection)
        if (props.multi && props.onSelectionChange) {
            props.onSelectionChange(selection)
        } else if (selection.length > 0 && props.onItemSelected) {
            props.onItemSelected(selection[0])
        }
    }

    const handlePress = () => {
        // TODO: make route configurable via props.
        navigation.push(routes.ITEM_PICKER, {
            title: props.title,
            values: props.values,
            initialSelection: selection,
            disabledSelection: defaultTo(props.disabledSelection, []),
            allowMulti: props.multi || false,
            allowDeselect: props.allowDeselect || false,
            itemRenderer: props.itemRenderer,
            emptyRenderer: props.emptyRenderer,
            headerRenderer: props.headerRenderer,
            onFinish: (selection) => { handleSelection(selection) }
        });
    }

    const selectedItems = props.values.filter((item) => selection.includes(item));
    const title = selectedItems.length === 0 ? (props.actionTitle || props.title) : selectedItems.map(props.titleRenderer).join(', ');

    return <Item
        text={title}
        textColor={Color.success}
        height={props.multi ? ItemHeight.flex : ItemHeight.default}
        textNumberOfLines={props.multi ? 0 : 1}
        onPress={handlePress}
        touchable={true}
        pressedBackgroundType={BackgroundType.full}
        minHeight={ItemHeight.default}
        {...omit(props,
            'title',
            'actionTitle',
            'multi',
            'allowDeselect',
            'values',
            'initialSelection',
            'currentSelection',
            'disabledSelection',
            'titleRenderer',
            'itemRenderer',
            'emptyRenderer',
            'headerRenderer',
            'onSelectionChange',
            'onItemSelected',
        )}
    />
};

export default withNavigation(Select);
