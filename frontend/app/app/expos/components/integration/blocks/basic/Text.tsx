import merge from 'lodash/merge';
import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import TextItem from '../../../../components/UIKit/items/Text';
import { WithItem, WithPageProps } from '../../../../pages/Integration/Page';

type TextProps = {
    value: string;
    attrs?: {
        size?: 'small' | 'normal';
        appearance?: 'normal' | 'light' | 'danger';
    }
} & ItemProps & WithPageProps & WithItem;

const Text: FunctionComponent<TextProps> = (props) => {
    // TODO: remove this and update Markdown component
    console.ignoredYellowBox = ['Warning: componentWill'];

    const size = (props.attrs && props.attrs.size) ? props.attrs.size : null;
    const appearance = (props.attrs && props.attrs.appearance) ? props.attrs.appearance : null;
    const extras = merge(
        (size === 'small') ? { small: true } : {},
        (appearance === 'light') ? { light: true } : {},
        (appearance === 'danger') ? { danger: true } : {}
    );

    return <TextItem
        text={props.value}
        textSelectable
        markdown
        {...extras}
        {...omit(props, 'value', 'attrs')} />
};

export default Text;
