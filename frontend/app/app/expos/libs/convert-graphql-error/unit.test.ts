import { toGraphqlError, TreeError, toLocalizedError, toFormikErrors } from '.';
import { DateTime } from 'luxon';
import { ApolloError } from 'apollo-client';
import { ASTNode } from 'graphql';

describe('toGraphqlError', () => {
    it('should return Error with translated error', () => {
        const err = toGraphqlError(
            new ApolloError({
                graphQLErrors: [
                    {
                        message: 'Missing user email',
                        locations: [{ line: 1, column: 10 }],
                        path: ['User', 'email'],
                        nodes: [{} as ASTNode],
                        source: undefined,
                        positions: [5],
                        originalError: null,
                        name: 'ValidationError',
                        extensions: {
                            code: '000-400-0003',
                            time_thrown: DateTime.local().toISO(),
                        },
                    },
                ],
                networkError: null,
            })
        );

        expect(err.message).toBe('Please check your input and try again.');
    });

    it("should fallback to provided message if message for error code doesn't exit.", () => {
        const err = toGraphqlError(
            new ApolloError({
                graphQLErrors: [
                    {
                        message: "Message doesn't exist",
                        locations: [{ line: 1, column: 10 }],
                        path: ['Space', 'id'],
                        nodes: [{} as ASTNode],
                        source: undefined,
                        positions: [5],
                        originalError: null,
                        name: 'SomethingWrongError',
                        extensions: {
                            code: '002-500-0011',
                            time_thrown: DateTime.local().toISO(),
                        },
                    },
                ],
                networkError: null,
            })
        );

        expect(err.message).toBe("Message doesn't exist");
    });

    it('should raise unauthorized error if error code is 403 Forbidden', () => {
        const err = toGraphqlError(
            new ApolloError({
                graphQLErrors: [
                    {
                        message: 'You are not authorized to view this resource',
                        locations: [{ line: 1, column: 10 }],
                        path: ['Space', 'id'],
                        nodes: [{} as ASTNode],
                        source: undefined,
                        positions: [5],
                        originalError: null,
                        name: 'AuthorizationError',
                        extensions: {
                            code: '000-403-0004',
                            time_thrown: DateTime.local().toISO(),
                            type: 'AuthorizationError'
                        },
                    },
                ],
                networkError: null,
            })
        );

        expect(err.type).toBe('AuthorizationError');
    });

    it('should fall back to server message for AuthorizationError without error string localized', () => {
        const err = toGraphqlError(
            new ApolloError({
                graphQLErrors: [
                    {
                        message: "Message doesn't exist",
                        locations: [{ line: 1, column: 10 }],
                        path: ['Space', 'id'],
                        nodes: [{} as ASTNode],
                        source: undefined,
                        positions: [5],
                        originalError: null,
                        name: 'AuthorizationError',
                        extensions: {
                            code: '999-403-9999',
                            time_thrown: DateTime.local().toISO(),
                        },
                    },
                ],
                networkError: null,
            })
        );

        expect(err).toBeInstanceOf(TreeError);
    });

    it('should convert to localized error', () => {
        const error = new ApolloError({
            graphQLErrors: [
                {
                    message: 'This is message',
                    locations: [{ line: 1, column: 10 }],
                    path: ['Space', 'id'],
                    nodes: [{} as ASTNode],
                    source: undefined,
                    positions: [5],
                    originalError: null,
                    name: 'AuthorizationError',
                    extensions: {
                        code: '999-403-9999',
                        time_thrown: DateTime.local().toISO(),
                    },
                },
            ],
            networkError: null,
        });

        const localizedError = toLocalizedError(error);
        expect(localizedError).toBe('This is message');
    });

    it('should convert to formik error', () => {
        const error = new ApolloError({
            graphQLErrors: [
                {
                    message: 'This is message',
                    locations: [{ line: 1, column: 10 }],
                    path: ['Space', 'id'],
                    nodes: [{} as ASTNode],
                    source: undefined,
                    positions: [5],
                    originalError: null,
                    name: 'AuthorizationError',
                    extensions: {
                        code: '999-403-9999',
                        time_thrown: DateTime.local().toISO(),
                        extra: {
                            name: [
                                { message: 'name error1', codename: 'input_error' },
                                { message: 'name error2', codename: 'input_error' },
                            ],
                        },
                    },
                },
            ],
            networkError: null,
        });

        const formikErrors = toFormikErrors(error);
        expect(formikErrors).toEqual({ name: 'name error1. name error2' });
    });

    it('should console log and return false if code is invalid', () => {
        const err = new ApolloError({
            graphQLErrors: [
                {
                    message: 'You are not authorized to view this resource',
                    locations: [{ line: 1, column: 10 }],
                    path: ['Space', 'id'],
                    nodes: [{} as ASTNode],
                    source: undefined,
                    positions: [5],
                    originalError: null,
                    name: 'AuthorizationError',
                    extensions: {
                        code: 'wrongcode',
                        time_thrown: DateTime.local().toISO(),
                    },
                },
            ],
            networkError: null,
        });

        expect(toGraphqlError(err).message).toEqual('You are not authorized to view this resource');
    });
});
