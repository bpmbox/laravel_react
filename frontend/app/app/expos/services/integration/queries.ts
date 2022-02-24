import gql from 'graphql-tag';

export const INTEGRATION_CONFIG = gql`
    query integrationConfig {
        integrationConfig
    }
`;

export const INTEGRATION_MY_INTEGRATIONS = gql`
    query integrationMyIntegrations {
        currentUser {
            integrations {
                id
                logo
                name
                access
                restrictedSpaces {
                    id
                    name
                }
            }
        }
    }
`;

export const INTEGRATION_INTEGRATION = gql`
    query integrationIntegration($integrationId: ID!) {
        integration(id: $integrationId) {
            id
            name
            logo
            shortDesc
            fullDesc
            category
            type
            url
            uiHook
            messageHook
            searchHook
            access
            permissions
            _restrictedSpaces: restrictedSpaces {
                id
                iconUrl: icon
                name
                slug
            }
        }
    }
`;

export const INTEGRATION_CREATE = gql`
    mutation integrationCreate($input: IntegrationCreateMutationInput!) {
        integrationCreate(input: $input) {
            integration {
                id
                name
                logo
                shortDesc
                fullDesc
                category
                type
                url
                uiHook
                messageHook
                searchHook
                access
                permissions
                restrictedSpaces {
                    id
                    iconUrl: icon
                    name
                    slug
                }
            }
        }
    }
`;

export const INTEGRATION_UPDATE = gql`
    mutation integrationUpdate($integrationId: ID!, $input: IntegrationUpdateMutationInput!) {
        integration(id: $integrationId) {
            update(input: $input) {
                integration {
                    id
                    name
                    logo
                    shortDesc
                    fullDesc
                    category
                    type
                    url
                    uiHook
                    messageHook
                    searchHook
                    access
                    permissions
                    restrictedSpaces {
                        id
                        iconUrl: icon
                        name
                        slug
                    }
                }
            }
        }
    }
`;

export const INTEGRATION_DELETE = gql`
    mutation integrationDelete($integrationId: ID!) {
        integration(id: $integrationId) {
            delete {
                success
            }
        }
    }
`;

export const INTEGRATION_PAGE_ACTION = gql`
    mutation spacePageAction($spaceId: ID!, $params: PageActionMutationInput!) {
        space(spaceId: $spaceId) {
            pageAction(input: $params) {
                statusCode
                content
            }
        }
    }
`;

export const INTEGRATION_PAGE = gql`
    query page($spaceId: ID!, $integrationId: UUID!) {
        space(spaceId: $spaceId) {
            page(integrationId: $integrationId) {
                statusCode
                content
            }
        }
    }
`;
