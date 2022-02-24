import get from 'lodash/get';
import merge from 'lodash/merge';
import React, { FunctionComponent, useContext } from 'react';
import { Platform, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { SpaceContext } from '../../pages/SpaceNavigator/SpaceContext';
import { IconId } from '../../assets/native/svg-icons';
import NavButton from '../../components/UIKit/Button/NavButton';
import NavTextButton from '../../components/UIKit/Button/NavTextButton';
import Avatar from '../../components/UIKit/Icon/Avatar';
import SpaceSwitcherHeader from '../../components/UIKit/items/SpaceSwitcherHeader';
import Text from '../../components/UIKit/items/Text';
import Spinner from '../../components/UIKit/Spinner';
import i18n from '../../i18n';
import routes from '../../routes';
import theme, { Color, DesktopHeaderType, IconSize, IconType, ItemHeight } from '../../theme.style';
import historyService from '../../services/history';

interface NavHeaderButtonProps {
    text?: string;
    onPress?: () => void;
}

interface NavHeaderImageProps {
    imageUrl?: string;
    name?: string;
    initial?: string;
}

interface NavHeaderTextProps {
    text: string;
}

type NavHeaderSpaceSwitcherProps = {
    icons?: any;
    navigation: any;
    onPress?: () => void;
};

export enum ModalButtonType {
    close,
    cancel,
    add,
}

const NavHeaderSafeArea: FunctionComponent<NavHeaderButtonProps> = props => {
    return <View style={{ marginHorizontal: theme.rem }}>{props.children}</View>;
};

const NavHeaderImageArea: FunctionComponent<NavHeaderImageProps> = props => {
    return (
        <Avatar
            name={props.name}
            imageUrl={props.imageUrl}
            initial={props.initial}
            size={IconSize.small}
            type={IconType.round}
        />
    );
};

const NavHeaderPlusButton: FunctionComponent<NavHeaderButtonProps> = props => {
    return <NavButton iconId={IconId.feather_plus_stroke_accent4} onPress={props.onPress} />;
};

const NavHeaderText: FunctionComponent<NavHeaderTextProps> = props => {
    return <Text text={props.text || ''} center semibold numberOfLines={1} />;
};

const NavHeaderSpaceSwitcher: FunctionComponent<NavHeaderSpaceSwitcherProps> = props => {
    const { space } = useContext(SpaceContext);
    if (!space) {
        return (
            <NavHeaderSafeArea>
                <Spinner small />
            </NavHeaderSafeArea>
        );
    }
    const gotoSpaceSwitcher = () => props.navigation.navigate(routes.SPACE_SWITCHER);
    const onPress = props.onPress || gotoSpaceSwitcher;
    return <SpaceSwitcherHeader space={space} onPress={onPress} icons={props.icons} />;
};

export const getModalHeader = (modalButtonType: ModalButtonType) => {
    if (modalButtonType === ModalButtonType.close || modalButtonType === ModalButtonType.cancel) {
        if (Platform.OS === 'ios') {
            return {
                headerLeft: (
                    <NavTextButton
                        text={modalButtonTitleMap[modalButtonType]}
                        onPress={() => historyService.goBack()}
                    />
                ),
            };
        } else if (Platform.OS === 'android') {
            return {
                headerLeft: (
                    <HeaderBackButton tintColor={Color.success.valueOf()} onPress={() => historyService.goBack()} />
                ),
            };
        }
    }
};

export const dynamicDesktopModalHeight = (navigation: any, headerType: DesktopHeaderType, defaultHeight: number) => {
    const headerHeight = headerType === DesktopHeaderType.none ? ItemHeight.zero : ItemHeight.large;
    const contentHeight = get(navigation, 'state.params.computedHeight', defaultHeight);
    return {
        desktopModalHeight: headerHeight.valueOf() + contentHeight,
    };
};

export const notifyDesktopPageContentSizeChanged = (navigation, _, contentHeight) => {
    navigation.setParams({ computedHeight: contentHeight });
};

export const getRightActionHeader = (title: string, emphasized: boolean, enabled: boolean, onPress: () => void) => {
    return {
        headerRight: <NavTextButton text={title} emphasized={emphasized} onPress={onPress} disabled={!enabled} />,
    };
};

export const createNavigationOptions = (
    title: string,
    modalButtonType?: ModalButtonType,
    extras?: any,
    showTitle?: boolean
): any => {
    return ({ navigation }: any) => {
        historyService.setNavigation(navigation);
        return merge(
            { title: title },
            modalButtonType !== undefined ? getModalHeader(modalButtonType) : {},
            showTitle !== undefined && !showTitle ? { headerTitle: () => <View /> } : {},
            { ...extras }
        );
    };
};

type ModalButtonTypeMap = { [key in ModalButtonType]: string }

const modalButtonTitleMap: ModalButtonTypeMap = {
    [ModalButtonType.add]: i18n.t('Add'),
    [ModalButtonType.close]: i18n.t('Close'),
    [ModalButtonType.cancel]: i18n.t('Cancel'),
};

export { NavHeaderSafeArea, NavHeaderImageArea, NavHeaderPlusButton, NavHeaderText, NavHeaderSpaceSwitcher };

