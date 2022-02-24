import routes from '../../routes';
import WelcomePage from './WelcomePage';
import EnterDetailsPage from './EnterDetailsPage';
import AgreementPage from './AgreementPage';
import UserPolicyPage from '../SpaceNavigator/SettingsPage/UserPolicyPage'
import PrivacyPolicyPage from '../SpaceNavigator/SettingsPage/PrivacyPolicyPage'
import { defaultStackConfig } from '../../libs/nav/config';
import { createStackNavigator } from '../../libs/nav/navigators';
//import chatService from '../../services/chat';

//chatService.nativeOnlyRegisterAnalitics("Onborad_acounting_navigater");

const routeConfigMap = {
    [routes.ONBOARDING_ACCOUNT_HOME]: WelcomePage,
    [routes.ONBOARDING_ACCOUNT_ENTER_DETAILS]: EnterDetailsPage,
    [routes.ONBOARDING_ACCOUNT_AGREEMENT]: AgreementPage,
    [routes.SETTINGS_USER_POLICY]: UserPolicyPage,
    [routes.SETTINGS_PRIVACY_POLICY]: PrivacyPolicyPage
};

const stackConfig = {
    initialRouteName: routes.ONBOARDING_ACCOUNT_HOME,
    ...defaultStackConfig,
};

const OnboardingStack = createStackNavigator(routeConfigMap, stackConfig);

// @ts-ignore
OnboardingStack.path = 'onboarding/account'; //override path for better web URLs

export default OnboardingStack;
