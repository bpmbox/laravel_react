import React, { FunctionComponent } from 'react';
import { ItemHeight, Color, HorizontalOffset, IconSize, IconType, FontWeight, FontSize, IconBackgroundType, BackgroundType } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { useTranslation } from 'react-i18next';
import defaultTo from 'lodash/defaultTo';
import { getAvatarProps } from '../../../libs/ui-utils';
import get from 'lodash/get';

type MarketplaceIntegrationItemProps = {
    integration: NSIntegration.Integration,
    showConfigure?: boolean,
} & ItemProps;

const MarketplaceIntegrationItem: FunctionComponent<MarketplaceIntegrationItemProps> = (props) => {
    const { t } = useTranslation(' MarketplaceIntegrationItem');

    let accessoryProps = {}
    if (defaultTo(props.showConfigure, false)) {
        accessoryProps = {
            accessoryText: t`Configure`,
            accessoryTextColor: Color.success,
            accessoryTextWeight: FontWeight.medium,
            pressedBackgroundType: BackgroundType.none,
        }
    } else {
        accessoryProps = {
            pressedBackgroundType: BackgroundType.full,
        }
    }

    return <Item
        text={props.integration.name}
        subText={props.integration.shortDesc}
        onPress={props.onPress}
        touchable={props.onPress !== undefined}
        textSize={FontSize.normal}
        subTextSize={FontSize.small}
        subTextNumberOfLines={1}
        textWeight={FontWeight.medium}
        textColor={Color.black}
        subTextColor={Color.accent5}
        height={ItemHeight.large}
        leftTextOffset={HorizontalOffset.xxxxlarge}
        leftIconSize={IconSize.medium}
        leftIconType={IconType.round}
        leftIconBackgroundType={IconBackgroundType.outline}
        {...getAvatarProps(get(props, 'integration.logo', null), get(props, 'integration.name', null))}
        {...accessoryProps}
        {...props}
    />
};

export default MarketplaceIntegrationItem;
