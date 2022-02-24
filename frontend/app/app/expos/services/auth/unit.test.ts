import { sign } from 'jsonwebtoken';
import sinon, { SinonSandbox } from 'sinon';
import { AuthService, AUTH_EVENTS, LoginState } from '.';
import graphqlService from '../../services/graphql';
import { awaitPromises } from '../../test-fixtures/component-test-utils';
import { getFirstMutation } from '../../test-fixtures/graphql-test-utils';
import { sampleAccessToken, sampleRefreshToken, sampleUser } from '../../test-fixtures/object-mother';
import userService from '../user';
import { AuthServiceTypes } from './types';

describe('auth-service', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        // remove refresh Token from localStorage to ensure clean test.
        localStorage.clear();
    });
    afterEach(() => {
        sandbox.restore();
        localStorage.clear();
    });

    describe('requestEmailCode', () => {
        it('should call endpoint to request email code.', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authRequestLoginCode: {
                        success: true,
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            const result = await authService.requestEmailCode('jsnow@winterfell.com');

            expect(mutate.called).toBeTruthy();
            expect(result).toBeTruthy();
        });
    });

    describe('loginWithCode', () => {
        it('should update authToken upon successful login', async (): Promise<void> => {
            const token = sign(
                {
                    email: sampleUser.email,
                },
                'secret',
                {
                    expiresIn: '1h',
                }
            );

            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authLoginWithCode: {
                        accessToken: token,
                        refreshToken: token,
                        isOnboarded: true,
                        user: sampleUser,
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            const authResult = await authService.loginWithCode('jsnow@winterfell.com', 'abc123');

            expect(mutate.called).toBeTruthy();
            expect(authResult.isOnboarded).toBeTruthy();
            expect(authResult.accessToken).toBeDefined();
            expect(authResult.refreshToken).toBeDefined();
            expect(authResult.user).toBe(sampleUser);
        });

        it('should emit AUTH_CHANGE_EVENT on successful login with code', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authLoginWithCode: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                        isOnboarded: true,
                        user: sampleUser,
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            const eventListener = sinon.stub();
            authService.addListener(AUTH_EVENTS.LOGIN, eventListener);

            await authService.loginWithCode('jsnow@winterfell.com', 'abc123');

            expect(eventListener.called).toBeTruthy();
            // Validate the event lister is called with correct params.
            const authPayload: AuthServiceTypes.IAuthData = eventListener.lastCall.args[0];
            expect(authPayload.user).toStrictEqual(sampleUser);
        });
    });

    describe('loginWithGoogle', () => {
        it('should update authToken upon successful login', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authLoginWithGoogle: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                        isOnboarded: true,
                        user: sampleUser,
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            const authResult = await authService.loginWithGoogle('googleid', sampleUser.email);

            expect(mutate.called).toBeTruthy();
            expect(authResult.isOnboarded).toBeTruthy();
            expect(authResult.accessToken).toBeDefined();
            expect(authResult.refreshToken).toBeDefined();
            expect(authResult.user).toBe(sampleUser);
        });

        it('should emit LOGIN event on successful login with google', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authLoginWithGoogle: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                        isOnboarded: true,
                        user: sampleUser,
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            const eventListener = sinon.stub();
            authService.addListener(AUTH_EVENTS.LOGIN, eventListener);

            await authService.loginWithGoogle('googleid', sampleUser.email);

            expect(eventListener.called).toBeTruthy();
            // Validate the event lister is called with correct params.
            const loginPayload = eventListener.lastCall.args[0];
            expect(loginPayload.user).toBe(sampleUser);
        });
    });

    describe('logout', () => {
        it('should clear tokens upon successful logout', async (): Promise<void> => {
            const setAccessToken = sandbox.stub(graphqlService, 'setAccessToken');
            const mutate = sandbox.stub(graphqlService, 'mutate');

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
                removeItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();
            await awaitPromises();

            await authService.logout();
            await awaitPromises();

            // Assert tokens are cleared.
            expect(setAccessToken.calledWith('')).toBeTruthy();
            // Check our internal refresh token was removed.
            expect(authService.__refreshToken).toBeNull();
            expect(mutate.called).toBeTruthy();
        });

        it('should call logout endpoint', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authRefreshToken: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                    },
                },
            });
            sandbox.stub(userService, 'getAccount').resolves(sampleUser);

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
                removeItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            let authService = new AuthService(mockStorage);
            authService.initFromSavedSession();

            await awaitPromises();
            mutate.reset();

            await authService.logout();
            await awaitPromises();

            expect(getFirstMutation(mutate as any)).toBe('authRevokeToken');
        });

        it('should emit AUTH_LOGOUT event logout', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate');
            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
                removeItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();
            const eventListener = sinon.stub();
            authService.addListener(AUTH_EVENTS.LOGOUT, eventListener);
            await awaitPromises();

            await authService.logout();

            expect(eventListener.called).toBeTruthy();
            expect(mutate.called).toBeTruthy();
        });
    });

    describe('updateEmail', () => {
        it('should call update email', async () => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    currentUser: {
                        updateEmailWithCode: {
                            accessToken: sampleAccessToken,
                            refreshToken: sampleRefreshToken,
                        },
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            const listener = sinon.stub();
            authService.addListener(AUTH_EVENTS.USER_UPDATED, listener);

            await authService.updateEmail('foo@bar.com', '123');
            expect(listener.called).toBeTruthy();
            expect(listener.lastCall.args[0]).toStrictEqual({
                email: 'foo@bar.com',
            });
        });

        it('should emit AUTH_UPDATED_EVENT upon successful email change', async () => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    currentUser: {
                        updateEmailWithCode: {
                            accessToken: sampleAccessToken,
                            reefreshToken: sampleRefreshToken,
                        },
                    },
                },
            });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            const eventListener = sinon.stub();
            authService.addListener(AUTH_EVENTS.USER_UPDATED, eventListener);

            await authService.updateEmail('foo@bar.com', '123');

            expect(eventListener.called).toBeTruthy();
        });

        it('should raise error if request fails', async () => {
            sandbox.stub(graphqlService, 'mutate').rejects(new Error('test error'));

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            await expect(authService.updateEmail('foo@bar.com', '123')).rejects.toBeDefined();
        });
    });

    describe('__refreshToken', () => {
        it('should refresh update AccessToken in graphql client and RefreshToken saved to authService', async (): Promise<
            void
        > => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    authRefreshToken: {
                        accessToken: 'NEW_ACCESS_TOKEN',
                        refreshToken: 'NEW_REFRESH_TOKEN',
                    },
                },
            });
            const updateToken = sandbox.stub(graphqlService, 'setAccessToken');

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(sampleRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            // stub out schedule refresh to avoid code running after test is complete.
            sandbox.stub(authService, '__scheduleTokenRefresh');
            authService.__refreshToken = sampleRefreshToken;

            await authService.__refreshTokens();

            expect(authService.__refreshToken).toBe('NEW_REFRESH_TOKEN');
            expect(updateToken.calledWith('NEW_ACCESS_TOKEN')).toBeTruthy();
        });
    });

    describe('__scheduleTokenRefresh', () => {
        it('should call __refreshToken() before token is expired.', async (): Promise<void> => {
            sandbox.useFakeTimers();
            const token = sign(sampleUser, 'secret', { expiresIn: '30m' });

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(token);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 30 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            // Extract out the function so we can call it without the scheduling loop.
            const fakeContext = {
                __refreshToken: sampleRefreshToken,
                __refreshExp: Date.now() + 90 * 24 * 60 * 60 * 1000,
                __refreshTokens: jest.fn(),
                __scheduleTokenRefresh: jest.fn(),
                logout: jest.fn(),
            };
            const scheduleRefresh = authService.__scheduleTokenRefresh.bind(fakeContext);
            scheduleRefresh(token);
            sandbox.clock.tick(29 * 60 * 1000); // Advance the clock to right before expiration.

            expect(fakeContext.__refreshTokens).toBeCalled();
        });

        it('should not try to refresh token and emit logout event if refreshToken is expired.', async (): Promise<
            void
        > => {
            sandbox.useFakeTimers();
            const token = sign(sampleUser, 'secret', { expiresIn: '30m' });
            const expiringRefreshToken = sign(sampleUser, 'secret', { expiresIn: '1m' });

            sandbox.stub(graphqlService, 'mutate'); //stub out mutate to intercept queries.

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(expiringRefreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() - 1 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
                removeItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();
            const logoutListener = jest.fn();
            authService.addListener(AUTH_EVENTS.LOGOUT, logoutListener);

            await awaitPromises(sandbox.clock);

            // Extract out the function so we can call it without the scheduling loop.
            const scheduleRefresh = authService.__scheduleTokenRefresh.bind(authService);
            // Create a fake context to override props.
            const fakeContext = {
                __refreshToken: expiringRefreshToken,
                __refreshTokens: jest.fn(),
                __scheduleTokenRefresh: jest.fn(),
            };
            Object.assign(authService, fakeContext);

            scheduleRefresh(token);
            sandbox.clock.tick(29 * 60 * 1000); // Advance the clock to trigger scheduled task.

            //await promise queue to resolve.
            await awaitPromises(sandbox.clock);

            expect(fakeContext.__refreshTokens).not.toBeCalled();
            expect(logoutListener).toBeCalled();
        });

        it('should reschedule token refresh if refreshing on a valid token fails because of network error.', async (): Promise<
            void
        > => {
            sandbox.useFakeTimers();
            const token = sign(sampleUser, 'secret', { expiresIn: '30m' });
            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '900h' });

            sandbox.stub(graphqlService, 'mutate'); //stub out mutate to intercept queries.

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            const logoutListener = jest.fn();
            authService.addListener(AUTH_EVENTS.LOGOUT, logoutListener);

            // Extract out the function so we can call it without the scheduling loop.
            // Create a fake context to override props.
            const networkError = new Error();
            (networkError as any).networkError = 'fetch failed';

            const fakeContext = {
                __isTokenValid: sinon.stub().returns(true),
                __refreshToken: refreshToken,
                __refreshExp: Date.now() + 90 * 24 * 60 * 60 * 1000,
                __refreshTokens: sinon.stub().rejects(networkError),
                __scheduleTokenRefresh: jest.fn(),
                logout: jest.fn(),
            };
            const scheduleRefresh = authService.__scheduleTokenRefresh.bind(fakeContext);

            scheduleRefresh(token);
            sandbox.clock.tick(29 * 60 * 1000); // Advance the clock to trigger scheduled task.

            //await promise queue to resolve.
            await new Promise(resolve => {
                setImmediate(() => {
                    resolve();
                });
                sandbox.clock.tick(1); // To advance to next ticket so above resolves.
            });

            expect(fakeContext.__scheduleTokenRefresh).toBeCalled();
        });

        it('should have reschedule interval greater or equal than minmum refresh rate.', async (): Promise<void> => {
            sandbox.useFakeTimers();
            const timeoutSpy = sandbox.spy(window, 'setTimeout');

            const token = sign(sampleUser, 'secret', { expiresIn: '1s' });
            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '90h' });

            sandbox.stub(graphqlService, 'mutate'); //stub out mutate to intercept queries.

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);

            const logoutListener = jest.fn();
            authService.addListener(AUTH_EVENTS.LOGOUT, logoutListener);

            // Extract out the function so we can call it without the scheduling loop.
            // Create a fake context to override props.
            const fakeContext = {
                __isTokenValid: sinon.stub().returns(true),
                __refreshToken: refreshToken,
                __refreshTokens: sinon.stub().rejects(new Error()),
                __scheduleTokenRefresh: jest.fn(),
                logout: jest.fn(),
            };
            const scheduleRefresh = authService.__scheduleTokenRefresh.bind(fakeContext);

            scheduleRefresh(token);
            sandbox.clock.tick(29 * 60 * 1000); // Advance the clock to trigger scheduled task.

            //await promise queue to resolve.
            await new Promise(resolve => {
                setImmediate(() => {
                    resolve();
                });
                sandbox.clock.tick(1); // To advance to next ticket so above resolves.
            });

            expect(timeoutSpy.lastCall.args[1]).toBe(60000);
        });
    });

    describe('initFromSavedSession', () => {
        it('should start off with LoginState.UNKNOWN', () => {
            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').returns(new Promise(() => {}));
            mockGetItem.withArgs('refreshExp').returns(new Promise(() => {}));
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();
            expect(authService.getLoginState()).toBe(LoginState.UNKNOWN);
        });

        it('should not try to refresh session of saved refresh token is expired.', () => {
            sandbox.useFakeTimers();

            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '1m' });
            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves(Date.now().toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();

            const mutate = sandbox.stub(graphqlService, 'mutate');

            // Advance clock to expire the refresh token.
            sandbox.clock.tick(2 * 60 * 1000);

            expect(mutate.called).toBeFalsy();
        });

        it('should not be logged in token is expired.', async () => {
            sandbox.useFakeTimers();
            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '1m' });

            sandbox.stub(graphqlService, 'mutate');

            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves(Date.now().toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            // Advance clock to expire the refresh token.
            sandbox.clock.tick(2 * 60 * 1000);
            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();
            await awaitPromises(sandbox.clock);

            const loginState = authService.getLoginState();
            expect(loginState).toBe(LoginState.LOGGED_OUT);
        });

        it('should be logged out if no refresh token is saved.', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate');

            const mockStorage = ({
                getItem: sinon.stub().resolves(null),
                setItem: sinon.stub(),
                removeItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();

            await awaitPromises();

            expect(mutate.called).toBeFalsy();
            expect(authService.getLoginState()).toBe(LoginState.LOGGED_OUT);
        });

        it('should try to refresh to get a new set of tokens if saved refreshToken is still valid', async (): Promise<
            void
        > => {
            const mutate = sandbox.stub(graphqlService, 'mutate');
            mutate.onFirstCall().resolves({
                data: {
                    authRefreshToken: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                    },
                },
            });
            sandbox.stub(userService, 'getAccount').resolves(sampleUser);

            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '1h' });
            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();

            // Await pending resolved promises.
            await new Promise(resolve => {
                setImmediate(() => {
                    resolve();
                });
            });

            expect(authService.getLoginState()).toBe(LoginState.LOGGED_IN);
        });

        it('should emit Login event with current user if successfully restored saved session.', async (): Promise<
            void
        > => {
            const mutate = sandbox.stub(graphqlService, 'mutate');
            mutate.onFirstCall().resolves({
                data: {
                    authRefreshToken: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                    },
                },
            });
            sandbox.stub(userService, 'getAccount').resolves(sampleUser);

            const listener = jest.fn();

            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '1h' });
            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();
            authService.addListener(AUTH_EVENTS.LOGIN, listener);

            // Await pending resolved promises.
            await new Promise(resolve => {
                setImmediate(() => {
                    resolve();
                });
            });
            expect(listener).toBeCalledWith({ user: sampleUser });
        });

        it('should emit Logout event with failed to get current user.', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate');
            mutate.onFirstCall().resolves({
                data: {
                    authRefreshToken: {
                        accessToken: sampleAccessToken,
                        refreshToken: sampleRefreshToken,
                    },
                },
            });
            sandbox.stub(userService, 'getAccount').rejects(new Error());

            const loginListener = jest.fn();
            const logoutListener = jest.fn();

            const refreshToken = sign(sampleUser, 'secret', { expiresIn: '1h' });
            const mockGetItem = sinon.stub();
            mockGetItem.withArgs('refreshToken').resolves(refreshToken);
            mockGetItem.withArgs('refreshExp').resolves((Date.now() + 60 * 60 * 1000).toString());
            const mockStorage = ({
                getItem: mockGetItem,
                setItem: sinon.stub(),
            } as unknown) as NSStorageService.StorageServiceType;

            const authService = new AuthService(mockStorage);
            authService.initFromSavedSession();

            authService.addListener(AUTH_EVENTS.LOGIN, loginListener);
            authService.addListener(AUTH_EVENTS.LOGOUT, logoutListener);

            // Await pending resolved promises.
            await new Promise(resolve => {
                setImmediate(() => {
                    resolve();
                });
            });

            expect(loginListener).not.toBeCalled();
            expect(logoutListener).toBeCalled();
        });
    });
});
