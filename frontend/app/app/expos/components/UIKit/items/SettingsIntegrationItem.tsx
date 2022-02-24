import React, { FunctionComponent } from 'react';
import { ItemHeight, Color, HorizontalOffset, IconSize, IconType, FontWeight, FontSize, IconBackgroundType, BackgroundType } from '../../../theme.style';
import Item, { ItemProps } from '../Item';
import { useTranslation } from 'react-i18next';
import { getAvatarProps } from '../../../libs/ui-utils';

type SettingsIntegrationItemProps = {
    integration: NSIntegration.Integration
} & ItemProps;

const SettingsIntegrationItem: FunctionComponent<SettingsIntegrationItemProps> = (props) => {
    const { t } = useTranslation(' SettingsIntegrationItem');

    let subtext = null;
    if (props.integration.access === 'published') {
        subtext = t`Published`;
    } else if (props.integration.access === 'restricted') {
        if (props.integration.restrictedSpaces && props.integration.restrictedSpaces.length > 0) {
            const count = props.integration.restrictedSpaces.length;
            const spaceName = props.integration.restrictedSpaces[0].name;
            if (count === 1) {
                subtext = t('Available on {{spaceName}}', { spaceName });
            } else if (count === 2) {
                subtext = t('Available on {{spaceName}} and 1 other space', { spaceName });
            } else {
                subtext = t('Available on {{spaceName}} and {{count}} other spaces', { spaceName, count: count-1 });
            }
        } else {
            subtext = t`Not available on any space`;
        }
    } else {
        subtext = t`Unpublished`;
    }

    return <Item
        text={props.integration.name}
        subText={subtext}
        onPress={props.onPress}
        touchable={props.onPress !== undefined}
        textSize={FontSize.normal}
        subTextSize={FontSize.small}
        subTextNumberOfLines={1}
        textWeight={FontWeight.medium}
        textColor={Color.black}
        subTextColor={Color.accent5}
        height={ItemHeight.large}
        pressedBackgroundType={BackgroundType.full}
        leftTextOffset={HorizontalOffset.xxxxlarge}
        leftIconSize={IconSize.medium}
        leftIconType={IconType.round}
        leftIconBackgroundType={IconBackgroundType.outline}
        {...getAvatarProps(props.integration.logo, props.integration.name)}
    />
};

export default SettingsIntegrationItem;
