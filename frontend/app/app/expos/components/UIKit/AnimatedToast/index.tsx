import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TouchableOpacity, StyleSheet } from 'react-native';
import { useToast } from './ToastContext';
import Toast from '../items/Toast';
import { isMobilePlatform } from '../../../libs/platform';

export const AnimatedToast = () => {
    const { toast, hide } = useToast();
    const [visible, setVisible] = useState(false);
    const translateYRef = useRef(new Animated.Value(0));

    useEffect(() => {
        if (toast.visible && toast.message) {
            setVisible(true);
            Animated.timing(translateYRef.current, {
                duration: 200,
                easing: Easing.ease,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateYRef.current, {
                duration: 300,
                easing: Easing.ease,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }
    }, [toast]);

    return (
        <Animated.View style={[isMobilePlatform ? style.containerMobile : style.containerDesktop,
            {
                opacity: translateYRef.current,
                transform: [{
                    translateY: translateYRef.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0]
                    }),
                }]
            }
            ]}>
            { visible  &&
                <TouchableOpacity onPress={hide} activeOpacity={0.9}>
                    <Toast text={toast.message} />
                </TouchableOpacity>
            }
        </Animated.View>
    );
};

const style = StyleSheet.create({
    containerMobile: {
        position: 'absolute',
        bottom: 90,
        zIndex: 100,
        right: 0,
        left: 0,
    },
    containerDesktop: {
        position: 'absolute',
        bottom: 10,
        zIndex: 100,
        right: 10,
        width: 400,
    }
});

export default AnimatedToast;
