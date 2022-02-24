import { act, fireEvent, render, RenderResult, wait } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';
import sinon, { SinonSandbox } from 'sinon';
import { default as routingServiceInstance, RoutingService } from '.';
import NativeRoutes from '../../routes';
import LoginNavigator from '../../pages/LoginNavigator';
import OnboardingAccountNavigator from '../../pages/OnboardingAccountNavigator';
import universalLinks from './univeral-links';
import AuthStore from '../../store/auth';
import { sampleUser } from '../../test-fixtures/object-mother';
import authService, { LoginState } from '../auth';
import historyService from '../history';
import spaceService from '../space';
import { createAppContainer } from '../../libs/nav/create-app-container';

function renderWithNavigation(routes: any, routeOptions?: any, initialAuthState?: any) {
    const AppContainer = createAppContainer(routes, routeOptions);
    const authState = initialAuthState || {
        isAuthenticated: false,
        currentUser: null,
        isLoading: false,
    };
    const tree = render(
        <AuthStore.Provider initialState={authState}>
            <AppContainer ref={(navigatorRef: any) => historyService.setRootNavigation(navigatorRef)} />
        </AuthStore.Provider>
    );
    return tree;
}

describe('RoutingService.LoginCode', () => {
    let tree: RenderResult;
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        tree && tree.unmount();
        sandbox.restore();
    });

    it('should replace input ログインコード if already on screen', async () => {
        const [loginCode, email] = ['foo-bar', 'foo@example.com'];
        const authRequest = sandbox.stub(authService, 'requestEmailCode');
        tree = renderWithNavigation({
            [NativeRoutes.LOGIN]: LoginNavigator,
        });

        /* Simulate entering login email */
        await act(async () => {
            await new Promise(setImmediate);
        });

        await act(async () => {
            fireEvent.press(tree.getByText('メールアドレスでログイン'));
        });

        expect(historyService.currentRouteName).toBe(NativeRoutes.LOGIN_ENTER_EMAIL);
        expect(tree.getByPlaceholderText('Email')).toBeTruthy();

        await act(async () => {
            fireEvent.changeText(tree.getByPlaceholderText('Email'), email);
        });

        await act(async () => {
            fireEvent.press(tree.getByText('次へ'));
        });

        await act(async () => {
            await new Promise(setImmediate);
        });

        await wait(() => tree.getByPlaceholderText('ログインコード'));

        expect(authRequest.called).toBeTruthy();
        expect(historyService.currentRouteName).toBe(NativeRoutes.LOGIN_ENTER_LOGIN_CODE);

        /* Simulate clicking a link containing ログインコード */
        await act(async () => {
            routingServiceInstance.goToRoute(`http://withtree.com/login/validate?code=${loginCode}&email=${email}`);
        });

        await wait(() => expect(tree.getByPlaceholderText('ログインコード').getProp('value')).toBeTruthy());

        const textInput = tree.getByPlaceholderText('ログインコード');
        expect(textInput.getProp('value')).toBe(loginCode);
    });

    it('should input ログインコード if not already on screen', async () => {
        const [loginCode, email] = ['foo-bar', 'foo@example.com'];
        tree = renderWithNavigation({
            [NativeRoutes.LOGIN]: LoginNavigator,
        });

        await act(async () => {
            await new Promise(setImmediate);
        });

        expect(tree.getAllByText('メールアドレスでログイン')).toBeTruthy();

        await act(async () => {
            routingServiceInstance.goToRoute(`http://withtree.com/login/validate?code=${loginCode}&email=${email}`);
        });

        expect(() => tree.getByTestId('ChangeEmailCodePageInput')).toBeTruthy();
        expect(tree.getAllByText('メールアドレスでログイン')).toBeTruthy();

        await wait(() => expect(tree.getByPlaceholderText('ログインコード').getProp('value')).toBeTruthy());

        const textInput = tree.getByPlaceholderText('ログインコード');
        expect(textInput.getProp('value')).toBe(loginCode);
    });

    it('should redirect to login page', async () => {
        sandbox.stub(spaceService, 'getInvitedSpaces').resolves([]);
        tree = renderWithNavigation(
            {
                [NativeRoutes.LOGIN]: LoginNavigator,
                [NativeRoutes.ONBOARDING_ACCOUNT]: OnboardingAccountNavigator,
            },
            {
                initialRouteName: NativeRoutes.ONBOARDING_ACCOUNT,
            },
            {
                isAuthenticated: true,
                currentUser: sampleUser,
                isLoading: false,
            }
        );

        await act(async () => {
            await new Promise(setImmediate);
        });
        console.log(tree.asJSON());
        expect(tree.getByText('Welcome!')).toBeTruthy();

        await act(async () => {
            routingServiceInstance.goToRoute('http://localhost/login/validate?code=foo-bar&email=foo@example.com');
        });

        expect(tree.getAllByText('メールアドレスでログイン')).toBeTruthy();
    });
});

describe('native.RoutingService', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should redirect to to login with email and code params', async () => {
        let listener: ((evt: any) => any) | null = null;
        sandbox.stub(Linking, 'addEventListener').callsFake((_arg, evtListener) => {
            listener = evtListener;
        });
        sandbox.stub(historyService, 'currentRouteName').get(() => NativeRoutes.LOGIN_ENTER_LOGIN_CODE);
        const replaceFn = sandbox.stub(historyService, 'replace');

        const routingService = new RoutingService();
        routingService.init();

        expect(routingService).toBeDefined();
        if (!listener) {
            return fail('URL listener not added to Linking');
        }

        // Invoke the listener to simulate URL event.
        (listener as (evt: { url: string }) => any)({
            url: `${universalLinks.LOGIN_VALIDATE}?email=jsnow@winterfell.com&code=ghost`,
        });

        expect(
            replaceFn.calledWith(NativeRoutes.LOGIN_ENTER_LOGIN_CODE, {
                email: 'jsnow@winterfell.com',
                code: 'ghost',
            })
        ).toBeTruthy();
    });

    it('should NOT redirect to Login HOME if email and code params missing', async () => {
        let listener: ((evt: any) => any) | null = null;
        sandbox.stub(Linking, 'addEventListener').callsFake((_arg, evtListener) => {
            listener = evtListener;
        });
        const replaceFn = sandbox.stub(historyService, 'replace');

        const routingService = new RoutingService();
        routingService.init();

        expect(routingService).toBeDefined();
        if (!listener) {
            return fail('URL listener not added to Linking');
        }

        // Invoke the listener to simulate URL event.
        (listener as (evt: { url: string }) => any)({
            url: `${universalLinks.LOGIN}`,
        });

        expect(replaceFn.called).toBeFalsy();
    });

    it('should just forward to link as if it were native if no ' + 'mappings exist and user logged in.', async () => {
        let listener: ((evt: any) => any) | null = null;
        sandbox.stub(authService, 'getLoginState').returns(LoginState.LOGGED_IN);
        sandbox.stub(Linking, 'addEventListener').callsFake((_arg, evtListener) => {
            listener = evtListener;
        });
        const navigateAsRootFn = sandbox.stub(historyService, 'navigateAsRoot');

        const routingService = new RoutingService();
        routingService.init();

        expect(routingService).toBeDefined();
        if (!listener) {
            return fail('URL listener not added to Linking');
        }

        // Invoke the listener to simulate URL event.
        (listener as (evt: { url: string }) => any)({ url: '/kingslanding' });
        expect(navigateAsRootFn.calledWith('/kingslanding')).toBeTruthy();
    });

    it('should forward to login with redirect params if no ' + 'mappings exist and user not logged in.', async () => {
        let listener: ((evt: any) => any) | null = null;
        sandbox.stub(authService, 'getLoginState').returns(LoginState.LOGGED_OUT);
        sandbox.stub(Linking, 'addEventListener').callsFake((_arg, evtListener) => {
            listener = evtListener;
        });
        const navigateAsRootFn = sandbox.stub(historyService, 'navigateAsRoot');

        const routingService = new RoutingService();
        routingService.init();

        expect(routingService).toBeDefined();
        if (!listener) {
            return fail('URL listener not added to Linking');
        }

        // Invoke the listener to simulate URL event.
        (listener as (evt: { url: string }) => any)({ url: '/kingslanding' });
        expect(navigateAsRootFn.calledWith(NativeRoutes.LOGIN, { redirect: '/kingslanding' })).toBeTruthy();
    });

    it('should replace screen if current route is requested route', async () => {
        let listener: ((evt: any) => any) | null = null;
        sandbox.stub(authService, 'getLoginState').returns(LoginState.LOGGED_IN);
        sandbox.stub(Linking, 'addEventListener').callsFake((_arg, evtListener) => {
            listener = evtListener;
        });
        sandbox.stub(historyService, 'currentRouteName').get(() => NativeRoutes.INTEGRATIONS_NATIVE_INDEX);
        const replaceFn = sandbox.stub(historyService, 'replace');

        const routingService = new RoutingService();
        routingService.init();

        expect(routingService).toBeDefined();
        if (!listener) {
            return fail('URL listener not added to Linking');
        }

        // Invoke the listener to simulate URL event.
        (listener as (evt: { url: string }) => any)({
            url: universalLinks.INTEGRATION_INDEX_PAGE
                               .replace(':slug', 'foo-space')
                               .replace(':integrationId', '1234'),
        });

        expect(
            replaceFn.calledWith(NativeRoutes.INTEGRATIONS_NATIVE_INDEX, {
                slug: 'foo-space',
                integrationId: '1234',
            })
        ).toBeTruthy();
    });
});
