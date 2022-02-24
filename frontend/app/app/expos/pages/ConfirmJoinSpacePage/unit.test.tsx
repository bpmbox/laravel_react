import { act } from '@testing-library/react-hooks';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon, { SinonSandbox } from 'sinon';
import { ConfirmJoinSpacePage } from '.';
import routes from '../../routes';
import ErrorPage from '../../pages/General/ErrorPage';
import FullPageLoading from '../../pages/General/FullPageLoading';
import historyService from '../../services/history';
import messageService from '../../services/message';
import univeralLinks from '../../services/routing/univeral-links';
import spaceService from '../../services/space';
import AuthStore from '../../store/auth';
import { sampleSpaceInfo } from '../../test-fixtures/object-mother';
import { Role } from '../../types/enums';

describe('CreateJoinSpacePage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should display join space buttin if user is invited.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            role: null,
            invited: true,
            chat: {
                userId: 'abc',
                accessToken: '123',
            },
        });

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        expect(
            testRenderer.root.findByProps({
                testID: 'ConfirmJoinButton',
            })
        ).toBeDefined();
    });

    it('should join space when Join Space button is clicked.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
            navigate: sandbox.stub(),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            role: null,
            invited: true,
            chat: {
                userId: 'abc',
                accessToken: '123',
            },
        });
        const join = sandbox.stub(spaceService, 'joinSpace');

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        await act(async () => {
            const joinButton = testRenderer.root.findByProps({
                testID: 'ConfirmJoinButton',
            });
            expect(joinButton).toBeDefined();
            (joinButton as any).props.onPress();

            // Await promises to resolve
            await new Promise(setImmediate);
        });

        // Check that we called join space.
        expect(join.called).toBeTruthy();
        expect(fakeNav.navigate.calledWith(routes.MAIN_SPACE_REDIRECT, sinon.match.any)).toBeTruthy();
    });

    it('should display continue to space button if already member.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
            navigate: sandbox.stub(),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            role: Role.OWNER,
            invited: false,
            chat: {
                userId: 'abc',
                accessToken: '123',
            },
        });
        const join = sandbox.stub(spaceService, 'joinSpace');

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        await act(async () => {
            const continueButton = testRenderer.root.findByProps({
                testID: 'GoToSpaceButton',
            });
            expect(continueButton).toBeDefined();
            (continueButton as any).props.onPress();

            // Await promises to resolve
            await new Promise(setImmediate);
        });

        // Check that we redirect without trying to rejoin the space.
        expect(join.called).toBeFalsy();
        expect(fakeNav.navigate.calledWith(routes.MAIN_SPACE_REDIRECT, sinon.match.any)).toBeTruthy();
    });

    it('should display error alert message on join error.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            role: null,
            invited: true,
            chat: {
                userId: 'abc',
                accessToken: '123',
            },
        });
        sandbox.stub(spaceService, 'joinSpace').rejects();
        const message = sandbox.stub(messageService, 'sendError');

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        await act(async () => {
            const joinButton = testRenderer.root.findByProps({
                testID: 'ConfirmJoinButton',
            });
            expect(joinButton).toBeDefined();
            (joinButton as any).props.onPress();

            // Await promises to resolve
            await new Promise(setImmediate);
        });

        expect(message.called).toBeTruthy();
    });

    it('should display loading screen while spaces is fetching.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').returns(new Promise(() => {}));

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        expect(testRenderer.root.findAllByType(FullPageLoading)).toBeDefined();
    });

    it('should display loading screen while authentication is initailizing.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').returns(new Promise(() => {}));

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: false, isLoading: true } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        expect(testRenderer.root.findAllByType(FullPageLoading)).toBeDefined();
    });

    it('should redirect to login if not logged in.', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').returns(new Promise(() => {}));

        const navigateAsRoot = sandbox.stub(historyService, 'navigateAsRoot');

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: false, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Check initial render is at least ok.
        expect(testRenderer.root).toBeDefined();

        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        expect(navigateAsRoot.calledWith(routes.LOGIN_HOME)).toBeTruthy();
    });

    it('should display buttons to switch account or back to spaces' + 'if user was not invited', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            invited: false,
            role: null,
        });

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();
        expect(testRenderer.root.findByProps({ testID: 'BackToSpacesButton' })).toBeDefined();
        expect(
            testRenderer.root.findByProps({
                testID: 'LoginAsDifferentUserButton',
            })
        ).toBeDefined();
    });

    it('selecting Switch User should redirect to Login with redirect to slug parameter set', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            invited: false,
            role: null,
        });
        const navigate = sandbox.stub(historyService, 'navigateAsRoot');

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        await act(async () => {
            const loginAsDifferentUserButton = testRenderer.root.findByProps({
                testID: 'LoginAsDifferentUserButton',
            });
            expect(loginAsDifferentUserButton).toBeDefined();
            (loginAsDifferentUserButton as any).props.onPress();

            // Await promises to resolve
            await new Promise(setImmediate);
        });

        // Check that we called join space.
        expect(navigate.called).toBeTruthy();
        expect(
            navigate.calledWith(routes.LOGIN_HOME, {
                redirect: univeralLinks.JOIN.replace(':slug', '/test'),
            })
        ).toBeTruthy();
    });

    it('selecting Back to My Spaces should redirect to Main', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves({
            ...sampleSpaceInfo,
            invited: false,
            role: null,
        });
        const navigate = sandbox.stub(historyService, 'navigateAsRoot');

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot pre-conditions to assert that the space info renders.
        expect(testRenderer.toJSON()).toMatchSnapshot();

        await act(async () => {
            const backToSpacesButton = testRenderer.root.findByProps({
                testID: 'BackToSpacesButton',
            });
            expect(backToSpacesButton).toBeDefined();
            (backToSpacesButton as any).props.onPress();

            // Await promises to resolve
            await new Promise(setImmediate);
        });

        // Check that we called join space.
        expect(navigate.called).toBeTruthy();
        expect(navigate.calledWith(routes.MAIN_SPACE_REDIRECT)).toBeTruthy();
    });

    it('should display error page on failed to fetch space', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').rejects();

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot test we reach correct content.
        expect(testRenderer.root.findByType(ErrorPage)).toBeDefined();
    });

    it('should display error page on failed on Space Not Found', async () => {
        const fakeNav = {
            getParam: sandbox.stub().returns('/test'),
        };

        sandbox.stub(spaceService, 'getInfoBySlug').resolves(null);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider initialState={{ isAuthenticated: true, isLoading: false } as any}>
                <ConfirmJoinSpacePage navigation={fakeNav as any} />
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Use snapshoot test we reach correct content.
        expect(testRenderer.root.findByType(ErrorPage)).toBeDefined();
    });
});
