import { StyleSheet } from 'react-native';
import theme, {
    FontWeight,
    FontSize,
    ItemHeight,
    BackgroundType,
    IconSize,
    IconType,
    IconPosition,
    IconBackgroundType,
    HorizontalOffset,
    VerticalOffset,
    VerticalPosition,
    DividerPadding,
    iconRadius,
    ItemWidth,
    fontFamily,
    codeFontFamily,
    FontWeightType,
    Color,
    backgroundPadding,
    dividerPadding,
    iconBackgroundColor,
    iconBorderColor,
    iconInitialTextColor,
} from '../../../theme.style';
import merge from 'lodash/merge';
import { isMobilePlatform } from '../../../libs/platform';
import { LineHeight } from '../../../theme.style';
import { MobileKeyboardType } from '../../../theme.style.shared';

export const getLayoutStyle = (
    desktopWidth: ItemWidth,
    desktopCenterItem: boolean) => {
    const mobileMaxWidth = isMobilePlatform ?
        { maxWidth: '100%' } :
        {};
    const desktopMaxWidth = (isMobilePlatform || desktopWidth === ItemWidth.fill || desktopWidth === ItemWidth.fit) ?
        {} :
        {
            width: '100%',
            maxWidth: desktopWidth.valueOf(),
        };
    const desktopAlignSelf = (isMobilePlatform || !desktopCenterItem) ?
        {} :
        { alignSelf: 'center' };

    return merge({
            flexDirection: 'row',
            alignItems: 'center',
        },
        mobileMaxWidth,
        desktopMaxWidth,
        desktopAlignSelf
    );
}

export const getItemStyle = (
        width: ItemWidth | null,
        minWidth: ItemWidth | null,
        height: ItemHeight,
        minHeight: ItemHeight | null,
        textPosition: VerticalPosition,
        topOffset: VerticalOffset,
        bottomOffset: VerticalOffset,
        centerContent: boolean,
        desktopWidth: ItemWidth,
        desktopCenterItem: boolean
    ): StyleSheet.NamedStyles<any> => {
    const justifyContent = textPosition === VerticalPosition.bottom ? 'flex-end' : (textPosition === VerticalPosition.top ? 'flex-start' : 'center')

    const layoutStyle = getLayoutStyle(desktopWidth, desktopCenterItem);

    return {
        item: merge(
            layoutStyle,
            {
                flexDirection: 'row',
                alignItems: justifyContent,
            },
        (height !== ItemHeight.flex && height !== ItemHeight.fill) ?
        {
            height: height.valueOf()
        } : {},
        (height === ItemHeight.flex && minHeight) ? {
            minHeight: minHeight.valueOf()
        } : {},
        (height === ItemHeight.fill) ? {
            height: '100%',
        } : {},

        (width !== null && width !== ItemWidth.fill && width !== ItemWidth.fit) ?
        {
            width: width,
        } : {},
        (width === ItemWidth.fit && minWidth) ? {
            minWidth: minWidth,
        } : {},
        (width === ItemWidth.fill) ? {
            width: '100%',
        } : {},
        (topOffset === VerticalOffset.none) ? {} : {
            marginTop: topOffset.valueOf(),
        },
        (bottomOffset === VerticalOffset.none) ? {} : {
            marginBottom: bottomOffset.valueOf(),
        },
        (centerContent) ? {
            justifyContent: 'center',
        } : {}),
    };
};

export const getTextContainerStyle = (centerText: boolean, narrowContent: boolean): StyleSheet.NamedStyles<any> => {
    return {
        item: merge({
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: centerText ? 'center' : 'flex-start',
            flexGrow: 1,
            maxWidth: '100%',
            overflow: 'hidden',
        }, narrowContent ? {marginHorizontal: 3 * theme.horizontalPadding} : {})
    };
};

export const getBackgroundStyle = (
    backgroundType: BackgroundType,
    backgroundColor: Color): StyleSheet.NamedStyles<any> => {
    const { leftRight, topBottom } = backgroundPadding(backgroundType);
    return {
        item: {
            display: backgroundType === BackgroundType.none ? 'none' : 'flex',
            position: 'absolute',
            left: leftRight,
            right: leftRight,
            top: topBottom,
            bottom: topBottom,
            borderRadius: backgroundType === BackgroundType.full ? 0 : theme.radius,
            backgroundColor: backgroundType === BackgroundType.none ? undefined : backgroundColor.valueOf(),
            zIndex: -1,
        },
    };
};

export const getTextStyle = (
        size: FontSize,
        weight: FontWeight,
        lineHeight: LineHeight,
        color: Color,
        centerText: boolean,
        leftTextOffset: HorizontalOffset,
        rightTextOffset: HorizontalOffset,
        topTextOffset: VerticalOffset,
        bottomTextOffset: VerticalOffset,
        counter: number | undefined,
        pressed: boolean,
        textSelectable: boolean,
    ): StyleSheet.NamedStyles<any> => {
    const paddingLeft = leftTextOffset.valueOf() - (counter && counter >= 100 ? 24 : 0);

    let style: any = {
        text: {
            fontFamily: fontFamily(weight),
            fontSize: size.valueOf(),
            fontWeight: weight.valueOf() as FontWeightType,
            lineHeight: lineHeight * size.valueOf(),
            color: color.valueOf(),
            textAlign: centerText ? 'center' : 'left',
            opacity: pressed ? 0.9 : 1,
            maxWidth: '100%',
            paddingLeft: paddingLeft,
            paddingRight: rightTextOffset.valueOf(),
            paddingTop: topTextOffset.valueOf(),
            paddingBottom: bottomTextOffset.valueOf(),
        }
    };

    if (!isMobilePlatform) {
        style.text.userSelect = textSelectable ? 'text' : 'none';
    }

    return style;
};

export const getMarkdownTextStyle = (
        size: FontSize,
        weight: FontWeight,
        lineHeight: LineHeight,
        color: Color,
        centerText: boolean,
        leftTextOffset: HorizontalOffset,
        rightTextOffset: HorizontalOffset,
        topTextOffset: VerticalOffset,
        bottomTextOffset: VerticalOffset,
        counter: number | undefined,
        pressed: boolean,
        textSelectable: boolean
    ): StyleSheet.NamedStyles<any> => {
    const paddingLeft = leftTextOffset.valueOf() - (counter && counter >= 100 ? 24 : 0);
    let style: any = {
        text: {
            fontFamily: fontFamily(weight),
            fontSize: size.valueOf(),
            lineHeight: lineHeight * size.valueOf(),
            color: color.valueOf(),
            textAlign: centerText ? 'center' : 'left',
            opacity: pressed ? 0.9 : 1,
            maxWidth: '100%',
            paddingLeft: paddingLeft,
            paddingRight: rightTextOffset.valueOf(),
            paddingTop: topTextOffset.valueOf(),
            paddingBottom: bottomTextOffset.valueOf(),
        },
        strong: {
            fontFamily: fontFamily(FontWeight.bold),
            fontWeight: 'bold',
        }
    };

    if (!isMobilePlatform) {
        style.text.userSelect = textSelectable ? 'text' : 'none'
    }

    return style;
};

export const getCodeTextStyle = (
        size: FontSize,
        weight: FontWeight,
        lineHeight: LineHeight,
        color: Color,
        centerText: boolean,
        leftTextOffset: HorizontalOffset,
        rightTextOffset: HorizontalOffset,
        topTextOffset: VerticalOffset,
        bottomTextOffset: VerticalOffset,
        counter: number | undefined,
        pressed: boolean
    ): StyleSheet.NamedStyles<any> => {
    const paddingLeft = leftTextOffset.valueOf() - (counter && counter >= 100 ? 24 : 0)
    return {
        codeBlock: {
            fontFamily: codeFontFamily(weight),
            fontSize: size.valueOf(),
            lineHeight: lineHeight * size.valueOf(),
            fontWeight: weight.valueOf() as FontWeightType,
            color: color.valueOf(),
            borderColor: Color.transparent,
            textAlign: centerText ? 'center' : 'left',
            opacity: pressed ? 0.9 : 1,
            paddingLeft: paddingLeft,
            paddingRight: rightTextOffset.valueOf(),
            paddingTop: topTextOffset.valueOf(),
            paddingBottom: bottomTextOffset.valueOf(),
        },
        codeInline: {
            fontFamily: codeFontFamily(weight),
            fontSize: size.valueOf()-2,
            fontWeight: weight.valueOf() as FontWeightType,
            color: Color.pink,
            backgroundColor: Color.accent2,
            borderColor: Color.accent4,
            textAlign: centerText ? 'center' : 'left',
            opacity: pressed ? 0.9 : 1,
            paddingLeft: 5,
            paddingRight: 5,
            marginLeft: 3,
            marginRight: 3,
            paddingTop: 3,
            paddingBottom: 3,
        }
    };
};

export const getMarkdownContainerStyle = (
    leftTextOffset: HorizontalOffset,
    rightTextOffset: HorizontalOffset,
    topTextOffset: VerticalOffset,
    bottomTextOffset: VerticalOffset,
    counter: number | undefined,
    pressed: boolean
): StyleSheet.NamedStyles<any> => {
    const paddingLeft = leftTextOffset.valueOf() - (counter && counter >= 100 ? 24 : 0)
    return {
        container: {
            opacity: pressed ? 0.9 : 1,
            paddingLeft: paddingLeft,
            paddingRight: rightTextOffset.valueOf(),
            paddingTop: topTextOffset.valueOf(),
            paddingBottom: bottomTextOffset.valueOf(),
        }
    };
};

export const getSubTextStyle = (
        size: FontSize,
        weight: FontWeight,
        color: Color,
        leftTextOffset: HorizontalOffset,
        rightTextOffset: HorizontalOffset,
        pressed: boolean,
        textSelectable
    ): StyleSheet.NamedStyles<any> => {
    let style: any = {
        text: {
            fontFamily: fontFamily(weight),
            fontSize: size.valueOf(),
            fontWeight: weight.valueOf() as FontWeightType,
            color: color.valueOf(),
            opacity: pressed ? 0.9 : 1,
            paddingLeft: leftTextOffset.valueOf(),
            paddingRight: rightTextOffset.valueOf(),
            paddingBottom: 5,
        },
    };

    if (!isMobilePlatform) {
        style.text.userSelect = textSelectable ? 'text' : 'none';
    }

    return style;
};

export const getAccessoryTextStyle = (
        size: FontSize,
        weight: FontWeight,
        color: Color,
        bottomTextOffset: VerticalOffset,
    ): StyleSheet.NamedStyles<any> => {
    return {
        text: merge({
            fontFamily: fontFamily(weight),
            fontSize: size.valueOf(),
            fontWeight: weight.valueOf() as FontWeightType,
            color: color.valueOf(),
            paddingLeft: 10,
            paddingRight: 16,
            textAlign: 'right',
        }, bottomTextOffset === VerticalOffset.none ? {} : { paddingBottom: bottomTextOffset.valueOf() },
        )
    };
};

export const getBadgeCountStyle = (): StyleSheet.NamedStyles<any> => {
    return {
        item: {
            backgroundColor: theme.red1,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 2,
            marginRight: 16,
            borderRadius: 16,
            minWidth: 24,
            minHeight: 24,
            justifyContent: 'center',
        },
        text: {
            color: Color.white,
            fontFamily: fontFamily(FontWeight.semibold),
            fontSize: FontSize.small.valueOf(),
            fontWeight: FontWeight.semibold,
            textAlign: 'center',
        },
    };
};

export const getBulletStyle = (): StyleSheet.NamedStyles<any> => {
    return {
        item: {
            position: 'absolute',
            top: 19,
            left: 20,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: Color.black.valueOf(),
        }
    };
};

export const getCounterStyle = (): StyleSheet.NamedStyles<any> => {
    return {
        item: {
            position: 'absolute',
            top: 12,
            left: 2,
            width: 30,
            height: 22,
            fontFamily: fontFamily(FontWeight.normal),
            fontSize: FontSize.normal.valueOf(),
            fontWeight: FontWeight.normal.valueOf() as FontWeightType,
            color: Color.black.valueOf(),
            textAlign: 'right',
        },
    };
};

export const getQuoteBarStyle = (): StyleSheet.NamedStyles<any> => {
    return {
        item: {
            width: 3,
            borderRadius: 2,
            position: 'absolute',
            left: 16,
            top: 14,
            bottom: 14,
            backgroundColor: Color.black.valueOf(),
        }
    };
};

export const getLeftIndicatorStyle = (itemHeight: ItemHeight, iconSize: IconSize): StyleSheet.NamedStyles<any> => {
    const topBottom = (itemHeight.valueOf() - iconSize.valueOf()) / 2;
    return {
        item: {
            width: 6,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            position: 'absolute',
            left: 0,
            top: topBottom,
            bottom: topBottom,
            backgroundColor: Color.black.valueOf(),
        }
    };
};

export const getDividerStyle = (
    height: ItemHeight,
    position: VerticalPosition,
    padding: DividerPadding): StyleSheet.NamedStyles<any> => {
    const { left, right } = dividerPadding(padding);
    const topBottom = (position === VerticalPosition.bottom) ? { bottom : 0 } :
        (position === VerticalPosition.top ? { top: 0 } :
            { top: height.valueOf() / 2 })
    return {
        item: merge({
            position: 'absolute',
            left: left,
            right: right,
            height: StyleSheet.hairlineWidth,
            backgroundColor: Color.accent3.valueOf(),
        }, topBottom )
    };
};

export const getLeftIconStyle = (
    iconSize: IconSize,
    iconType: IconType,
    iconPosition: IconPosition,
    iconBackground: IconBackgroundType): StyleSheet.NamedStyles<any> => {
    const radius = iconRadius(iconType, iconSize);
    const leftOffset = iconPosition === IconPosition.topLeftOffset ? 24 : 16
    const topOffset = iconPosition === IconPosition.topLeftOffset ? 20 : (iconPosition === IconPosition.topLeft ? 6 : 0)
    return {
        item: merge({
                width: iconSize.valueOf(),
                height: iconSize.valueOf(),
                borderRadius: radius,
                position: 'absolute',
                overflow: 'hidden',
                backgroundColor: iconBackgroundColor(iconBackground).valueOf(),
            },
            (iconPosition === IconPosition.middle || iconPosition === IconPosition.horizontalCenter) ? {} : { top: topOffset },
            iconPosition === IconPosition.horizontalCenter ? {} : { left: leftOffset },
            {
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: iconBorderColor(iconBackground).valueOf(),
            },
        )
    };
};

export const getLeftIconInitialStyle = (iconSize: IconSize, iconBackground: IconBackgroundType): StyleSheet.NamedStyles<any> => {
    let fontSize;
    switch (iconSize) {
        case IconSize.large: fontSize = FontSize.h2.valueOf(); break;
        case IconSize.medium: fontSize = FontSize.h3.valueOf(); break;
        case IconSize.normal: fontSize = FontSize.h4.valueOf(); break;
        default: fontSize = FontSize.normal.valueOf(); break;
    }
    return {
        item: {
            fontFamily: fontFamily(FontWeight.medium),
            fontSize: fontSize,
            fontWeight: FontWeight.medium.valueOf() as FontWeightType,
            color: iconInitialTextColor(iconBackground).valueOf().valueOf(),
            textAlign: 'center',
            height: iconSize.valueOf(),
            width: iconSize.valueOf() - 1, // Hack to adjust for font asymmetry
            lineHeight: iconSize.valueOf() - 2, // Hack to adjust for font asymmetry
        }
    };
};

export const getRightIconStyle = (indented: boolean, containerHeight: ItemHeight, iconSize: IconSize): StyleSheet.NamedStyles<any> => {
    const iconSizeValue = iconSize.valueOf();
    const top = Math.max(0, (containerHeight.valueOf() - iconSizeValue) / 2);
    return {
        item: {
            width: iconSizeValue,
            height: iconSizeValue,
            position: 'absolute',
            right: indented ? 2 * theme.horizontalPadding : theme.horizontalPadding,
            top: top,
        }
    };
};

export const getSwitchContainerStyle = (): StyleSheet.NamedStyles<any> => {
    return {
        item: {
            position: 'absolute',
            right: 16,
        },
    };
};

export const getButtonContainerStyle = (narrowContent: boolean, desktopWidth: ItemWidth): any => {
    return {
        item: merge({
            paddingHorizontal: narrowContent ? 3 * theme.horizontalPadding : theme.horizontalPadding,
        },
            (isMobilePlatform || desktopWidth === ItemWidth.fill) ? { width : '100%' } : {},
        ),
    };
};

export const getLeftTextInputStyle = (
    size: FontSize,
    weight: FontWeight,
    color: Color,
    height: ItemHeight,
    textOffset: HorizontalOffset,
    topTextOffset: VerticalOffset,
    bottomTextOffset: VerticalOffset,
    code: boolean): any => {
    return {
        item: {
            width: '100%',
            minHeight: height.valueOf(),
            fontFamily: code ? codeFontFamily(weight) : fontFamily(weight),
            fontSize: size.valueOf(),
            fontWeight: weight.valueOf() as FontWeightType,
            color: color.valueOf(),
            paddingLeft: textOffset.valueOf(),
            paddingRight: textOffset.valueOf(),
            paddingTop: topTextOffset.valueOf(),
            paddingBottom: bottomTextOffset.valueOf(),
        }
    };
};

export const getRightTextInputStyle = (
    size: FontSize,
    weight: FontWeight,
    color: Color,
    height: ItemHeight,
    textOffset: HorizontalOffset,
    topTextOffset: VerticalOffset,
    bottomTextOffset: VerticalOffset,
    code: boolean): any => {
    return {
        item: {
            width: '100%',
            minHeight: height.valueOf(),
            fontFamily: code ? codeFontFamily(weight) : fontFamily(weight),
            fontSize: size.valueOf(),
            fontWeight: weight.valueOf() as FontWeightType,
            color: color.valueOf(),
            paddingLeft: textOffset.valueOf(),
            paddingRight: textOffset.valueOf(),
            paddingTop: topTextOffset.valueOf(),
            paddingBottom: bottomTextOffset.valueOf(),
        }
    };
};

export const getDigitInputContainerStyle = (desktopWidth: ItemWidth): any => {
    return {
        item: merge({
            paddingHorizontal: theme.rem,
        },
            (isMobilePlatform || desktopWidth === ItemWidth.fill) ? { width : '100%' } : {},
        )
    };
}

export const getImageStyle = (): any => {
    return {
        item: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    };
};

export const getWebViewStyle = (fullscreen: boolean): any => {
    return {
        item: {
            width: '100%',
            height: '100%',
            paddingHorizontal: fullscreen ? 0 : theme.horizontalPadding,
            borderRadius: fullscreen ? 0 : theme.radius,
            overflow: 'hidden',
        }
    };
}

export const getImageMaskStyle = (): any => {
    return {
        item: {
            width: '100%',
            height: '100%',
            borderRadius: theme.radius,
            overflow: 'hidden',
            backgroundColor: Color.accent3.valueOf(),
        }
    };
};

export const getImageContainerStyle = (aspectRatio: number, desktopImageLayout?: any | null): any => {
    if (!isMobilePlatform && desktopImageLayout && desktopImageLayout.width) {
        return {
            item: {
                width: '100%',
                height: desktopImageLayout.width / aspectRatio,
                paddingHorizontal: theme.horizontalPadding,
                paddingVertical: VerticalOffset.large.valueOf(),
            }
        };
    }
    return {
        item: {
            width: '100%',
            aspectRatio: aspectRatio,
            paddingHorizontal: theme.horizontalPadding,
            paddingVertical: VerticalOffset.large.valueOf(),
        }
    };
};

export const getQRContainerStyle = (desktopImageLayout?: any | null): any => {
    if (!isMobilePlatform && desktopImageLayout && desktopImageLayout.width) {
        return {
            item: {
                alignItems: 'center',
                width: '100%',
                height: desktopImageLayout.width,
                paddingHorizontal: theme.horizontalPadding,
                paddingVertical: VerticalOffset.large.valueOf(),
            }
        };
    }
    return {
        item: {
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: theme.horizontalPadding,
            paddingVertical: VerticalOffset.large.valueOf(),
        }
    };
};

export const getChatComposerInputStyle = (): any => {
    return {
        fontFamily: fontFamily(FontWeight.normal),
        fontSize: FontSize.normal.valueOf(),
        fontWeight: FontWeight.normal.valueOf() as FontWeightType,
        color: Color.black.valueOf(),
        paddingHorizontal: theme.horizontalPadding / 2,
    };
};

export const getTextProps = (numberOfLines: number, textSelectable: boolean = false): any => {
    let props: any = { selectable: textSelectable };

    if (numberOfLines > 0) {
        props = {
            ...props,
            numberOfLines,
            ellipsizeMode: 'tail',
        };
    }

    return props;
};

export const getIconProps = (
    iconId: string | undefined,
    iconImageUrl: string | undefined,
    iconSize: IconSize,
    iconType: IconType): any => {
    let imageResource = {}
    if (iconImageUrl !== undefined) {
        imageResource = { imageUrl: iconImageUrl }
    } else {
        imageResource = { svgIconId: (iconId === undefined) ? 'multicolor_add' : iconId }
    }
    return merge({
        iconSize: iconSize,
        iconType: iconType,
    }, imageResource);
};

export const getTextInputProps = (
    disabled: boolean,
    multiline: boolean,
    mobileKeyboardType: MobileKeyboardType,
    secureTextEntry: boolean): any => {
    return merge({
        placeholderTextColor: Color.accent4.valueOf(),
        selectionColor: Color.success.valueOf(),
        editable: !disabled,
    },
    multiline ? {
        multiline: true,
        numberOfLines: 0,
    } : {
        multiline: false,
        numberOfLines: 1,
    },
    isMobilePlatform ? {
        textAlignVertical: 'top',
        keyboardType: mobileKeyboardType.valueOf(),
    } : {},
    secureTextEntry ? {
        secureTextEntry: true
    } : {});
};

export const getDropdownStyle = (): any => {
    if (!isMobilePlatform) {
        return {
            item: {
                width: '100%',
                marginLeft:16,
                height:40
            }
        };
    }
    return {
        item: {
            width:'100%',
            padding:50
        }
    };
};
