declare namespace GraphqlServiceTypes {
    interface IGraphqlService {
        query: (options: QueryOptions) => Promise<ApolloQueryResult<any>>;
        mutate: (options: MutationOptions) => Promise<any>;
        setAccessToken: (accessToken: string) => void;
        clearInMemoryCache: () => Promise<void>;
    }

    interface IMinimalGraphqlClient {
        query: (options: QueryOptions) => Promise<ApolloQueryResult<any>>;
        mutate: (options: MutationOptions) => Promise<any>;
    }
}
