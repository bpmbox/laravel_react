import { ApolloError } from 'apollo-client';
import { ASTNode } from 'graphql';
import sinon, { SinonSandbox } from 'sinon';
import { UserService } from '.';
import { mutationContains } from '../../test-fixtures/graphql-test-utils';
import { sampleUser, simpleApolloError } from '../../test-fixtures/object-mother';
import graphqlService from '../graphql';
import authService from '../auth';

describe('UserService', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    describe('registerAccountUser', () => {
        it('should call graphql endpoint for creating user', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    currentUser: {
                        updateProfile: {
                            user: {
                                id: 'abc-123',
                                givenName: 'foo',
                                familyName: 'bar',
                                email: 'foo@bar.com',
                            },
                        },
                    },
                },
            });

            const userService = new UserService();

            const result = await userService.registerAccountUser({
                givenName: 'foo',
                familyName: 'bar',
                purpose: 'business',
                avatarUrl: '/some.image.jpg',
            });

            expect(mutate.called).toBeTruthy();
            expect(result).toStrictEqual({
                id: 'abc-123',
                givenName: 'foo',
                familyName: 'bar',
                email: 'foo@bar.com',
            });
        });

        it('should raise error if request fails', async () => {
            sandbox.stub(graphqlService, 'mutate').rejects(simpleApolloError);

            const userService = new UserService();
            await expect(
                userService.registerAccountUser({
                    givenName: 'foo',
                    familyName: 'bar',
                    purpose: 'business',
                    avatarUrl: '/some.image.jpg',
                })
            ).rejects.toBeDefined();
        });

        it('should look up known error codes if failed request has an error code.', async () => {
            sandbox.stub(graphqlService, 'mutate').rejects(
                new ApolloError({
                    graphQLErrors: [
                        {
                            message: 'A validation error has ocurred.',
                            locations: [{ line: 1, column: 10 }],
                            path: ['User', 'email'],
                            nodes: [{} as ASTNode],
                            source: undefined,
                            positions: [5],
                            originalError: null,
                            name: 'ValidationError',
                            extensions: {
                                code: '002-409-0001',
                                time_thrown: '2019-07-18T01:45:42.615Z',
                            },
                        },
                    ],
                    networkError: null,
                })
            );

            const userService = new UserService();

            try {
                await userService.registerAccountUser({
                    givenName: 'foo',
                    familyName: 'bar',
                    purpose: 'business',
                    avatarUrl: '/some.image.jpg',
                });
            } catch (err) {
                return expect(err.message).toBe('The email you used is already taken.');
            }
            fail('Should raise an exception.');
        });
    });

    describe('getAccount', () => {
        it('should return a user', async () => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    currentUser: {
                        user: sampleUser,
                    },
                },
            } as any);

            const userService = new UserService();

            const results = await userService.getAccount();

            expect(results).toStrictEqual(sampleUser);
        });

        it('should handle throw error.', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').rejects(new Error('Test Error.'));

            const userService = new UserService();
            await expect(userService.getAccount()).rejects.toMatchObject({ message: 'Test Error.' });
        });
    });

    describe('updateAccountUser', () => {
        it('should call graphql endpoint for updating user', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    currentUser: {
                        updateProfile: {
                            user: {
                                id: sampleUser.id,
                                givenName: 'foo',
                                familyName: 'bar',
                                email: sampleUser.email,
                                avatarUrl: '/some.image.jpg',
                            },
                        },
                    },
                },
            });

            const userService = new UserService();

            const result = await userService.updateAccountUser({
                givenName: 'foo',
                familyName: 'bar',
                avatarUrl: '/some.image.jpg',
            });

            expect(mutationContains(mutate, 'updateProfile')).toBeTruthy();
            expect(result).toStrictEqual({
                id: sampleUser.id,
                givenName: 'foo',
                familyName: 'bar',
                email: sampleUser.email,
                avatarUrl: '/some.image.jpg',
            });
        });

        it('should raise error if request fails', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').rejects(simpleApolloError);
            const userService = new UserService();

            // Note: await is on the outside because we are asserting an exception.
            await expect(
                userService.updateAccountUser({
                    givenName: 'foo',
                    familyName: 'bar',
                    avatarUrl: '/some.image.jpg',
                })
            ).rejects.toBeDefined();
            expect(mutationContains(mutate, 'updateProfile')).toBeTruthy();
        });
    });

    describe('deactivateAccount', () => {
        it('should call deactivate endpoint', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate');
            const userService = new UserService();
            await userService.deactivateAccount();

            expect(mutationContains(mutate, 'deactivate')).toBeTruthy();
        });

        it('should logout user as a side effect of deactivating account', async (): Promise<void> => {
            const logout = sandbox.spy(authService, 'logout');
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    userDeactivateUser: {
                        success: true,
                    },
                },
            });
            const userService = new UserService();
            await userService.deactivateAccount();

            expect(logout.calledOnce).toBeTruthy();
        });
    });
});
