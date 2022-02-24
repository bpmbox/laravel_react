import { GraphqlService } from '.';
import sinon from 'sinon';
import gql from 'graphql-tag';
import { simpleApolloError } from '../../test-fixtures/object-mother';

describe('graphql-service', () => {
    // not a good test since we checking a private field.  But best we can do for now since mocking internals of
    // ApolloClient isn't easy.
    it('should set access token.', () => {
        const graphqlService = new GraphqlService({ graphqlClient: { query: jest.fn(), mutate: jest.fn() } });
        expect(graphqlService).toBeDefined();
        graphqlService.setAccessToken('OPEN_SESAME');
        expect(graphqlService.__accessToken).toBe('OPEN_SESAME');
    });

    it('should run graphql query', async () => {
        const queryStub = sinon.stub().resolves({
            data: {
                hello: {
                    greeting: 'world',
                },
            },
        });
        const graphqlService = new GraphqlService({ graphqlClient: { query: queryStub, mutate: jest.fn() } });
        expect(graphqlService).toBeDefined();

        const result = await graphqlService.query({
            query: gql`
                query {
                    hello {
                        greeting
                    }
                }
            `,
        });
        expect(queryStub.called).toBeTruthy();
        expect(result.data.hello.greeting).toBe('world');
    });

    it('should run graphql mutation', async () => {
        const mutateStub = sinon.stub().resolves({
            data: {
                hello: {
                    greeting: 'world',
                },
            },
        });
        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: mutateStub,
                query: jest.fn(),
            },
        });

        expect(graphqlService).toBeDefined();

        const result = await graphqlService.mutate({
            mutation: gql`
                mutation Greeting($person: String!) {
                    hello(person: $person) {
                        greeting
                    }
                }
            `,
            variables: {
                person: 'Foo',
            },
        });
        expect(mutateStub.called).toBeTruthy();
        expect(result.data && result.data.hello.greeting).toBe('world');
    });

    it('query error should be converted into more simple error.', async (): Promise<void> => {
        const queryStub = sinon.stub().rejects(simpleApolloError);

        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: jest.fn(),
                query: queryStub,
            },
        });

        await expect(
            graphqlService.query({
                query: gql`
                    query {
                        userGetProfile {
                            firstName
                            lastName
                        }
                    }
                `,
            })
        ).rejects.toThrowError('test error');
    });

    it('should return original error if convertError false', async () => {
        const queryStub = sinon.stub().rejects(simpleApolloError);

        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: jest.fn(),
                query: queryStub,
            },
        });

        await expect(
            graphqlService.query(
                {
                    query: gql`
                        query {
                            userGetProfile {
                                firstName
                                lastName
                            }
                        }
                    `,
                },
                false
            )
        ).rejects.toStrictEqual(simpleApolloError);
    });

    it('query error should reject when unexpected javascript errors.', async (): Promise<void> => {
        const queryStub = sinon.stub().throws(new Error('test error'));

        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: jest.fn(),
                query: queryStub,
            },
        });

        await expect(
            graphqlService.query({
                query: gql`
                    query {
                        userGetProfile {
                            firstName
                            lastName
                        }
                    }
                `,
            })
        ).rejects.toThrowError('test error');
    });

    it('mutation error error should be converted into more simple error.', async (): Promise<void> => {
        const mutationStub = sinon.stub().rejects(simpleApolloError);

        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: mutationStub,
                query: jest.fn(),
            },
        });

        await expect(
            graphqlService.mutate({
                mutation: gql`
                    mutation {
                        userUpdateProfile(input: { firstName: "foobar", lastName: "barfoo" }) {
                            firstName
                            lastName
                        }
                    }
                `,
            })
        ).rejects.toThrowError('test error');
    });

    it('mutation error error should be not be converted when convertError is false.', async (): Promise<void> => {
        const mutationStub = sinon.stub().rejects(simpleApolloError);

        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: mutationStub,
                query: jest.fn(),
            },
        });

        await expect(
            graphqlService.mutate(
                {
                    mutation: gql`
                        mutation {
                            userUpdateProfile(input: { firstName: "foobar", lastName: "barfoo" }) {
                                firstName
                                lastName
                            }
                        }
                    `,
                },
                false
            )
        ).rejects.toStrictEqual(simpleApolloError);
    });

    it('mutation should reject on unexpected javascript error.', async (): Promise<void> => {
        const mutationStub = sinon.stub().throws(new Error('test error'));

        const graphqlService = new GraphqlService({
            graphqlClient: {
                mutate: mutationStub,
                query: jest.fn(),
            },
        });

        await expect(
            graphqlService.mutate({
                mutation: gql`
                    mutation {
                        userUpdateProfile(input: { firstName: "foobar", lastName: "barfoo" }) {
                            firstName
                            lastName
                        }
                    }
                `,
            })
        ).rejects.toThrowError('test error');
    });
});
