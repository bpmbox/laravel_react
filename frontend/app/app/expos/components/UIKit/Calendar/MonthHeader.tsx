import React, { FunctionComponent } from 'react';
import Row from '../Layout/Row';
import { View, StyleSheet } from 'react-native';
import Item from '../Item';
import theme, { FontSize, ItemHeight, Color, FontWeight, IconSize } from '../../../theme.style';
import IconButton from '../Button/IconButton';
import { IconId } from '../../../assets/native/svg-icons';
import { DateTime } from 'luxon';
import Spacer from '../items/Spacer';
import { monthYearFormat } from '../../../libs/datetime';

type MonthHeaderProps = {
    monthYear: DateTime,
    onPrevPress: () => void,
    onNextPress: () => void,
};

const MonthHeader: FunctionComponent<MonthHeaderProps> = (props) => {
    return <Row style={styles.row}>
        <View style={styles.title}>
            <Item
                text={props.monthYear.toFormat(monthYearFormat)}
                height={ItemHeight.default}
                textSize={FontSize.normal}
                textWeight={FontWeight.semibold}
                textColor={Color.black}
            />
        </View>
        <Row style={styles.buttons}>
            <IconButton iconId={IconId.system_back_grey} onPress={props.onPrevPress} size={IconSize.xsmall} />
            <Spacer horizontal height={ItemHeight.xsmall} />
            <IconButton iconId={IconId.system_forward_grey} onPress={props.onNextPress} size={IconSize.xsmall} />
        </Row>
    </Row>;
};

const styles = StyleSheet.create({
    row: {
        width: '100%',
        display: 'flex'
    },
    title: {
        flexGrow: 1,
    },
    buttons: {
        flexShrink: 0,
        marginRight: theme.horizontalPadding
    },
});

export default MonthHeader;
