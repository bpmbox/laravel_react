import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../UIKit/Item';
import BulletPoint from '../../../UIKit/items/BulletPoint';

type BulletedListBlockProps = {
    values?: string[];
} & ItemProps;

const BulletedListBlock: FunctionComponent<BulletedListBlockProps> = (props) => {
    if (!props.values || !Array.isArray(props.values)) {
        return <></>;
    }
    return (
        <>
            {props.values.map(((item, index) => (
                <BulletPoint
                    key={index}
                    text={item}
                    textSelectable
                    {...omit(props, 'values')}
                />
            )))}
        </>
    );
};

export default BulletedListBlock;
