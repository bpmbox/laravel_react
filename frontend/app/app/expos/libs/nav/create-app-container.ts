import { createSwitchNavigator } from '@react-navigation/core';
import { createApp } from './navigators';

/**
 * Creates App Container with injected switch navigator.
 * @param routes 
 * @param options 
 */
export const createAppContainer = (routes: any, options: any): any => {
    const navigator = createSwitchNavigator(routes, options);
    return createApp(navigator, { history: 'browser' });
};
