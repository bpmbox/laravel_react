/* istanbul ignore file */
import { SinonStub } from 'sinon';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { MockLink } from '@apollo/react-testing';

/**
 * Gets the name of the first mutation called on a sinon stub of graphqlService.mutate.
 * @param graphqlStub
 * @param call Call index of mocked function.
 */
export function getFirstMutation(mutateStub: SinonStub, call = 0) {
    return mutateStub.getCall(call).args[0].mutation.definitions[0].selectionSet.selections[0].name.value;
}

/**
 * Tests if a mutation contains a String or regex.
 * @param mutateStub
 * @param matcher
 * @param call
 */
export function mutationContains(mutateStub: SinonStub, matcher: RegExp | string, call: number = 0) {
    const mutationAsString = JSON.stringify(mutateStub.getCall(call).args[0]);

    return mutationAsString.search(matcher) >= 0;
}

/**
 * Creates a test Apollo client with support for mock responses
 * @param mocks mock requests and responses
 * @param addTypename add `__typename` field for queries (default: true)
 * @returns ApolloClient
 */
export function createTestClient(mocks: any[], addTypename = true): ApolloClient<NormalizedCacheObject> {
    return new ApolloClient({
        link: new MockLink(mocks || [], addTypename),
        cache: new InMemoryCache({ addTypename }),
    });
}
