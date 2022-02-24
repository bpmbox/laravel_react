import React, { useEffect, useState } from 'react';
import ReactNative, { TextInput, StyleSheet, View } from 'react-native';
import Row from '../Layout/Row';
import theme, { Color, FontSize } from '../../../theme.style';
import fill from 'lodash/fill';
import set from 'lodash/set';
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import indexOf from 'lodash/indexOf';

type DigitInputProps = {
    numDigits?: number,
    onChangeDigits?: (string) => void,
} & ReactNative.TouchableOpacityProps;

const DigitInput: React.FC<DigitInputProps> = (props) => {
    const numDigits = props.numDigits || 4;
    const [digits, setDigits] = useState<(number|null)[]>(fill(Array(numDigits), null));
    const indexOfNull = indexOf(digits, null)
    const selectedInput = indexOfNull < 0 ? numDigits : indexOfNull;

    const handleOnKeyPress = (event) => {
        const key = event.nativeEvent.key;
        if (key === 'Backspace') {
            if (selectedInput > 0) {
                let newDigits = Array.from(digits);
                set(newDigits, `[${selectedInput-1}]`, null);
                setDigits(newDigits);
            }
        } else if (/^\d+$/.test(key)) {
            const selectedInput = indexOf(digits, null);
            let newDigits = Array.from(digits);
            set(newDigits, `[${selectedInput}]`, parseInt(key));
            setDigits(newDigits);
        }
    }

    useEffect(() => {
        props.onChangeDigits && props.onChangeDigits(digits.filter((item) => { return item !== null }).join(''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [digits]);

    return <View style={styles.row}>
        <Row>
            { Array.from(Array(numDigits).keys()).map((index) => {
                const selected = index === selectedInput;
                return <View key={index} style={[styles.itemContainer, (selected ? styles.selected : {})]}>
                    <TextInput
                        value={`${defaultTo(get(digits, `[${index}]`, null), '')}`}
                        style={styles.input}
                        keyboardType='number-pad'
                        editable={true}
                        caretHidden
                        blurOnSubmit={false}
                        autoFocus
                        returnKeyType='next'
                        autoCorrect={false}
                        onKeyPress={(event) => handleOnKeyPress(event)}
                    />
                </View>
            })}
        </Row>
    </View>;
}

const styles = StyleSheet.create({
    row: {
        height: '100%',
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: theme.borderWidth,
        borderColor: Color.accent5.valueOf(),
        borderRadius: theme.radius,
    },
    selected: {
        borderWidth: 8 * theme.borderWidth,
        borderColor: Color.success.valueOf(),
    },
    input: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: FontSize.h2.valueOf(),
    },
});

export default DigitInput;
