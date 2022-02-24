import { withNavigation } from '@react-navigation/core';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { dynamicDesktopModalHeight, getModalHeader, getRightActionHeader, ModalButtonType } from '../../components/Navigation/NavButtons';
import Spacer from '../../components/UIKit/items/Spacer';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../theme.style';
import historyService from '../../services/history';
import { PARAM_ON_DONE } from '../../constants';

const ItemPickerPage: FunctionComponent<NavigationInjectedProps> = props => {
    const { navigation } = props;
    const {
        values,
        initialSelection,
        disabledSelection,
        allowMulti,
        allowDeselect,
        itemRenderer,
        emptyRenderer,
        headerRenderer,
        onFinish,
    } = navigation.state.params;
    const [selection, setSelection] = useState(new Set(initialSelection || []));

    useEffect(() => {
        // TODO: This might be a little hackish?
        navigation.setParams({
            [PARAM_ON_DONE]: () => {
                onFinish(Array.from(selection.values()));
                navigation.goBack();
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    const onItemPress = async (item: any) => {
        if (allowMulti) {
            let current = new Set(selection);
            if (selection.has(item)) {
                current.delete(item);
            } else {
                current.add(item);
            }
            setSelection(current);
        } else {
            const shouldDeselect = allowDeselect && selection.has(item);
            const newSelection = shouldDeselect ? [] : [item];
            setSelection(new Set(newSelection));
            onFinish(newSelection);
            navigation.goBack();
        }
    };

    return (
        <Page
            scrollable
            desktopPadding={PaddingType.horizontalBottom}
            listensToContentSizeChangeWithNavigation={navigation}>
            {headerRenderer && headerRenderer()}
            {values.length === 0 && emptyRenderer && emptyRenderer()}
            {values.map((item, index) => {
                return itemRenderer(item, false, defaultTo(disabledSelection, []).includes(item), {
                    key: index,
                    onPress: () => onItemPress(item),
                    checked: selection.has(item),
                });
            })}
            <Spacer height={ItemHeight.xsmall} />
        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    // If we navigated directly to this dialog, immediately pop to parent so we
    // don't open a role dialog to an stale state.
    if (typeof navigation.getParam('itemRenderer') !== 'function') {
        navigation.pop();
        return null;
    }
    if (typeof navigation.getParam('onFinish') !== 'function') {
        navigation.pop();
        return null;
    }

    historyService.setNavigation(navigation);
    const valid = get(navigation, 'state.params.values', []).length > 0;
    const allowMulti = get(navigation, 'state.params.allowMulti', false);
    const rightHeader = allowMulti
        ? getRightActionHeader(i18n.t('Done'), true, valid, () => {
              navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
          })
        : {};
    return {
        title: navigation.state.params.title,
        desktopHeaderType: DesktopHeaderType.plain,
        desktopShowClose: !allowMulti,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        ...rightHeader,
        ...dynamicDesktopModalHeight(navigation, DesktopHeaderType.plain, 400),
    };
};

// @ts-ignore
ItemPickerPage.navigationOptions = navigationOptions;

export default withNavigation(ItemPickerPage);
