/* istanbul ignore file */
import React from 'react';
import {
    Animated,
    StyleSheet,
    Platform,
    View,
    I18nManager,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import {
    SceneView,
    NavigationProvider,
} from '@react-navigation/core';
import ScreenContainer from './ScreenContainer';
import Card from './StackViewCard';
import Header from '../Header/Header';
import TransitionConfigs from './StackViewTransitionConfigs';
import HeaderStyleInterpolator from '../Header/HeaderStyleInterpolator';
import StackGestureContext from '../../utils/StackGestureContext';
import theme, { Color, ItemWidth, DesktopHeaderType } from '../../../../theme.style';
import ModalCloseHeader from '../../../../components/UIKit/items/ModalCloseHeader';
import get from 'lodash/get';
import Row from '../../../../components/UIKit/Layout/Row';

// Dev Note: This code was taken from another source, and slightly tweaked to work on
// web.  Since this is not code we maintain, just force DEV mode false.
const __DEV__ = false;

const IPHONE_XS_HEIGHT = 812; // iPhone X and XS
const IPHONE_XR_HEIGHT = 896; // iPhone XR and XS Max
const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');
const IS_IPHONE_X =
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (WINDOW_HEIGHT === IPHONE_XS_HEIGHT ||
        WINDOW_WIDTH === IPHONE_XS_HEIGHT ||
        WINDOW_HEIGHT === IPHONE_XR_HEIGHT ||
        WINDOW_WIDTH === IPHONE_XR_HEIGHT);

/**
 * Enumerate possible values for validation
 */
const HEADER_LAYOUT_PRESET = ['center', 'left'];
const HEADER_TRANSITION_PRESET = ['fade-in-place', 'uikit'];
const HEADER_BACKGROUND_TRANSITION_PRESET = ['toggle', 'fade', 'translate'];

const getDefaultHeaderHeight = (isLandscape) => {
    if (Platform.OS === 'ios') {
        if (isLandscape && !Platform.isPad) {
            return 32;
        }
        if (IS_IPHONE_X) {
            return 88;
        }
        return 64;

    }
    return 56;

};

class StackViewLayout extends React.Component {
    /**
     * immediateIndex is used to represent the expected index that we will be on after a
     * transition. To achieve a smooth animation when swiping back, the action to go back
     * doesn't actually fire until the transition completes. The immediateIndex is used during
     * the transition so that gestures can be handled correctly. This is a work-around for
     * cases when the user quickly swipes back several times.
     */
    constructor(props) {
        super(props);
        this.panGestureRef = React.createRef();
        this.gestureX = new Animated.Value(0);
        this.gestureY = new Animated.Value(0);
        this.positionSwitch = new Animated.Value(1);
        this.fadeAnim = new Animated.Value(0);
        if (Animated.subtract) {
            this.gestureSwitch = Animated.subtract(1, this.positionSwitch);
        } else {
            this.gestureSwitch = Animated.add(
                1,
                Animated.multiply(-1, this.positionSwitch)
            );
        }

        this.state = {
            // Used when card's header is null and mode is float to make transition
            // between screens with headers and those without headers smooth.
            // This is not a great heuristic here. We don't know synchronously
            // on mount what the header height is so we have just used the most
            // common cases here.
            floatingHeaderHeight: getDefaultHeaderHeight(props.isLandscape),
        };
    }

    _renderHeader(scene, headerMode) {
        const { options } = scene.descriptor;
        const { header } = options;

        const headerType = get(options, 'desktopHeaderType', null);
        const desktopShowClose = get(options, 'desktopShowClose', false);
        if (headerType === DesktopHeaderType.none) {
            return null;
        }
        if (headerType === DesktopHeaderType.plain) {
            if (options.headerRight) {
                return <Row>
                        <View style={{flex: 1}}>
                            <ModalCloseHeader
                                title={get(options, 'title', null)}
                                showClose={desktopShowClose}
                                onClosePress={() => scene.descriptor.navigation.goBack()} />
                        </View>
                        {options.headerRight}
                    </Row>
            } else {
                return <ModalCloseHeader
                    style={{ width: '100%' }}
                    title={get(options, 'title', null)}
                    showClose={desktopShowClose}
                    onClosePress={() => scene.descriptor.navigation.goBack()} />
            }
        }

        if (__DEV__ && typeof header === 'string') {
            throw new Error(
                `Invalid header value: "${header}". The header option must be a valid React component or null, not a string.`
            );
        }

        if (header === null && headerMode === 'screen') {
            return null;
        }

        // check if it's a react element
        if (React.isValidElement(header)) {
            return header;
        }

        // Handle the case where the header option is a function, and provide the default
        const renderHeader = header || ((props) => <Header {...props} />);

        let {
            headerLeftInterpolator,
            headerTitleInterpolator,
            headerRightInterpolator,
            headerBackgroundInterpolator,
        } = this._transitionConfig;

        const backgroundTransitionPresetInterpolator = this._getHeaderBackgroundTransitionPreset();
        if (backgroundTransitionPresetInterpolator) {
            headerBackgroundInterpolator = backgroundTransitionPresetInterpolator;
        }

        const {transitionProps, ...passProps} = this.props;

        return (
            <NavigationProvider value={scene.descriptor.navigation}>
                {renderHeader({
                    ...passProps,
                    ...transitionProps,
                    position: this.position,
                    scene,
                    mode: headerMode,
                    transitionPreset: this._getHeaderTransitionPreset(),
                    layoutPreset: this._getHeaderLayoutPreset(),
                    backTitleVisible: this._getHeaderBackTitleVisible(),
                    leftInterpolator: headerLeftInterpolator,
                    titleInterpolator: headerTitleInterpolator,
                    rightInterpolator: headerRightInterpolator,
                    backgroundInterpolator: headerBackgroundInterpolator,
                })}
            </NavigationProvider>
        );
    }

    _onFloatingHeaderLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        if (height !== this.state.floatingHeaderHeight) {
            this.setState({floatingHeaderHeight: height});
        }
    };

    _prepareAnimated() {
        if (this.props === this._prevProps) {
            return;
        }
        this._prevProps = this.props;

        this._prepareGesture();
        this._preparePosition();
        this._prepareTransitionConfig();
    }

    render() {
        this._prepareAnimated();

        const { transitionProps } = this.props;
        const { scenes } = transitionProps;

        const headerMode = this._getHeaderMode();
        let floatingHeader = null;
        if (headerMode === 'float') {
            const {scene} = transitionProps;
            floatingHeader = (
                <View
                    style={styles.floatingHeader}
                    pointerEvents="box-none"
                    onLayout={this._onFloatingHeaderLayout}
                >
                    {this._renderHeader(scene, headerMode)}
                </View>
            );
        }

        return (
            <Animated.View
                style={[styles.container, this._transitionConfig.containerStyle]}
            >
                <StackGestureContext.Provider value={this.panGestureRef}>
                    <ScreenContainer style={styles.scenes}>
                        {scenes.map(this._renderCard)}
                    </ScreenContainer>
                    {floatingHeader}
                </StackGestureContext.Provider>
            </Animated.View>
        );
    }

    componentDidUpdate(prevProps) {
        const {state: prevState} = prevProps.transitionProps.navigation;
        const {state} = this.props.transitionProps.navigation;
        if (prevState.index !== state.index) {
            this._maybeCancelGesture();
        }
    }

    _isGestureEnabled() {
        const gesturesEnabled = this.props.transitionProps.scene.descriptor.options
            .gesturesEnabled;
        return typeof gesturesEnabled === 'boolean'
            ? gesturesEnabled
            : Platform.OS === 'ios';
    }

    _isMotionVertical() {
        return this._isModal();
    }

    _isModal() {
        return this.props.mode === 'modal';
    }

    // This only currently applies to the horizontal gesture!
    _isMotionInverted() {
        const {
            transitionProps: {scene},
        } = this.props;
        const {options} = scene.descriptor;
        const {gestureDirection} = options;

        if (this._isModal()) {
            return gestureDirection === 'inverted';
        }
        return typeof gestureDirection === 'string'
            ? gestureDirection === 'inverted'
            : I18nManager.isRTL;
    }

    // note: this will not animated so nicely because the position is unaware
    // of the gesturePosition, so if we are in the middle of swiping the screen away
    // and back is programatically fired then we will reset to the initial position
    // and animate from there
    _maybeCancelGesture() {
        this.positionSwitch.setValue(1);
    }

    _prepareGesture() {
        if (!this._isGestureEnabled()) {
            if (this.positionSwitch.__getValue() !== 1) {
                this.positionSwitch.setValue(1);
            }
            this.gesturePosition = undefined;
            return;
        }

        // We can't run the gesture if width or height layout is unavailable
        if (
            this.props.transitionProps.layout.width.__getValue() === 0 ||
            this.props.transitionProps.layout.height.__getValue() === 0
        ) {
            return;
        }

        if (this._isMotionVertical()) {
            this._prepareGestureVertical();
        } else {
            this._prepareGestureHorizontal();
        }
    }

    _prepareGestureHorizontal() {
        const {index} = this.props.transitionProps.navigation.state;

        if (this._isMotionInverted()) {
            this.gesturePosition = Animated.add(
                index,
                Animated.divide(this.gestureX, this.props.transitionProps.layout.width)
            ).interpolate({
                inputRange: [index - 1, index],
                outputRange: [index - 1, index],
                extrapolate: 'clamp',
            });
        } else {
            this.gesturePosition = Animated.add(
                index,
                Animated.multiply(
                    -1,
                    Animated.divide(
                        this.gestureX,
                        this.props.transitionProps.layout.width
                    )
                )
            ).interpolate({
                inputRange: [index - 1, index],
                outputRange: [index - 1, index],
                extrapolate: 'clamp',
            });
        }
    }

    _prepareGestureVertical() {
        const {index} = this.props.transitionProps.navigation.state;

        if (this._isMotionInverted()) {
            this.gesturePosition = Animated.add(
                index,
                Animated.divide(this.gestureY, this.props.transitionProps.layout.height)
            ).interpolate({
                inputRange: [index - 1, index],
                outputRange: [index - 1, index],
                extrapolate: 'clamp',
            });
        } else {
            this.gesturePosition = Animated.add(
                index,
                Animated.multiply(
                    -1,
                    Animated.divide(
                        this.gestureY,
                        this.props.transitionProps.layout.height
                    )
                )
            ).interpolate({
                inputRange: [index - 1, index],
                outputRange: [index - 1, index],
                extrapolate: 'clamp',
            });
        }
    }

    _getHeaderMode() {
        if (this.props.headerMode) {
            return this.props.headerMode;
        }
        if (Platform.OS === 'android' || this.props.mode === 'modal') {
            return 'screen';
        }
        return 'float';
    }

    _getHeaderBackgroundTransitionPreset() {
        const { headerBackgroundTransitionPreset } = this.props;
        if (headerBackgroundTransitionPreset) {
            if (
                HEADER_BACKGROUND_TRANSITION_PRESET.includes(
                    headerBackgroundTransitionPreset
                )
            ) {
                if (headerBackgroundTransitionPreset === 'fade') {
                    return HeaderStyleInterpolator.forBackgroundWithFade;
                }
                if (headerBackgroundTransitionPreset === 'translate') {
                    return HeaderStyleInterpolator.forBackgroundWithTranslation;
                }
                if (headerBackgroundTransitionPreset === 'toggle') {
                    return HeaderStyleInterpolator.forBackgroundWithInactiveHidden;
                }
            } else if (__DEV__) {
                console.error(
                    `Invalid configuration applied for headerBackgroundTransitionPreset - expected one of ${HEADER_BACKGROUND_TRANSITION_PRESET.join(
                        ', '
                    )} but received ${JSON.stringify(headerBackgroundTransitionPreset)}`
                );
            }
        }

        return null;
    }

    _getHeaderLayoutPreset() {
        const { headerLayoutPreset } = this.props;
        if (headerLayoutPreset) {
            if (__DEV__) {
                if (
                    this._getHeaderTransitionPreset() === 'uikit' &&
                    headerLayoutPreset === 'left' &&
                    Platform.OS === 'ios'
                ) {
                    console.warn(
                        `headerTransitionPreset with the value 'uikit' is incompatible with headerLayoutPreset 'left'`
                    );
                }
            }
            if (HEADER_LAYOUT_PRESET.includes(headerLayoutPreset)) {
                return headerLayoutPreset;
            }

            if (__DEV__) {
                console.error(
                    `Invalid configuration applied for headerLayoutPreset - expected one of ${HEADER_LAYOUT_PRESET.join(
                        ', '
                    )} but received ${JSON.stringify(headerLayoutPreset)}`
                );
            }
        }

        if (Platform.OS === 'android') {
            return 'left';
        }
        return 'center';
    }

    _getHeaderTransitionPreset() {
        // On Android or with header mode screen, we always just use in-place,
        // we ignore the option entirely (at least until we have other presets)
        if (Platform.OS === 'android' || this._getHeaderMode() === 'screen') {
            return 'fade-in-place';
        }

        const { headerTransitionPreset } = this.props;
        if (headerTransitionPreset) {
            if (HEADER_TRANSITION_PRESET.includes(headerTransitionPreset)) {
                return headerTransitionPreset;
            }

            if (__DEV__) {
                console.error(
                    `Invalid configuration applied for headerTransitionPreset - expected one of ${HEADER_TRANSITION_PRESET.join(
                        ', '
                    )} but received ${JSON.stringify(headerTransitionPreset)}`
                );
            }
        }

        return 'fade-in-place';
    }

    _getHeaderBackTitleVisible() {
        const { headerBackTitleVisible } = this.props;
        const layoutPreset = this._getHeaderLayoutPreset();

        // Even when we align to center on Android, people should need to opt-in to
        // showing the back title
        const enabledByDefault = layoutPreset !== 'left' && Platform.OS !== 'android';

        return typeof headerBackTitleVisible === 'boolean'
            ? headerBackTitleVisible
            : enabledByDefault;
    }

    _renderInnerScene(scene) {
        const { navigation, getComponent } = scene.descriptor;
        const SceneComponent = getComponent();

        const { screenProps } = this.props;
        const headerMode = this._getHeaderMode();
        if (headerMode === 'screen') {
            return (
                <View style={styles.container}>
                    <View style={styles.scenes}>
                        <SceneView
                            screenProps={screenProps}
                            navigation={navigation}
                            component={SceneComponent}
                        />
                    </View>
                    {this._renderHeader(scene, headerMode)}
                </View>
            );
        }

        return (
            <SceneView
                screenProps={screenProps}
                navigation={navigation}
                component={SceneComponent}
            />
        );
    }

    _prepareTransitionConfig() {
        this._transitionConfig = TransitionConfigs.getTransitionConfig(
            this.props.transitionConfig,
            {
                ...this.props.transitionProps,
                position: this.position,
            },
            this.props.lastTransitionProps,
            this._isModal()
        );
    }

    _preparePosition() {
        if (this.gesturePosition) {
            this.position = Animated.add(
                Animated.multiply(
                    this.props.transitionProps.position,
                    this.positionSwitch
                ),
                Animated.multiply(this.gesturePosition, this.gestureSwitch)
            );
        } else {
            this.position = this.props.transitionProps.position;
        }
    }

    _renderCard = (scene) => {
        const {
            transitionProps,
            shadowEnabled,
            cardOverlayEnabled,
            transparentCard,
            cardStyle,
        } = this.props;

        const {screenInterpolator} = this._transitionConfig;
        const style =
            screenInterpolator &&
            screenInterpolator({
                ...transitionProps,
                shadowEnabled,
                cardOverlayEnabled,
                position: this.position,
                scene,
            });

        // When using a floating header, we need to add some top
        // padding on the scene.
        const { options } = scene.descriptor;
        const hasHeader = options.header !== null;
        const headerMode = this._getHeaderMode();
        const desktopModalHeight = get(options, 'desktopModalHeight', null)
        const desktopFullPage = get(options, 'desktopFullPage', null)
        
        let paddingTopStyle;
        if (hasHeader && headerMode === 'float' && !options.headerTransparent) {
            paddingTopStyle = { paddingTop: this.state.floatingHeaderHeight };
        }

        // If this scene is in modal stack and this is not the default screen then
        // display this as an inline modal
        const isInlineModal = this._isModal() && this.props.initialRouteName !== scene.route.routeName;
        const isInlineModalFullPage = isInlineModal && desktopFullPage;
        const isInlineModalNarrowPage = isInlineModal && !desktopFullPage;

        const card = <Card
                {...transitionProps}
                key={`card_${scene.key}`}
                position={this.position}
                realPosition={transitionProps.position}
                animatedStyle={style}
                transparent={transparentCard}
                style={[
                    paddingTopStyle,
                    cardStyle,
                    isInlineModal && styles.inlineModal,
                    isInlineModalFullPage && styles.inlineModalFullPage,
                    isInlineModalNarrowPage && styles.inlineModalNarrow,
                    desktopModalHeight && { height: desktopModalHeight },
                ]} scene={scene}>
                {this._renderInnerScene(scene)}
            </Card>;

        if (!isInlineModal) {
            return card;
        }

        return <View style={styles.fillScreen} key={`card_${scene.key}`}>
            <Animated.View style={[
                    styles.inlineModalOverlay,
                    {
                        opacity: transitionProps.position.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        })
                    }
                ]}>
                <TouchableWithoutFeedback onPress={() => {
                    scene.descriptor.navigation.goBack();
                }}>
                    <View style={{flex: 1}}/>
                </TouchableWithoutFeedback>
            </Animated.View>
            {card}
        </View>
    };
}

const styles = StyleSheet.create({
    fillScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    container: {
        flex: 1,
        // Header is physically rendered after scenes so that Header won't be
        // covered by the shadows of the scenes.
        // That said, we'd have use `flexDirection: 'column-reverse'` to move
        // Header above the scenes.
        flexDirection: 'column-reverse',
        overflow: 'hidden',
    },
    scenes: {
        flex: 1,
    },
    floatingHeader: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
    },
    inlineModalOverlay: {
        backgroundColor: Color.darken2.valueOf(),
        flex: 1,
    },
    inlineModal: {
        margin: 'auto',
        borderRadius: theme.radius,
        overflow: 'hidden',
        shadowColor: Color.darken1.valueOf(),
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 25,
    },
    inlineModalNarrow: {
        maxHeight: '80%',
        maxWidth: ItemWidth.narrow.valueOf(),
    },
    inlineModalFullPage: {
        maxHeight: '90%',
        maxWidth: '90%',
    }
});

export default StackViewLayout;
