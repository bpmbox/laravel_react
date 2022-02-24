import React from 'react';
import { FunctionComponent } from 'react';
import omit from 'lodash/omit';
import { CalloutType } from '../../../../theme.style';
import get from 'lodash/get';
import { ItemProps } from '../../../UIKit/Item';
import Callout from '../../../UIKit/items/Callout';

type CalloutAttrType = 'none' | 'info' | 'success' | 'warning' | 'error';

type BlockProps = {
    value: string;
    attrs?: {
        type?: CalloutAttrType;
        iconUrl?: string;
    }
} & ItemProps;

const Block: FunctionComponent<BlockProps> = (props) => {
    return (
        <Callout
            text={props.value}
            textSelectable
            iconUrl={get(props, 'attrs.iconUrl', null)}
            type={getType(get(props, 'attrs.type', 'none'))}
            mini={get(props, 'attrs.small', false)}
            {...omit(props, 'value', 'attrs')} />
    );
};

const getType = (type: CalloutAttrType): CalloutType => {
    switch (type) {
        case 'info': return CalloutType.info;
        case 'success': return CalloutType.success;
        case 'warning': return CalloutType.warning;
        case 'error': return CalloutType.error;
        case 'none': return CalloutType.none;
    }
}

export default Block;
