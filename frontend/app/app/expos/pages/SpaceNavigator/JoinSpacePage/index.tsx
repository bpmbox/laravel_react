import { defaultStackNavigationOptions } from '../../../libs/nav/config';
import { createStackNavigator } from '../../../libs/nav/navigators';
import routes from "../../../routes";
import AddSpacePage from './AddSpacePage';
import CreateSpacePage from './CreateSpacePage';

const routeConfigMap = {
    [routes.JOIN_SPACE_SELECT]: AddSpacePage,
    [routes.JOIN_SPACE_CREATE]: CreateSpacePage
};

const stackConfig = {
    initialRouteName: routes.JOIN_SPACE_SELECT,
    navigationOptions: {
        header: null
    },
    defaultNavigationOptions: defaultStackNavigationOptions
};

export default createStackNavigator(
    routeConfigMap,
    stackConfig
);


