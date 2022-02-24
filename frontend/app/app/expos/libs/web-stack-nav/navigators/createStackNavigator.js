import { StackRouter, createNavigator } from '@react-navigation/core';
import StackView from '../views/StackView/StackView';

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = StackRouter(routeConfigMap, stackConfig);

  // Create a navigator with StackView as the view
  return createNavigator(StackView, router, stackConfig);
}

export default createStackNavigator;
