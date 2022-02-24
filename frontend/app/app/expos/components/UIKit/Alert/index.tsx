import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { useAlert } from './AlertContext';
import Text from '../items/Text';
import Spacer from '../items/Spacer';
import theme, { ItemWidth, ItemHeight, ButtonType, Color } from '../../../theme.style';
import Button from '../items/Button';
import defaultTo from 'lodash/defaultTo';
import { useTranslation } from 'react-i18next';
import find from 'lodash/find';
import get from 'lodash/get';

export const Alert = () => {
    const { t } = useTranslation('Alert');
    const { alert, hide } = useAlert();
    const [visible, setVisible] = useState(false);
    const animationRef = useRef(new Animated.Value(0));
    const title = defaultTo(alert.title, '');
    const description = defaultTo(alert.description, '');
    const cancelable = defaultTo(alert.cancelable, true);
    const buttons = defaultTo(alert.buttons, []);
    const cancelButton = find(buttons, (button) => { return button.style === 'cancel'});
    const nonCancelButtons = buttons.filter((button) => { return button.style !== 'cancel'});
    const cancelButtonLabel = get(cancelButton, 'text', t`Cancel`);
    const cancelButtonOnPress = get(cancelButton, 'onPress', hide);

    useEffect(() => {
        if (alert.visible && (title !== '' || description !== '')) {
            setVisible(true);
            Animated.timing(animationRef.current, {
                duration: 50,
                easing: Easing.ease,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animationRef.current, {
                duration: 50,
                easing: Easing.ease,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }
    }, [alert, description, title]);

    if (!visible || (title === '' && description === '')) {
        return null;
    }

    return (<View style={style.container}>
            <TouchableWithoutFeedback onPress={hide}>
                <Animated.View style={[style.overlay,
                {
                    opacity: animationRef.current
                }]} />
            </TouchableWithoutFeedback>
            <Animated.View style={[style.alert,
                {
                    opacity: animationRef.current,
                    transform: [{
                        scale: animationRef.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.95, 1]
                        }),
                    }]
                }]}>
                <Spacer height={ItemHeight.xsmall} />
                { title !== null &&
                    <Text text={title} semibold />
                }
                { description !== null &&
                    <Text text={description} light small />
                }
                <Spacer height={ItemHeight.xsmall} />
                { nonCancelButtons && nonCancelButtons.map((button, index) =>
                    <Button
                        testID="AlertConfirm"
                        key={index}
                        text={button.text}
                        type={button.style === 'destructive' ? ButtonType.error : ButtonType.secondary}
                        onPress={() => {
                            button.onPress && button.onPress();
                            hide();
                        }}
                    />
                )}
                { cancelable &&
                    <Button text={cancelButtonLabel}
                        testID="AlertCancel"
                        type={ButtonType.text}
                        onPress={() => {
                        cancelButtonOnPress();
                        hide();
                    }} hideLinkBackgroundOnPress />
                }
                <Spacer height={ItemHeight.xsmall} />
            </Animated.View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    overlay: {
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 90,
        backgroundColor: Color.darken2.valueOf(),
    },
    alert: {
        backgroundColor: Color.white.valueOf(),
        width: ItemWidth.xnarrow.valueOf(),
        maxWidth: '80%',
        maxHeight: '80%',
        margin: 'auto',
        borderRadius: theme.radius,
        overflow: 'hidden',
        shadowColor: Color.darken1.valueOf(),
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 15,
        zIndex: 91,
        paddingHorizontal: theme.modalHorizontalPadding,
        paddingVertical: theme.modalVerticalPadding,
    }
});

export default Alert;
