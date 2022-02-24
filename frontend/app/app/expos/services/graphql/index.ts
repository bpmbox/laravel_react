import { ApolloClient, QueryOptions, ApolloQueryResult, MutationOptions, ApolloError } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { FetchResult } from 'apollo-link';
import { toGraphqlError } from '../../libs/convert-graphql-error';
import defaultTo from 'lodash/defaultTo';

/**
 * Provides 'query' and 'mutate' methods for making graphql queries.
 */
export class GraphqlService implements GraphqlServiceTypes.IGraphqlService {
    /**
     * Underlying graphql client.
     */
    __graphqlClient: GraphqlServiceTypes.IMinimalGraphqlClient;

    /**
     * Access token to pass into every request.
     */
    __accessToken: string | null = null;

    // This very low level to mock to unit test, with very little value in return.
    // istanbul ignore next
    constructor(dependencies: { graphqlClient: GraphqlServiceTypes.IMinimalGraphqlClient | undefined } | null = null) {
        // If we're injecting injecting graphql client
        if (dependencies && dependencies.graphqlClient) {
            this.__graphqlClient = dependencies.graphqlClient;
            return;
        }

        const httpLink = createUploadLink({
            uri: defaultTo(process.env.REACT_APP_GRAPHQL_URL, 'http://localhost:8000/graphql'),
        });

        // This is in the constructor rather than being injected because it needs to reference the instance variable for
        // __accessToken.
        const authLink = setContext((_, { headers }) => {
            // return the headers to the context so httpLink can read them
            // tslint:disable-next-line:no-console

            return {
                headers: {
                    ...headers,
                    authorization: this.__accessToken ? `Bearer ${this.__accessToken}` : '',
                },
            };
        });

        this.__graphqlClient = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        });
    }

    static _getOperationNames(queryOptions: QueryOptions | MutationOptions, resp: ApolloQueryResult<any>): string[] {
        let name: string[];

        try {
            if ('query' in queryOptions) {
                name = queryOptions.query.definitions.map(def => (def as any).name.value);
            } else {
                name = queryOptions.mutation.definitions.map(def => (def as any).name.value);
            }
        } catch (e) {
            name = Object.keys(resp.data);
        }

        return name;
    }

    /**
     * Perform graphql query
     * @param options See: ApolloClient query options.
     * @param convertErrors True - convert graphql errors to regular errors.  False - Rethrow Apollow errors as is.
     */
    async query(options: QueryOptions, convertErrors: boolean = true): Promise<ApolloQueryResult<any>> {
        const _start = +new Date();

        let resp;

        try {
            resp = await this.__graphqlClient.query(options);
        } catch (e) {
            if (!convertErrors || !(e instanceof ApolloError)) {
                throw e;
            }
            throw toGraphqlError(e);
        }

        const _end = +new Date();
        console.groupCollapsed(
            'Query name:',
            GraphqlService._getOperationNames(options, resp),
            'at:',
            _start,
            'Duration:',
            `${_end - _start}ms`
        );
        console.debug('Options:', options.query.loc!.source.body);
        console.debug('Variables:', options.variables);
        console.debug('Response', resp.data);
        console.debug('Auth Token', this.__accessToken);
        console.groupEnd();
        return resp;
    }

    /**
     * Perform graphql mutation using CPS: Continuation-passing style
     * @param options See: ApolloClient mutation options.
     * @param convertErrors True - convert graphql errors to regular errors.  False - Rethrow Apollow errors as is.
     */
    async mutate(options: MutationOptions, convertErrors: boolean = true): Promise<FetchResult> {
        const _start = +new Date();

        let resp;

        try {
            resp = await this.__graphqlClient.mutate(options);
        } catch (e) {
            if (!convertErrors || !(e instanceof ApolloError)) {
                throw e;
            }
            throw toGraphqlError(e);
        }

        const _end = +new Date();
        console.groupCollapsed(
            'Mutation name:',
            GraphqlService._getOperationNames(options, resp),
            'at:',
            _start,
            'Duration:',
            `${_end - _start}ms`
        );
        console.debug('Options:', options.mutation.loc!.source.body);
        console.debug('Variables:', options.variables);
        console.debug('Response', resp.data);
        console.groupEnd();
        return resp;
    }

    /**
     * Sets access token.
     */
    setAccessToken(accessToken: string): void {
        this.__accessToken = accessToken;
    }

    /**
     * Clear in-memory cache
     */
    async clearInMemoryCache() {
        // @ts-ignore
        await this.__graphqlClient.resetStore();
    }
}

/**
 * GraphqlService instance.
 */
export default new GraphqlService();
