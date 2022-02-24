import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Item, { ItemProps } from '../Item';
import {
    FontSize,
    FontWeight,
    ItemHeight,
    HorizontalOffset,
    IconSize,
    IconType,
    BackgroundType,
    Color,
    IconBackgroundType
} from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';
import omit from 'lodash/omit';
import Spinner from '../Spinner';
import Row from '../Layout/Row';

type SpaceSelectorItemProps = {
    space: Space;
    selected?: boolean;
    onSettingsPress?: () => void;
    loading?: boolean;
} & ItemProps;

const SpaceSelectorItem: FunctionComponent<SpaceSelectorItemProps> = props => {
    const { t } = useTranslation('SpaceSelectorItemProps');
    
    const leftIconBackgroundType = props.space.iconUrl ? IconBackgroundType.outline : IconBackgroundType.plainLight;

    const accessoryTextProps = props.selected ? {
        accessoryText: t`Settings`,
        accessoryTextColor: Color.success,
        onAccessoryTextPress: props.onSettingsPress
    } : {};

    const renderedItem = (
        <Item
            text={props.space.name}
            onPress={props.onPress}
            touchable={props.onPress !== undefined}
            textSize={FontSize.normal}
            textWeight={FontWeight.medium}
            height={ItemHeight.xlarge}
            leftIconSize={IconSize.large}
            leftIconType={IconType.rounded}
            leftIndicator={props.selected}
            leftTextOffset={HorizontalOffset.xxxxxlarge}
            pressedBackgroundType={BackgroundType.full}
            leftIconBackgroundType={leftIconBackgroundType}
            {...getAvatarProps(props.space.iconUrl, props.space.name)}
            {...accessoryTextProps}
            {...omit(props, 'space', 'selected')}
        />
    );

    // If in loading state, add a spinner behind this item.
    if (props.loading) {
        return (
            <Row
                desktopWidth={props.desktopWidth}
                desktopCenterItem={props.desktopCenterItem}>
                {renderedItem}
                <Spinner />
            </Row>
        );
    }

    return renderedItem;
};

export default SpaceSelectorItem;
