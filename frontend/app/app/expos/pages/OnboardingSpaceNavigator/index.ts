import { defaultStackConfig } from '../../libs/nav/config';
import { createStackNavigator } from '../../libs/nav/navigators';
import routes from '../../routes';
import CreatePage from './CreatePage';
import JoinPage from './JoinPage';
import Introduction from './Introduction';
import SecondIntroduction from './SecondIntroduction';
import ThirdIntroduction from './ThirdIntroduction';
import FourthIntroduction from './FourthIntroduction';
import FifthIntroduction from './FifthIntroduction';
import SixthIntroduction from './SixthIntroduction';
import SeventhIntroduction from './SeventhIntroduction';

const routeConfigMap = {
    [routes.ONBOARDING_SPACE_JOIN]: JoinPage,
    [routes.ONBOARDING_SPACE_CREATE]: CreatePage,
    [routes.ONBOARDING_SPACE_INTRO]: Introduction,
    [routes.ONBOARDING_SPACE_SECONDINTRO]: SecondIntroduction,
    [routes.ONBOARDING_SPACE_THIRDINTRO]: ThirdIntroduction,
    [routes.ONBOARDING_SPACE_FOURTHINTRO]: FourthIntroduction,
    [routes.ONBOARDING_SPACE_FIFTHINTRO]: FifthIntroduction,
    [routes.ONBOARDING_SPACE_SIXTHINTRO]: SixthIntroduction,
    [routes.ONBOARDING_SPACE_SEVENTHINTRO]: SeventhIntroduction,
};

const stackConfig = {
    initialRouteName: routes.ONBOARDING_SPACE_JOIN,
    ...defaultStackConfig,
};

const OnboardingSpaceStack = createStackNavigator(routeConfigMap, stackConfig);

// @ts-ignore
OnboardingSpaceStack.path = 'onboarding/space'; //override path for better web URLs

export default OnboardingSpaceStack;
