import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, Animated, Easing, PanResponder, PanResponderGestureState, GestureResponderEvent } from 'react-native';
import { Color } from '../../../theme.style'

type ComponentProps = {
    value: boolean,
    disabled?: boolean,
    onSyncPress?: (event: GestureResponderEvent) => void,
    onAsyncPress?: (callback?: any) => void
}

const handlerAnimation = new Animated.Value(22)

const Component: FunctionComponent<ComponentProps> = (props) => {
    const [value, setValue] = useState<boolean>(props.value);
    const [toggleable, setToggleable] = useState<boolean>(false);
    const width = 40
    const height = 26
    const handlerSize = height - 4
    const offset = width - height + 1
    const switchAnimation = new Animated.Value(value ? -1 : 1)

    const onPanResponderGrant = () => {
        if (props.disabled) { return }
        setToggleable(true)
        animateHandler(handlerSize * 6 / 5)
    }

    const onPanResponderMove = (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (props.disabled) { return }
        setToggleable(value ? (gestureState.dx < 10) : (gestureState.dx > -10))
    }

    const onPanResponderRelease = (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (props.disabled) { return }
        if (toggleable) {
            if (props.onSyncPress) {
                toggleSwitch(true, props.onSyncPress)
            } else if (props.onAsyncPress) {
                props.onAsyncPress(toggleSwitch)
            }
        } else {
            animateHandler(handlerSize)
        }
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => true,
        onPanResponderGrant: onPanResponderGrant,
        onPanResponderMove: onPanResponderMove,
        onPanResponderRelease: onPanResponderRelease
    })

    const interpolatedBackgroundColor = switchAnimation.interpolate({
        inputRange: value ? [-offset, -1]: [1, offset],
        outputRange: [Color.accent4.valueOf(), Color.success.valueOf()],
        extrapolate: 'clamp'
    })

    const animateHandler = (toValue: number, callback = () => null) => {
        Animated.timing(handlerAnimation, {
            toValue: toValue,
            duration: 200,
            easing: Easing.linear
        }
        ).start(callback)
    }

    const toggleSwitch = (result: any | null, callback: any) => {
        toggleSwitchToValue(result, !value, callback)
    }

    const toggleSwitchToValue = (result: any | null, toValue: boolean, callback = (v: boolean) => null) => {
        animateHandler(handlerSize)
        if (result) {
            animateSwitch(toValue, () => {
                setValue(toValue)
                callback(toValue)
                return null
            })
            switchAnimation.setValue(toValue ? -1 : 1)
        }
    }

    const animateSwitch = (value: boolean, callback = () => null) => {
        Animated.timing(switchAnimation, {
            toValue: value ? offset : -offset,
            duration: 1000,
            easing: Easing.linear
        }
        ).start(callback)
    }

    return <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    width: width,
                    height: height,
                    alignItems: value ? 'flex-end' : 'flex-start',
                    borderRadius: height / 2,
                    // TODO - figure out how to animate this
                    backgroundColor: interpolatedBackgroundColor
                }
            ]}>
            <Animated.View style={[{
                backgroundColor: Color.white.valueOf(),
                width: handlerAnimation,
                height: handlerSize,
                borderRadius: handlerSize / 2,
                marginRight: value ? 2 : 0,
                marginLeft: value ? 0 : 2
            }]} />
        </Animated.View>
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        justifyContent: 'center'
    }
})

export default Component;
