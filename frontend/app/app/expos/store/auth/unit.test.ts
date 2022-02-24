import { renderHook } from '@testing-library/react-hooks';
import sinon, { SinonSandbox } from 'sinon';
import { __useAuthStore } from '.';
import authService, { AUTH_EVENTS, LoginState } from '../../services/auth';
import { AuthServiceTypes } from '../../services/auth/types';
import userService, { USER_UPDATED_EVENT } from '../../services/user';
import { sampleAccessToken, sampleRefreshToken, sampleUser } from '../../test-fixtures/object-mother';

describe('AuthStore', (): void => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('it should start off authenticated but with user null.', async (): Promise<void> => {
        sandbox.stub(authService, 'getLoginState').returns(LoginState.UNKNOWN);
        const { result } = renderHook(() => __useAuthStore());

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(result.current.isAuthenticated).toBeTruthy();
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.currentUser).toBeNull();
    });

    it('should transition to authenticated state when authService LOGIN event occurs.', async (): Promise<void> => {
        let eventListener: Function = () => {};
        const addEventListner = sandbox
            .stub(authService, 'addListener')
            .withArgs(AUTH_EVENTS.LOGIN, sinon.match.any)
            .callsFake((_event, listener): any => {
                eventListener = listener;
            });

        const { result } = renderHook(() => __useAuthStore());

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(result.current).toBeDefined();
        expect(addEventListner.called).toBeTruthy();

        eventListener({
            accessToken: sampleAccessToken,
            refreshToken: sampleRefreshToken,
            user: sampleUser,
        } as AuthServiceTypes.IAuthUpdate);

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        expect(result.current.isAuthenticated).toBeTruthy();
        expect(result.current.currentUser).toStrictEqual(sampleUser);
    });

    it('should be unauthenticated after a logout event.', async (): Promise<void> => {
        let eventListener: Function = () => {};
        sandbox.stub(authService, 'logout').resolves();
        const addEventListner = sandbox
            .stub(authService, 'addListener')
            .withArgs(AUTH_EVENTS.LOGOUT, sinon.match.any)
            .callsFake((_event, listener): any => {
                eventListener = listener;
            });

        const { result } = renderHook(() =>
            __useAuthStore({
                isAuthenticated: true,
                currentUser: sampleUser,
            })
        );

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(result.current).toBeDefined();
        expect(addEventListner.called).toBeTruthy();
        expect(result.current.isAuthenticated).toBeTruthy();

        // Perform logout.
        eventListener();

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        expect(result.current.isAuthenticated).toBeFalsy();
        expect(result.current.currentUser).toBeNull();
    });

    it('should update currentUser when USER_UPDATED_EVENT.', async (): Promise<void> => {
        let eventListener: Function = () => {};
        const addEventListner = sandbox
            .stub(userService, 'addListener')
            .withArgs(USER_UPDATED_EVENT, sinon.match.any)
            .callsFake((_event, listener): any => {
                eventListener = listener;
            });

        const { result } = renderHook(() =>
            __useAuthStore({
                isAuthenticated: true,
                currentUser: sampleUser,
            })
        );

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(result.current).toBeDefined();
        expect(addEventListner.called).toBeTruthy();
        expect(result.current.isAuthenticated).toBeTruthy();

        // Perform user update.
        eventListener({
            givenName: 'Tabby',
            familyName: 'Cabby',
        });

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        if (!result.current.currentUser) {
            return fail();
        }

        expect(result.current.currentUser.givenName).toBe('Tabby');
        expect(result.current.currentUser.familyName).toBe('Cabby');
        expect(result.current.currentUser.email).toBe(sampleUser.email);
    });

    it('should update currentUser when USER_UPDATED.', async (): Promise<void> => {
        let eventListener: Function = () => {};
        const addEventListner = sandbox
            .stub(authService, 'addListener')
            .withArgs(AUTH_EVENTS.USER_UPDATED, sinon.match.any)
            .callsFake((_event, listener): any => {
                eventListener = listener;
            });

        const { result } = renderHook(() =>
            __useAuthStore({
                isAuthenticated: true,
                currentUser: sampleUser,
            })
        );

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(result.current).toBeDefined();
        expect(addEventListner.called).toBeTruthy();
        expect(result.current.isAuthenticated).toBeTruthy();

        // Perform user update.
        eventListener({
            email: 'newemail@address.com',
        } as AuthServiceTypes.IAuthUpdate);

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        if (!result.current.currentUser) {
            return fail();
        }
        expect(result.current.currentUser.givenName).toBe(sampleUser.givenName);
        expect(result.current.currentUser.familyName).toBe(sampleUser.familyName);
        expect(result.current.currentUser.email).toBe('newemail@address.com');
    });

    it('should remove event listeners when the store is destroyed.', async (): Promise<void> => {
        const removeListener = sandbox.stub(authService, 'removeListener');

        const { unmount } = renderHook(() => __useAuthStore());

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(removeListener.called).toBeFalsy();

        // unmount the store to simulate destruction.
        unmount();

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });

        expect(removeListener.called).toBeTruthy();
    });

    it('should intitiate fetch for current user when being initiated when already logged in.', async (): Promise<
        void
    > => {
        sandbox.stub(authService, 'getLoginState').returns(LoginState.LOGGED_IN);
        const getAccount = sandbox.stub(userService, 'getAccount').resolves(sampleUser);
        const { result } = renderHook(() => __useAuthStore());

        // Await promise queue to clear.
        await new Promise(resolve => {
            setImmediate(() => resolve());
        });
        expect(result.current).toBeDefined();
        expect(getAccount.called).toBeTruthy();
        expect(result.current.currentUser).toStrictEqual(sampleUser);
    });
});
