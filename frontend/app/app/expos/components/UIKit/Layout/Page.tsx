import React, { FunctionComponent } from 'react';
import { View, ViewProps, ScrollView, ScrollViewProps, SafeAreaView } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { isMobilePlatform } from '../../../libs/platform';
import theme, { PaddingType } from '../../../theme.style';

type PageProps = {
    verticalCenter?: boolean;
    horizontalCenter?: boolean;
    center?: boolean;
    scrollable?: boolean;
    desktopPadding?: PaddingType;
    listensToContentSizeChangeWithNavigation?: any;
} & ViewProps & ScrollViewProps;

const Page: FunctionComponent<PageProps> = props => {
    let layoutStyle: any = [];

    if (props.verticalCenter) {
        layoutStyle.push(styleObj.verticalCenter);
    }

    if (props.horizontalCenter) {
        layoutStyle.push(styleObj.horizontalCenter);
    }

    if (props.center) {
        layoutStyle.push(styleObj.verticalCenter);
        layoutStyle.push(styleObj.horizontalCenter);
    }

    const desktopPadding = typeof props.desktopPadding !== 'undefined' ? props.desktopPadding : PaddingType.none;

    const onContentSizeChange = (contentWidth, contentHeight) => {
        props.listensToContentSizeChangeWithNavigation &&
            props.listensToContentSizeChangeWithNavigation.setParams({
                computedWidth: contentWidth,
                computedHeight: contentHeight + getDesktopPaddingForType(desktopPadding),
            });
    };

    let Wrapper: any;
    let style = [props.style];
    let contentContainerStyle = [];

    if (props.scrollable) {
        Wrapper = ScrollView;
        contentContainerStyle = [...layoutStyle];
    } else {
        Wrapper = View;
        style = [...style, styleObj.base, ...layoutStyle];
    }

    return (
        <SafeAreaView style={styleObj.container}>
            <Wrapper
                {...props}
                contentContainerStyle={contentContainerStyle}
                style={style}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={props.listensToContentSizeChangeWithNavigation && onContentSizeChange}>
                <Padder desktopPadding={desktopPadding} scrollable={props.scrollable}>
                    {props.children}
                </Padder>
            </Wrapper>
        </SafeAreaView>
    );
};

const Padder = props => {
    if (isMobilePlatform) {
        return (
            <>
                {props.children}
                {props.scrollable && <KeyboardSpacer />}
            </>
        );
    } else {
        return <>
                {props.children}
            </>;
    }
};

const getDesktopPaddingForType = (paddingType: PaddingType): number => {
    if (isMobilePlatform) {
        return 0;
    }
    switch (paddingType) {
        case PaddingType.all:
            return 2 * theme.modalVerticalPadding;
        case PaddingType.horizontalBottom:
            return theme.modalVerticalPadding;
        default:
            return 0;
    }
};

const styleObj = {
    container: {
        flex: 1,
    },
    base: {
        flex: 1,
    },
    verticalCenter: {
        justifyContent: 'center',
    },
    horizontalCenter: {
        alignItems: 'center',
    },
    padded: {
        paddingHorizontal: 30,
    },
};

export default Page;
