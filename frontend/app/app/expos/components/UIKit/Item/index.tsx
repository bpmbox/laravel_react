import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactNative, { Text, TextInput, TouchableOpacity, View, Image, Platform, Picker } from 'react-native';
import Button from '../Button';
import QR from '../QR';
import DigitInput from '../DigitInput';
import Icon from '../Icon';
import Switch from '../Switch';
import WebView from '../WebView';
import Markdown from 'react-native-markdown-display';
import MarkdownIt from 'react-native-markdown-display/src/MarkdownIt';
import {
    getItemStyle,
    getTextContainerStyle,
    getBackgroundStyle,
    getTextStyle,
    getMarkdownTextStyle,
    getCodeTextStyle,
    getMarkdownContainerStyle,
    getSubTextStyle,
    getAccessoryTextStyle,
    getBadgeCountStyle,
    getBulletStyle,
    getCounterStyle,
    getQuoteBarStyle,
    getLeftIndicatorStyle,
    getLeftIconStyle,
    getLeftIconInitialStyle,
    getRightIconStyle,
    getDividerStyle,
    getButtonContainerStyle,
    getLeftTextInputStyle,
    getRightTextInputStyle,
    getDigitInputContainerStyle,
    getImageStyle,
    getImageContainerStyle,
    getImageMaskStyle,
    getSwitchContainerStyle,
    getTextProps,
    getIconProps,
    getTextInputProps,
    getWebViewStyle,
    getQRContainerStyle,
    getDropdownStyle
} from './style';
import {
    BackgroundType,
    DividerPadding,
    FontSize,
    FontWeight,
    IconSize,
    IconType,
    ItemHeight,
    Color,
    VerticalPosition,
    HorizontalOffset,
    VerticalOffset,
    IconPosition,
    IconBackgroundType,
    ImageAspectRatio,
    ItemWidth,
    LineHeight,
    ButtonType,
    ButtonSize
} from '../../../theme.style';
import Row from '../Layout/Row';
import { IconId } from '../../../assets/native/svg-icons';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import defaultTo from 'lodash/defaultTo';
import { isMobilePlatform } from '../../../libs/platform';
import AutoExpandingTextInput from '../AutoExpandingTextInput';
import RemoteImage from '../RemoteImage';
import { textNonSelectableRules, textSelectableRules, MARKDOWN_DISABLED_RULES } from './markdownRenderRules';
import { MobileKeyboardType, REM } from '../../../theme.style.shared';

const ButtonWrapper = ({ fit, children }) => {
    if (isMobilePlatform) {
        return children;
    } else {
        const style = fit ? {} : { width: '100%' };
        return <View style={style}>
            { children }
        </View>
    }
};

export type BaseItemProps = {
    text?: string,
    textSize?: FontSize,
    textPosition?: VerticalPosition,
    textColor?: Color,
    textSelectable?: boolean,
    lineHeight?: LineHeight,
    textNumberOfLines?: number,
    markdown?: boolean,
    code?: boolean,
    subText?: string,
    subTextWeight?: FontWeight,
    subTextSize?: FontSize,
    subTextColor?:  Color,
    subTextNumberOfLines?: number,
    accessoryText?: string,
    accessoryTextWeight?: FontWeight,
    accessoryTextSize?: FontSize,
    accessoryTextColor?: Color,
    accessoryTextBottomOffset?: VerticalOffset,
    onAccessoryTextPress?: () => void,
    leftTextInput?: boolean,
    rightTextInput?: boolean,
    digitInput?: boolean,
    numDigitInput?: number,
    inputLegend?: string,
    multilineInput?: boolean,
    secureTextEntry?: boolean,
    bullet?: boolean,
    counter?: number,
    checked?: boolean,
    toggled?: boolean,
    touchable?: boolean,
    hoverable?: boolean,
    disabled?: boolean,
    leftIndicator?: boolean,
    quoteBar?: boolean,
    leftTextOffset?: HorizontalOffset,
    rightTextOffset?: HorizontalOffset,
    topTextOffset?: VerticalOffset,
    bottomTextOffset?: VerticalOffset,
    topItemOffset?: VerticalOffset,
    bottomItemOffset?: VerticalOffset,
    leftIconId?: IconId,
    leftIconImageUrl?: string,
    leftIconSize?: IconSize,
    leftIconType?: IconType,
    leftIconPosition?: IconPosition,
    leftIconBackgroundType?: IconBackgroundType,
    leftIconInitial?: string,
    leftIconInitialColor?: Color,
    imageUrl?: string,
    imageAspectRatio?: ImageAspectRatio,
    imageResizeMode?: 'center' | 'contain' | 'cover' | 'repeat' | 'stretch',
    buttonText?: string,
    buttonType?: ButtonType,
    buttonSize?: ButtonSize,
    buttonInvert?: boolean,
    buttonDesktopFitWidth?: boolean,
    width?: ItemWidth,
    height?: ItemHeight,
    minWidth?: ItemWidth,
    minHeight?: ItemHeight,
    desktopWidth?: ItemWidth,
    desktopCenterItem?: boolean,
    centerText?: boolean,
    centerContent?: boolean,
    narrowContent?: boolean,
    textWeight?: FontWeight,
    badgeCount?: number,
    dividerPosition?: VerticalPosition,
    dividerPadding?: DividerPadding,
    backgroundType?: BackgroundType,
    backgroundColor?: Color,
    pressedBackgroundType?: BackgroundType,
    mobileKeyboardType?: MobileKeyboardType,
    webViewUrl?: string,
    webViewHtml?: string,
    qrValue?: string,
    rightIconId?: IconId,
    rightIconSize?: IconSize,
    onRightIconPress?: () => void,
    onChangeDigits?: (string) => void,
    onInlineLinkClick?: (string) => void,
    dropdownList?: string[],
    dropdownFunction?: (string) => void,
    selectedValue?: string,
};

export type ItemProps = BaseItemProps & ReactNative.TouchableOpacityProps & ReactNative.TextInputProps;

const ACCEPTED_TEXT_INPUT_PROPS = [
    'onChangeText',
    'onBlur',
    'onFocus',
    'onKeyPress',
    'value',
    'placeholder',
    'autoFocus',
    'returnKeyType',
    'keyboardType',
    'autoCorrect',
    'spellCheck',
    'autoCapitalize',
    'secureTextEntry',
];

const Item: React.FC<ItemProps> = (props) => {
    const {
        onPress,
        text,
        textPosition,
        textColor,
        textSelectable,
        lineHeight,
        textNumberOfLines,
        markdown,
        code,
        subText,
        subTextWeight,
        subTextSize,
        subTextColor,
        subTextNumberOfLines,
        accessoryText,
        accessoryTextWeight,
        accessoryTextSize,
        accessoryTextColor,
        accessoryTextBottomOffset,
        onAccessoryTextPress,
        leftTextInput,
        rightTextInput,
        digitInput,
        numDigitInput,
        inputLegend,
        multilineInput,
        secureTextEntry,
        bullet,
        counter,
        checked,
        toggled,
        touchable,
        disabled,
        leftIndicator,
        quoteBar,
        leftTextOffset,
        rightTextOffset,
        topTextOffset,
        bottomTextOffset,
        topItemOffset,
        bottomItemOffset,
        leftIconId,
        leftIconImageUrl,
        leftIconSize,
        leftIconType,
        leftIconPosition,
        leftIconBackgroundType,
        leftIconInitial,
        imageUrl,
        imageAspectRatio,
        imageResizeMode,
        buttonText,
        buttonType,
        buttonSize,
        buttonInvert,
        buttonDesktopFitWidth,
        width,
        minWidth,
        height,
        minHeight,
        desktopWidth,
        desktopCenterItem,
        centerText,
        centerContent,
        narrowContent,
        badgeCount,
        dividerPosition,
        dividerPadding,
        backgroundType,
        backgroundColor,
        pressedBackgroundType,
        mobileKeyboardType,
        webViewUrl,
        webViewHtml,
        qrValue,
        rightIconId,
        rightIconSize,
        onRightIconPress,
        onChangeDigits,
        onInlineLinkClick,
        dropdownList,
        dropdownFunction,
        selectedValue
    } = props;

    const {t} = useTranslation('Item');
    const [pressed, setPressed] = useState<boolean>(false);
    const [computedAspectRatio, setComputedAspectRatio] = useState(imageAspectRatio === ImageAspectRatio.square ? 1 : 1.618033988749895);
    const [desktopImageLayout, setDesktopImageLayout] = useState(null);

    const onImageLoad = () => {
        if (imageUrl && imageAspectRatio === ImageAspectRatio.original) {
            Image.getSize(imageUrl, (width, height) => {
                setComputedAspectRatio(width / height)
            }, () => {});
        }
    };    

    const isNarrowBackground = backgroundType === BackgroundType.narrow || backgroundType === BackgroundType.narrowButton;
    const itemHeight = defaultTo(height, ItemHeight.default);
    const textSize = defaultTo(props.textSize, FontSize.normal);
    const textWeight = defaultTo(props.textWeight, FontWeight.normal);

    const itemStyle = getItemStyle(
        defaultTo(width, null),
        defaultTo(minWidth, null),
        itemHeight,
        defaultTo(minHeight, null),
        defaultTo(textPosition, VerticalPosition.middle),
        defaultTo(topItemOffset, VerticalOffset.none),
        defaultTo(bottomItemOffset, VerticalOffset.none),
        defaultTo(centerContent, false),
        defaultTo(desktopWidth, ItemWidth.fill),
        defaultTo(desktopCenterItem, false)
    );

    const textContainerStyle = getTextContainerStyle(
        centerText || false,
        narrowContent || false
    );

    const backgroundStyle = getBackgroundStyle(
        defaultTo(backgroundType, BackgroundType.none),
        defaultTo(backgroundColor, Color.accent2)
    );

    const pressedBackgroundStyle = getBackgroundStyle(
        defaultTo(pressedBackgroundType, BackgroundType.none),
        defaultTo(backgroundColor, Color.accent2)
    );

    const textStyle = getTextStyle(
        textSize,
        textWeight,
        defaultTo(lineHeight, LineHeight.normal),
        defaultTo(textColor, Color.black),
        defaultTo(centerText, false),
        defaultTo(leftTextOffset, HorizontalOffset.default),
        defaultTo(rightTextOffset, HorizontalOffset.default),
        defaultTo(topTextOffset, VerticalOffset.small),
        defaultTo(bottomTextOffset, VerticalOffset.small),
        counter,
        pressed,
        textSelectable
    );

    const markdownTextStyle = getMarkdownTextStyle(
        textSize,
        textWeight,
        defaultTo(lineHeight, LineHeight.normal),
        defaultTo(textColor, Color.black),
        defaultTo(centerText, false),
        HorizontalOffset.none,
        HorizontalOffset.none,
        VerticalOffset.none,
        VerticalOffset.none,
        counter,
        pressed,
        textSelectable
    );

    const codeTextStyle = getCodeTextStyle(
        textSize,
        textWeight,
        defaultTo(lineHeight, LineHeight.normal),
        defaultTo(textColor, Color.black), centerText || false,
        defaultTo(leftTextOffset, HorizontalOffset.default),
        defaultTo(rightTextOffset, HorizontalOffset.default),
        defaultTo(topTextOffset, VerticalOffset.small),
        defaultTo(bottomTextOffset, VerticalOffset.small),
        counter,
        pressed
    );

    const markdownContainerStyle = getMarkdownContainerStyle(
        defaultTo(leftTextOffset, HorizontalOffset.default),
        defaultTo(rightTextOffset, HorizontalOffset.default),
        defaultTo(topTextOffset, VerticalOffset.none),
        defaultTo(bottomTextOffset, VerticalOffset.none),
        counter,
        pressed
    );

    const subTextStyle = getSubTextStyle(
        defaultTo(subTextSize, FontSize.normal),
        defaultTo(subTextWeight, FontWeight.normal),
        defaultTo(subTextColor, Color.black),
        defaultTo(leftTextOffset, HorizontalOffset.default),
        defaultTo(rightTextOffset, HorizontalOffset.default),
        pressed,
        textSelectable
    );

    const accessoryTextStyle = getAccessoryTextStyle(
        defaultTo(accessoryTextSize, FontSize.normal),
        defaultTo(accessoryTextWeight, FontWeight.normal),
        defaultTo(accessoryTextColor, Color.accent4),
        defaultTo(accessoryTextBottomOffset, VerticalOffset.none)
    );

    const badgeCountStyle = getBadgeCountStyle();
    const bulletStyle = getBulletStyle();
    const counterStyle = getCounterStyle();
    const quoteBarStyle = getQuoteBarStyle();
    
    const leftIndicatorStyle = getLeftIndicatorStyle(
        itemHeight,
        defaultTo(leftIconSize, IconSize.normal)
    );
    
    const dividerStyle = getDividerStyle(
        itemHeight,
        defaultTo(dividerPosition, VerticalPosition.bottom),
        defaultTo(dividerPadding, DividerPadding.small)
    );
    
    const leftIconStyle = getLeftIconStyle(
        defaultTo(leftIconSize, IconSize.small),
        defaultTo(leftIconType, IconType.plain),
        defaultTo(leftIconPosition, IconPosition.middle),
        defaultTo(leftIconBackgroundType, IconBackgroundType.none)
    );
    
    const rightIconStyle = getRightIconStyle(
        isNarrowBackground,
        itemHeight,
        defaultTo(rightIconSize, IconSize.small)
    );
    
    const switchContainerStyle = getSwitchContainerStyle();
    
    const leftIconInitialStyle = getLeftIconInitialStyle(
        defaultTo(leftIconSize, IconSize.small),
        defaultTo(leftIconBackgroundType, IconBackgroundType.none)
    );

    const buttonContainerStyle = getButtonContainerStyle(
        defaultTo(narrowContent, false),
        defaultTo(desktopWidth, ItemWidth.fill)
    );

    const leftTextInputStyle = getLeftTextInputStyle(
        defaultTo(textSize, FontSize.normal),
        defaultTo(textWeight, FontWeight.normal),
        defaultTo(textColor, disabled ? Color.accent5 : Color.black),
        defaultTo(itemHeight, ItemHeight.default),
        defaultTo(leftTextOffset, HorizontalOffset.default),
        defaultTo(topTextOffset, VerticalOffset.none),
        defaultTo(bottomTextOffset, VerticalOffset.none),
        code
    );

    const rightTextInputStyle = getRightTextInputStyle(
        defaultTo(textSize, FontSize.normal),
        defaultTo(textWeight, FontWeight.normal),
        defaultTo(textColor, Color.black),
        defaultTo(itemHeight, ItemHeight.default),
        defaultTo(rightTextOffset, HorizontalOffset.default),
        defaultTo(topTextOffset, VerticalOffset.none),
        defaultTo(bottomTextOffset, VerticalOffset.none),
        code
    );

    const digitInputContainerStyle = getDigitInputContainerStyle(
        defaultTo(desktopWidth, ItemWidth.fill));

    const imageContainerStyle = getImageContainerStyle(
        computedAspectRatio,
        desktopImageLayout
    );

    const imageMaskStyle = getImageMaskStyle();
    const imageStyle = getImageStyle();
    const webViewStyle = getWebViewStyle(itemHeight === ItemHeight.fill);
    const qrContainerStyle = getQRContainerStyle(desktopImageLayout);
    const dropdownStyle = getDropdownStyle();

    const textProps = getTextProps(
        defaultTo(textNumberOfLines, 1),
        defaultTo(textSelectable, false)
    );

    const subTextProps = getTextProps(
        defaultTo(subTextNumberOfLines, 0),
        defaultTo(textSelectable, false));

    const leftIconProps = getIconProps(
        leftIconId,
        leftIconImageUrl,
        defaultTo(leftIconSize, IconSize.small),
        defaultTo(leftIconType, IconType.plain)
    );
    
    const textInputProps = getTextInputProps(
        defaultTo(disabled, false),
        defaultTo(multilineInput, false),
        defaultTo(mobileKeyboardType, MobileKeyboardType.default),
        defaultTo(secureTextEntry, false)
    );
        
    const rightIconProps = getIconProps(
        rightIconId,
        undefined,
        defaultTo(rightIconSize, IconSize.small),
        IconType.plain
    );

    const shouldDisplayButton = defaultTo(buttonText, null) !== null
    const shouldDisplayInputLegend = defaultTo(inputLegend, null) !== null
    const defaultTopedText = `${defaultTo(text, '')}`; // Wrapping in a string in case text is of a different type
    const displayText = counter && counter >= 100 ? `${t('{{counter}}. {{text}}', {counter: counter, text: defaultTopedText})}` : defaultTopedText;
    const shouldDisplayText = !shouldDisplayButton && !shouldDisplayInputLegend;

    let legendLineHeight = textSize.valueOf() + textSize.valueOf() / REM;
    legendLineHeight = Math.min(legendLineHeight, itemHeight.valueOf());
    legendLineHeight = Platform.select({
        web: textSize === FontSize.h1 ? 38.0 : 36.0,
        ios: textSize === FontSize.h1 ? 38.0 : 35.0,
        android: legendLineHeight,
    });

    const view = <View style={itemStyle.item} testID={props.testID} >
        { touchable && pressed &&
            <View style={pressedBackgroundStyle.item} />
        }
        { typeof(backgroundType) !== 'undefined' &&
            <View style={backgroundStyle.item} />
        }
        { bullet &&
            <View style={bulletStyle.item} />
        }
        { (typeof counter !== 'undefined' && counter >= 0 && counter <= 99) &&
            <Text style={counterStyle.item}>{t('{{counter}}.', {counter: counter})}</Text>
        }
        { quoteBar &&
            <View style={quoteBarStyle.item} />
        }
        { leftIndicator &&
            <View style={leftIndicatorStyle.item} />
        }
        { (leftIconId || leftIconImageUrl) &&
            <View style={leftIconStyle.item}>
                <Icon {...leftIconProps} />
            </View>
        }
        { (leftIconInitial) &&
            <View style={leftIconStyle.item}>
                <Text style={leftIconInitialStyle.item}>{leftIconInitial}</Text>
            </View>
        }
        { typeof(dividerPosition) !== 'undefined' &&
            <View style={dividerStyle.item} />
        }
        { imageUrl &&
            <View style={imageContainerStyle.item}>
                <View style={imageMaskStyle.item}>
                    {imageUrl.split('.').pop().toLowerCase() === 'svg' && isMobilePlatform
                        ? <RemoteImage style={imageStyle.item} uri={imageUrl} />
                        : <Image
                            onLayout={({ nativeEvent: { layout } }) => {
                                if (!isMobilePlatform) {
                                    // Hack for making aspect ratio images work in rnweb
                                    // https://baconbrix.gitbook.io/react-native-web/styling/aspect-ratio
                                    setDesktopImageLayout(layout)
                                }
                            }}
                            style={imageStyle.item}
                            resizeMode={imageResizeMode || 'cover'}
                            source={{uri: imageUrl}}
                            onLoad={onImageLoad}
                        />
                    }
                </View>
            </View>
        }
        { shouldDisplayText &&
            <View style={textContainerStyle.item}>
                { markdown ?
                    <View style={markdownContainerStyle.container}>
                        <Markdown
                            mergeStyle={true}
                            style={merge(markdownTextStyle, codeTextStyle)}
                            {...textProps}
                            rules={textSelectable ? textSelectableRules : textNonSelectableRules}
                            onLinkPress={(url) => {
                                onInlineLinkClick && onInlineLinkClick(url);
                            }}
                            markdownit={
                                MarkdownIt({typographer: true}).disable(MARKDOWN_DISABLED_RULES)
                            }>
                            {displayText}
                        </Markdown>
                    </View>
                    :
                    (code ?
                        <Text style={codeTextStyle.codeBlock} {...textProps}>
                            {displayText}
                        </Text> :
                        <Text style={textStyle.text} {...textProps}>
                            {displayText}
                        </Text>
                    )
                }
                { defaultTo(subText, '').length > 0 &&
                    <Text style={subTextStyle.text} {...subTextProps}>{subText}</Text>
                }
            </View>
        }
        { typeof(accessoryText) !== 'undefined' &&
            <>
            { onAccessoryTextPress ?
                <TouchableOpacity onPress={onAccessoryTextPress} activeOpacity={disabled ? 1 : 0.2}>
                    <Text style={accessoryTextStyle.text}>{accessoryText}</Text>
                </TouchableOpacity> :
                <Text style={accessoryTextStyle.text}>{accessoryText}</Text>
            }
            </>
        }
        { leftTextInput &&
            <>
                { shouldDisplayInputLegend ?
                    (<Row style={{ width: '100%' }}>
                        <Text style={[textStyle.text, { minHeight: leftTextInputStyle.item.minHeight, paddingRight: 10, lineHeight: legendLineHeight }]}>{inputLegend}</Text>
                        <TextInput style={[leftTextInputStyle.item, {flex: 1, paddingLeft: 0}]} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} {...textInputProps} />
                    </Row>) :
                    (multilineInput ?
                        <AutoExpandingTextInput customstyle={leftTextInputStyle.item} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} {...textInputProps} /> :
                        (<TextInput style={leftTextInputStyle.item} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} {...textInputProps} />)
                    )
                }
            </>
        }
        { rightTextInput &&
            <>
                { shouldDisplayInputLegend ?
                    (<Row style={{ width: '100%' }}>
                        <Text style={[textStyle.text, { minHeight: rightTextInputStyle.item.minHeight, paddingRight: 10, lineHeight: legendLineHeight }]}>{inputLegend}</Text>
                        <TextInput style={[rightTextInputStyle.item, { flex: 1, paddingLeft: 0 }]} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} {...textInputProps} />
                    </Row>) :
                    (multilineInput ?
                        <AutoExpandingTextInput customstyle={rightTextInputStyle.item} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} {...textInputProps} /> :
                        <TextInput style={rightTextInputStyle.item} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} {...textInputProps} />
                    )
                }
            </>
        }
        { digitInput &&
            <>
                <View style={digitInputContainerStyle.item}>
                    <DigitInput numDigits={numDigitInput} onChangeDigits={onChangeDigits} {...pick(props, ACCEPTED_TEXT_INPUT_PROPS)} />
                </View>
            </>
        }
        { (typeof(badgeCount) !== 'undefined' && badgeCount > 0) &&
            <View style={badgeCountStyle.item}>
                <Text style={badgeCountStyle.text}>{badgeCount}</Text>
            </View>
        }
        { checked &&
            <View style={rightIconStyle.item}>
                <Icon svgIconId={defaultTo(disabled, false) ? IconId.feather_checkmark_stroke_accent3 : IconId.feather_checkmark_stroke_success} iconSize={IconSize.small} />
            </View>
        }
        { typeof(toggled) !== 'undefined' &&
            <View style={switchContainerStyle.item}>
                <Switch value={toggled} onSyncPress={(value) => { !disabled && onPress && onPress(value); }} />
            </View>
        }
        { dropdownList &&
            <Picker style={ dropdownStyle.item} selectedValue={selectedValue} onValueChange={(itemValue, itemIndex) => dropdownFunction(itemValue)}>
                { 
                    dropdownList.map( data => { return (<Picker.Item label={data} value={data} key={data}/>) } ) 
                }
            </Picker>
        }
        { (defaultTo(rightIconId, null) !== null) &&
            <>
                { onRightIconPress ?
                    <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.2} style={rightIconStyle.item}>
                        <Icon {...rightIconProps} />
                    </TouchableOpacity> :
                    <View style={rightIconStyle.item}>
                        <Icon {...rightIconProps} />
                    </View>
                }
            </>
        }
        { shouldDisplayButton &&
            <ButtonWrapper fit={buttonDesktopFitWidth}>
                <Button
                    onPress={onPress}
                    style={buttonContainerStyle.item}
                    title={buttonText}
                    disabled={defaultTo(disabled, false)}
                    type={buttonType}
                    invert={buttonInvert}
                    size={defaultTo(buttonSize, ButtonSize.normal)}
                />
            </ButtonWrapper>
        }
        { defaultTo(webViewUrl, null) !== null &&
            <View style={webViewStyle.item}>
                <WebView sourceUri={webViewUrl} style={{ width: '100%', height: '100%' }}/>
            </View>
        }
        { defaultTo(webViewHtml, null) !== null &&
            <View style={webViewStyle.item}>
                <WebView sourceHtml={webViewHtml} style={{ width: '100%', height: '100%' }}/>
            </View>
        }
        { defaultTo(qrValue, null) !== null &&
            <View style={qrContainerStyle.item}>
                <QR value={qrValue} size={200} />
            </View>
        }
        { defaultTo(props.children, null) !== null &&
            <View style={{ width: '100%', height: '100%' }}>
                { props.children }
            </View>
        }
    </View>

    return (touchable ?
        (<TouchableOpacity
            disabled={disabled || false}
            onPress={(event) => { !disabled && onPress && onPress(event); }}
            onPressOut={() => { setPressed(false); }}
            onPressIn={() => { setPressed(true); }}
            activeOpacity={disabled ? 1 : 0.95}
        >
            {view}
        </TouchableOpacity>) :
        view
    );
}

export default memo(Item);
