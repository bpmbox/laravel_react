import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import QRItem from '../../../../components/UIKit/items/QR';
import { WithItem, WithPageProps } from '../../../../pages/Integration/Page';

type QRProps = {
    value: string; // URL or expression, e.g. `${get(item, 'photoUrl')}`
} & ItemProps & WithPageProps & WithItem;

const QR: FunctionComponent<QRProps> = (props) => {
    return <QRItem
        value={props.value}
        {...omit(props, 'value')} />;
};

export default QR;
