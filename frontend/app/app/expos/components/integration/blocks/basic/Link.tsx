import React, { FunctionComponent } from 'react';
import SimpleListItem from '../../../../components/UIKit/items/SimpleListItem';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
import { ItemProps } from '../../../../components/UIKit/Item';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { IconType, ItemHeight, IconSize } from '../../../../theme.style';
import { FontWeight, HorizontalOffset, FontSize, Color } from '../../../../theme.style';

type LinkSize = 'default' | 'large';

type LinkProps = {
    value: string;
    attrs?: {
        pageId: string;
        integrationId?: string;
        url: string;
        iconUrl?: string;
        size?: LinkSize;
        subtitle?: string;
    },
} & EventEmitterProps & ItemProps;

const Link: FunctionComponent<LinkProps> = (props) => {
    const iconUrl = get(props, 'attrs.iconUrl', null);
    const size = get(props, 'attrs.size', null);
    const subtitle = get(props, 'attrs.subtitle', null);
    let extras = {};
    if (iconUrl) {
        extras = {
            iconUrl,
            iconType: IconType.rounded
        }
    } else if (!subtitle) {
        extras = {
            link: true
        };
    }
    if (size === 'large') {
        extras = {
            height: ItemHeight.xlarge,
            leftIconSize: IconSize.large,
            textWeight: FontWeight.medium,
            leftTextOffset: iconUrl ? HorizontalOffset.xxxxxlarge : HorizontalOffset.default,
            ...extras
        };
    } else if (subtitle) {
        extras = {
            height: ItemHeight.medium,
            leftIconSize: IconSize.normal,
            leftTextOffset: iconUrl ? HorizontalOffset.xxxxlarge : HorizontalOffset.default,
            ...extras
        };
    }
    if (subtitle) {
        extras = {
            subText: subtitle,
            subTextSize: FontSize.small,
            subTextNumberOfLines: 1,
            subTextColor: Color.accent5,
            ...extras
        };
    }

    return <SimpleListItem
        text={props.value}
        textSelectable
        onPress={() => { props.onPress && props.onPress() }}
        {...extras}
        {...omit(props, 'value', 'attrs')}
    />;
};

export default Link;
