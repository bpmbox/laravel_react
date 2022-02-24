import { defaultStackConfig } from '../../libs/nav/config';
import { createStackNavigator } from '../../libs/nav/navigators';
import routes from '../../routes';
import EnterEmailPage from './EnterEmailPage';
import EnterLoginCodePage from './EnterLoginCodePage';
import RequestAccessPage from './RequestAccessPage';
import HomePage from './HomePage';

const routeConfigMap = {
    [routes.LOGIN_HOME]: HomePage,
    [routes.LOGIN_ENTER_EMAIL]: EnterEmailPage,
    [routes.LOGIN_ENTER_LOGIN_CODE]: EnterLoginCodePage,
    [routes.LOGIN_REQUEST_ACCESS]: RequestAccessPage,
};

const stackConfig = {
    initialRouteName: routes.LOGIN_HOME,
    ...defaultStackConfig,
};

export default createStackNavigator(routeConfigMap, stackConfig);
