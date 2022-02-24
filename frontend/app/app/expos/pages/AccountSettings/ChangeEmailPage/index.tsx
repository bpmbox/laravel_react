import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { createStackNavigator } from '../../../libs/nav/navigators';
import routes from "../../../routes";
import ChangeEmailCodePage from "./ChangeEmailCodePage";
import ChangeEmailMainPage from "./ChangeEmailMainPage";

const routeConfigMap = {
    [routes.CHANGE_EMAIL_MAIN]: {
        screen: ChangeEmailMainPage,
        path: 'update',
    },
    [routes.CHANGE_EMAIL_CODE]: {
        screen: ChangeEmailCodePage,
        path: 'verify',
    }
};

const stackConfig = {
    initialRouteName: routes.CHANGE_EMAIL_MAIN,
    navigationOptions: {
        header: null
    },
    defaultNavigationOptions: defaultStackNavigationOptions
};

export default createStackNavigator(
    routeConfigMap,
    stackConfig
);
