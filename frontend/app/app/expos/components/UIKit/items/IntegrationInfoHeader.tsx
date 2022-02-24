import React, { FunctionComponent } from 'react';
import Item, { ItemProps } from '../Item';
import { FontSize, FontWeight, ItemHeight, HorizontalOffset, IconSize, IconType, IconBackgroundType } from '../../../theme.style';

type IntegrationInfoHeaderProps = {
    integration: NSIntegration.Integration,
} & ItemProps;

const IntegrationInfoHeader: FunctionComponent<IntegrationInfoHeaderProps> = (props) => {
    const { integration } = props;

    return <Item
        text={integration.name}
        subText={integration.shortDesc}
        leftIconImageUrl={integration.logo}
        textSize={FontSize.h3}
        textWeight={FontWeight.bold}
        subTextSize={FontSize.small}
        height={ItemHeight.xxlarge}
        leftTextOffset={HorizontalOffset.xxxxxxlarge}
        leftIconSize={IconSize.xlarge}
        leftIconType={IconType.rounded}
        leftIconBackgroundType={IconBackgroundType.outline}
    />
};

export default IntegrationInfoHeader;
