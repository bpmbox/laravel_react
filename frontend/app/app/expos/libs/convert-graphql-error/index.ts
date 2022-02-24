import { ApolloError } from "apollo-client";
import i18n from "../../i18n";
import get from 'lodash/get';

/**
 * toGraphqlErrors
 */
export class TreeError extends Error {
    type = null;
    code = null;

    constructor(message: string, code: string|null = null, type: string|null = null) {
        super(message);

        this.code = code;
        this.type = type;
    }
}

/**
 * Converts an ApolloError into a normal error by returning normal error with the
 * error code message translated.
 * @param err
 */
export function toGraphqlError(err: ApolloError) {
    const code = get(err, 'graphQLErrors[0].extensions.code');
    const type = get(err, 'graphQLErrors[0].extensions.type');

    const graphqlErrorMessage: string = get(err, 'graphQLErrors[0].message');
    const localizedError: string = i18n.exists(`Errors::${code}`) ?
        i18n.t(`Errors::${code}`) :
        graphqlErrorMessage;

    return new TreeError(localizedError, code, type);
}

/**
 * Extract form errors from ApolloError
 */
export function toFormikErrors(err: ApolloError) {
    let errors = get(err, 'graphQLErrors[0].extensions.extra') || {};
    let resp: {[field: string]: string} = {};

    Object.keys(errors).forEach(field => {
        const fieldErrors = errors[field];
        resp[field] = fieldErrors.map((e: DjFieldError) => e.message).join('. ');
    });

    return resp;
}

/**
 * Convert ApolloError to localized text error
 */
export function toLocalizedError(err: ApolloError) {
    const code = get(err, 'graphQLErrors[0].extensions.code');
    const graphqlErrorMessage: string = get(err, 'graphQLErrors[0].message');
    const localizedError: string = i18n.exists(`Errors::${code}`) ?
        i18n.t(`Errors::${code}`) :
        graphqlErrorMessage;

    // Fallback to original error message
    return localizedError || err.message;
}
