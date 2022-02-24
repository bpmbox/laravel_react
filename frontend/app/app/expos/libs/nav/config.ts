import { Color } from '../../theme.style';

let _defaultStackNavigationOptions = {
    headerStyle: {
        backgroundColor: Color.white.valueOf(),
        shadowColor: 'transparent',
        borderBottomColor: Color.white.valueOf(),
        elevation: 0
    },
    headerTitleStyle: {
        color: Color.black.valueOf(),
    },
    headerTintColor: Color.black.valueOf(),
};

let _defaultWebStackNavigationOptions = {
    headerStyle: {
        backgroundColor: Color.white.valueOf(),
        shadowColor: 'transparent',
        borderBottomColor: Color.white.valueOf(),
        elevation: 0,
        height: 72
    },
    headerTitleStyle: {
        color: Color.black.valueOf(),
    },
    headerTintColor: Color.black.valueOf(),
};


let _defaultStackConfig = {
    defaultNavigationOptions: _defaultStackNavigationOptions
};

export const defaultStackConfig = _defaultStackConfig;
export const defaultStackNavigationOptions = _defaultStackNavigationOptions;
export const defaultWebStackNavigationOptions = _defaultWebStackNavigationOptions;