import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { BackgroundType, HorizontalOffset, IconType, IconSize, FontWeight, ItemHeight } from '../../../theme.style';
import defaultTo from 'lodash/defaultTo';
import omit from 'lodash/omit';
import { isMobilePlatform } from '../../../libs/platform';

type ComponentProps = {
    integration: NSIntegration.Integration,
    selected?: boolean,
} & ItemProps;

const Component: FunctionComponent<ComponentProps> = (props) => {
    const disabled = defaultTo(props.disabled, false);
    const selected = defaultTo(props.selected, false);
    const pressedBackgroundType = isMobilePlatform ? BackgroundType.full : BackgroundType.extraWideButton;
    
    return <Item
        text={props.integration.name}
        textWeight={selected ? FontWeight.semibold : FontWeight.normal}
        height={ItemHeight.default}
        touchable={props.onPress !== undefined}
        leftTextOffset={HorizontalOffset.xxxlarge}
        rightTextOffset={HorizontalOffset.default}
        pressedBackgroundType={disabled ? BackgroundType.none : pressedBackgroundType}
        backgroundType={(selected && !isMobilePlatform) ? BackgroundType.extraWideButton : BackgroundType.none}
        leftIconType={IconType.round}
        leftIconSize={IconSize.small}
        leftIconImageUrl={props.integration.logo}
        {...omit(props,
            'text',
            'touchable',
            'leftTextOffset',
            'rightTextOffset',
            'pressedBackgroundType',
            'backgroundType',
            'leftIconType',
            'leftIconSize',
            'leftIconImageUrl',
            'integration',
            'selected',
        )}
    />
};

export default Component;
