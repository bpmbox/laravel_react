import React, { FunctionComponent } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Item, { ItemProps } from '../Item';
import {
    IconBackgroundType,
    BackgroundType,
    FontSize,
    FontWeight,
    HorizontalOffset,
    IconSize,
    IconType,
} from '../../../theme.style';
import { getAvatarProps } from '../../../libs/ui-utils';

type ComponentProps = {
    icons?: any;
    space: Space;
} & ItemProps;

const SpaceSwitcherHeader: FunctionComponent<ComponentProps> = props => {
    const item = (
        <Item
            text={props.space.name}
            touchable
            onPress={props.onPress}
            textSize={FontSize.normal}
            textWeight={FontWeight.medium}
            leftTextOffset={HorizontalOffset.xxxlarge}
            leftIconSize={IconSize.small}
            leftIconType={IconType.rounded}
            leftIconBackgroundType={IconBackgroundType.plainLight}
            pressedBackgroundType={BackgroundType.wide}
            {...getAvatarProps(props.space.iconUrl, props.space.name)} />
    );
    return (
        <View style={styles.navWrapper}>
            <View style={styles.itemWrapper}>{item}</View>
            {props.icons}
        </View>
    );
};

const styles = StyleSheet.create({
    itemWrapper: {
        flexGrow: 1,
    },
    navWrapper: {
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        width: Dimensions.get('window').width
    },
});

export default SpaceSwitcherHeader;
