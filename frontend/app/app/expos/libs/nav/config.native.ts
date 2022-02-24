import theme, { Color } from '../../theme.style';

export const defaultStackNavigationOptions = {
    headerStyle: {
        backgroundColor: Color.white.valueOf(),
        shadowColor: 'transparent',
        borderBottomColor: Color.white.valueOf(),
        elevation: 0
    },
    headerTitleStyle: {
        color: Color.black.valueOf(),
    },
    headerTintColor: Color.success.valueOf(),
};

export const defaultStackConfig = {
    defaultNavigationOptions: defaultStackNavigationOptions
};
