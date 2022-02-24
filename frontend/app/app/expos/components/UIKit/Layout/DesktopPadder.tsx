import React, { FunctionComponent } from 'react';
import { View, ViewProps } from 'react-native';
import theme, { PaddingType } from '../../../theme.style';
import { isMobilePlatform } from '../../../libs/platform';

type DesktopPadderProps = {
    desktopPadding?: PaddingType,
} & ViewProps

const DesktopPadder: FunctionComponent<DesktopPadderProps> = (props) => {
    const style = isMobilePlatform ? {} : {
        paddingHorizontal: getHorizontalPadding(props.desktopPadding),
        paddingTop: getTopPadding(props.desktopPadding),
        paddingBottom: getBottomPadding(props.desktopPadding),
        flex: 1,
    };
    return <View style={style}>
        {props.children}
    </View>;
};

const getHorizontalPadding = (type: PaddingType): number => {
    if (type === PaddingType.none) {
        return 0;
    }
    return theme.modalHorizontalPadding;
}

const getTopPadding = (type: PaddingType): number => {
    if (type === PaddingType.all || type === PaddingType.horizontalTop) {
        return theme.modalVerticalPadding;
    }
    return  0;
}

const getBottomPadding = (type: PaddingType): number => {
    if (type === PaddingType.all || type === PaddingType.horizontalBottom) {
        return theme.modalVerticalPadding;
    }
    return  0;
}

export default DesktopPadder;
