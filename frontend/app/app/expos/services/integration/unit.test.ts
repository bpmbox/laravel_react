import { ApolloError } from 'apollo-client';
import { ASTNode } from 'graphql';
import sinon, { SinonSandbox } from 'sinon';
import { IntegrationService } from '.';
import { mutationContains } from '../../test-fixtures/graphql-test-utils';
import { sampleIntegration, sampleNewIntegration, simpleApolloError } from '../../test-fixtures/object-mother';
import graphqlService from '../graphql';

describe('IntegrationService', () => {
    const integrationId = '11111111-1111-1111-1111-111111111111';

    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    describe('createIntegration', () => {
        it('should call graphql integration for creating integration', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    integrationCreate: {
                        integration: sampleIntegration,
                    },
                },
            });

            const userService = new IntegrationService();

            const result = await userService.createIntegration(sampleNewIntegration);

            expect(mutate.called).toBeTruthy();
            expect(result).toStrictEqual(sampleIntegration);
        });

        it('should raise error if request fails due to incompleted input', async () => {
            sandbox.stub(graphqlService, 'mutate').rejects(simpleApolloError);

            let failedData = { ...sampleNewIntegration, access: 'wrong_access_value' };

            const integrationService = new IntegrationService();
            await expect(integrationService.createIntegration(failedData)).rejects.toBeDefined();
        });

        it('should raise form input error if value is not correct', async () => {
            sandbox.stub(graphqlService, 'mutate').rejects(
                new ApolloError({
                    graphQLErrors: [
                        {
                            message: 'A validation error has occurred.',
                            locations: [{ line: 1, column: 10 }],
                            path: ['Integration'],
                            nodes: [{} as ASTNode],
                            source: undefined,
                            positions: [5],
                            originalError: null,
                            name: 'ValidationError',
                            extensions: {
                                code: '002-409-0001',
                            },
                        },
                    ],
                    networkError: null,
                })
            );

            const userService = new IntegrationService();

            try {
                await userService.createIntegration(sampleNewIntegration);
            } catch (err) {
                return expect(err.message).toBe('GraphQL error: A validation error has occurred.');
            }
            fail('Should raise an exception.');
        });
    });

    describe('getIntegration', () => {
        it('should return an integration by id', async () => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    integration: sampleIntegration,
                },
            } as any);

            const integrationService = new IntegrationService();

            const results = await integrationService.getIntegration(integrationId);

            expect(results).toStrictEqual(sampleIntegration);
        });

        it('should handle throw error.', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').rejects(new Error('Test Error.'));

            const integrationService = new IntegrationService();
            await expect(integrationService.getIntegration(integrationId)).rejects.toMatchObject({
                message: 'Test Error.',
            });
        });
    });

    describe('getMyIntegrations', () => {
        it('should return a list on integrations of currentUser', async () => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    currentUser: {
                        integrations: [sampleIntegration, sampleIntegration],
                    },
                },
            } as any);

            const integrationService = new IntegrationService();

            const results = await integrationService.getMyIntegrations();

            expect(results).toStrictEqual([sampleIntegration, sampleIntegration]);
        });

        it('should handle throw error.', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').rejects(new Error('Test Error.'));

            const integrationService = new IntegrationService();
            await expect(integrationService.getMyIntegrations()).rejects.toMatchObject({ message: 'Test Error.' });
        });
    });

    describe('integrationUpdate', () => {
        it('should call graphql endpoint for updating integration', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    integration: {
                        update: {
                            integration: sampleIntegration,
                        },
                    },
                },
            });

            const integrationService = new IntegrationService();

            const result = await integrationService.updateIntegration(integrationId, {
                name: 'Event2',
            });

            expect(mutationContains(mutate, 'integrationUpdate')).toBeTruthy();
            expect(result).toStrictEqual(sampleIntegration);
        });

        it('should raise error if request fails', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').rejects(simpleApolloError);
            const integrationService = new IntegrationService();

            // Note: await is on the outside because we are asserting an exception.
            await expect(
                integrationService.updateIntegration(integrationId, {
                    name: 'Event',
                })
            ).rejects.toBeDefined();
            expect(mutationContains(mutate, 'integrationUpdate')).toBeTruthy();
        });
    });

    describe('integrationDelete', () => {
        it('should call delete endpoint', async (): Promise<void> => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    integration: {
                        delete: {
                            integration: sampleIntegration,
                        },
                    },
                },
            });

            const integrationService = new IntegrationService();
            await integrationService.deleteIntegration(integrationId);

            expect(mutationContains(mutate, 'delete')).toBeTruthy();
        });
    });
});
