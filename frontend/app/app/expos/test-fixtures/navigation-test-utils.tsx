/* istanbul ignore file */
import { render } from '@testing-library/react-native';
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { HistoryService } from '../services/history';
import AuthStore from '../store/auth';

/**
 * Test utility for rendering navigation stack for react native.
 * @param historyService
 * @param navigatorInstance
 * @param initialAuthState
 */
export function renderNavigation(historyService: HistoryService, navigatorInstance: any, initialAuthState?: any) {
    const App = createAppContainer(navigatorInstance);

    const authState = Object.assign({}, initialAuthState, {
        isAuthenticated: false,
        currentUser: null,
        isLoading: false,
    });

    const tree = render(
        <AuthStore.Provider initialState={authState}>
            <App ref={navigatorRef => historyService.setNavigation(navigatorRef)} />
        </AuthStore.Provider>
    );

    return tree;
}
