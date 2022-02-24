import React from 'react';
import { View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import TestRenderer, { act } from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import LoginNavigator from '.';
import Text from '../../components/UIKit/items/Text';
import { createApp } from '../../libs/nav/navigators';
import routes from '../../routes';
import authService from '../../services/auth';
import AuthStore from '../../store/auth';
import { sampleUser } from '../../test-fixtures/object-mother';

describe('LoginNavigator', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    // TODO: There seems to be an issue for running full navigation inside a unit test.
    // It does not appear to be rendering after the first page transition.
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should support email login flow', async () => {
        // Setting up stubs for the test
        sandbox.stub(authService, 'requestEmailCode').resolves(true);
        sandbox.stub(authService, 'loginWithCode').resolves({
            user: sampleUser,
            isOnboarded: false,
            accessToken: 'fakeToken',
            refreshToken: 'fakeToken',
        });

        const renderer = renderLoginNavigator();
        await act(async () => await new Promise(setImmediate));

        // -- Should start off on Login Home --
        expect(renderer.root.findByProps({ testID: 'EmailLoginButton' })).toBeTruthy();
        expect(renderer.root.findByProps({ testID: 'GoogleLoginButton' })).toBeTruthy();
        expect(renderer.root.findByProps({ testID: 'EmailTextInput' })).toBeFalsy();
        // Note: Apple login button cannot be rendered in unit test, so skip this.

        // Step 1
        // -- Clicking Login by email should take us to enter email --
        act(() => {
            const emailLoginButton = renderer.root.findByProps({ testID: 'EmailLoginButton' });
            (emailLoginButton as any).props.onPress();
        });
        await act(async () => await new Promise(setImmediate));
        expect(renderer.root.findByProps({ testID: 'EmailTextInput' })).toBeTruthy();

        // Step 2
        // -- Entering email and clicking next should take us to enter code page.
        act(() => {
            const emailInput = renderer.root.findByProps({ testID: 'EmailTextInput' });
            (emailInput as any).props.onChangeText('jsnow@winterfell.com');
        });
        await act(async () => await new Promise(setImmediate));
        act(() => {
            const nextBtn = renderer.root.findByProps({ testID: 'EmailPageNextButton' });
            (nextBtn as any).props.onPress();
        });
        await act(async () => await new Promise(setImmediate));
        expect(renderer.root.findByProps({ testID: 'EnterLoginCodePageCodeInput' })).toBeTruthy();

        // Step 3
        // -- submitting code should redirect to onboarding
        act(() => {
            const codeInput = renderer.root.findByProps({ testID: 'EnterLoginCodePageCodeInput' });
            (codeInput as any).props.onChangeText('everybody-loves-pancakes');
        });
        await act(async () => await new Promise(setImmediate));
        act(() => {
            const nextBtn = renderer.root.findByProps({ testID: 'EnterLoginCodePageNextButton' });
            (nextBtn as any).props.onPress();
        });
        await act(async () => await new Promise(setImmediate));
        expect(renderer.root.findByProps({ testID: 'FakeOnboardingAccount' })).toBeTruthy();
    });
});

function renderLoginNavigator() {
    const AppSwitchNavigator = createSwitchNavigator(
        {
            [routes.LOGIN]: LoginNavigator,

            // Fill outer routes with place holders so we can test redirects.
            [routes.ONBOARDING_ACCOUNT]: () => (
                <View>
                    <Text testID="FakeOnboardingAccount" />
                </View>
            ),
            [routes.ONBOARDING_SPACE]: () => (
                <View>
                    <Text testID="FakeOnboardingSpace" />
                </View>
            ),
            [routes.MAIN_SPACE_REDIRECT]: () => (
                <View>
                    <Text testID="FakeOnboardingSpace" />
                </View>
            ),
            [routes.MAIN]: () => (
                <View>
                    <Text testID="FakeOnboardingSpace" />
                </View>
            ),
        },
        {
            backBehavior: 'history',
            initialRouteName: routes.LOGIN,
        }
    );

    const AppContainer = createApp(AppSwitchNavigator, { history: 'browser' });

    const App = createAppContainer(AppContainer);

    const renderer = TestRenderer.create(
        <AuthStore.Provider initialState={{ isAuthenticated: false, isLoading: false, currentUser: null }}>
            <App />
        </AuthStore.Provider>
    );
    return renderer;
}
