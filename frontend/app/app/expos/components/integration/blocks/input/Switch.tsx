import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import omit from 'lodash/omit';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseItemProps } from '../../../../components/UIKit/Item';
import SwitchItem from '../../../../components/UIKit/items/Switch';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';

type SwitchProps = {
    value: boolean,
    attrs?: {
        label?: string;
    }
} & EventEmitterProps & BaseItemProps;

const Switch: FunctionComponent<SwitchProps> = (props) => {
    const { t } = useTranslation('Switch');
    const label = get(props, 'attrs.label', t`Unnamed`);
    const [value] = useState<boolean>(defaultTo(props.value, false));

    const handleOnChange = (newValue) => {
        props.onChange && props.onChange(newValue);
    }

    return <SwitchItem
        text={label}
        toggled={value}
        onPress={handleOnChange}
        {...omit(props, 'value', 'attrs', 'onSelectionChange')}
    />
};

export default Switch;
