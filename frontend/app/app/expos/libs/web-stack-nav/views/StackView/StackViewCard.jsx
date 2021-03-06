import React from 'react';
import { Animated, StyleSheet, Platform } from 'react-native';
import Screen from './Screen';
import createPointerEventsContainer from './createPointerEventsContainer';
import { Color } from '../../../../theme.style';

const EPS = 1e-5;
function getAccessibilityProps(isActive) {
    if (Platform.OS === 'ios') {
        return {
            accessibilityElementsHidden: !isActive,
        };
    } else if (Platform.OS === 'android') {
        return {
            importantForAccessibility: isActive ? 'yes' : 'no-hide-descendants',
        };
    } else {
        return null;
    }
}

/**
 * Component that renders the scene as card for the <StackView />.
 */
class Card extends React.Component {
    render() {
        const {
            children,
            pointerEvents,
            style,
            position,
            transparent,
            scene: { index, isActive },
        } = this.props;

        const active =
            transparent || isActive
                ? 1
                : position.interpolate({
                        inputRange: [index, index + 1 - EPS, index + 1],
                        outputRange: [1, 1, 0],
                        extrapolate: 'clamp',
                    });

        // animatedStyle can be `false` if there is no screen interpolator
        const animatedStyle = this.props.animatedStyle || {};

        const {
            shadowOpacity,
            overlayOpacity,
            ...containerAnimatedStyle
        } = animatedStyle;

        let flattenedStyle = StyleSheet.flatten(style) || {};
        let { backgroundColor, ...screenStyle } = flattenedStyle;

        return (
            <Screen
                pointerEvents={pointerEvents}
                onComponentRef={this.props.onComponentRef}
                style={[StyleSheet.absoluteFill, containerAnimatedStyle, screenStyle]}
                active={active}
            >
                {!transparent && shadowOpacity ? (
                    <Animated.View
                        style={[styles.shadow, { shadowOpacity }]}
                        pointerEvents='none'
                    />
                ) : null}
                <Animated.View
                    {...getAccessibilityProps(isActive)}
                    style={[
                        transparent ? styles.transparent : styles.card,
                        backgroundColor && backgroundColor !== 'transparent'
                            ? { backgroundColor }
                            : null,
                    ]}
                >
                    {children}
                </Animated.View>
                {overlayOpacity ? (
                    <Animated.View
                        pointerEvents='none'
                        style={[styles.overlay, {
                            opacity: overlayOpacity
                        }]}
                    />
                ) : null}
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: Color.white.valueOf(),
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Color.black.valueOf(),
    },
    shadow: {
        top: 0,
        left: 0,
        bottom: 0,
        position: 'absolute',
        backgroundColor: Color.white.valueOf(),
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 5,
        shadowColor: Color.black.valueOf(),
    },
    transparent: {
        flex: 1,
    },
});

export default createPointerEventsContainer(Card);
