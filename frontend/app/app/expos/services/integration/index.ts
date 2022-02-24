import { ApolloQueryResult } from 'apollo-client';
import { EventEmitter } from 'events';
import graphqlService from '../graphql';
import merge from 'lodash/merge';
import {
    INTEGRATION_CREATE,
    INTEGRATION_UPDATE,
    INTEGRATION_DELETE,
    INTEGRATION_CONFIG,
    INTEGRATION_INTEGRATION,
    INTEGRATION_MY_INTEGRATIONS,
    INTEGRATION_PAGE,
    INTEGRATION_PAGE_ACTION,
} from './queries';
import pick from 'lodash/pick';

/**
 * Emitted when an integration has been added, deleted, or updated.
 */
export const INTEGRATION_UPDATED_EVENT = 'INTEGRATION_UPDATED_EVENT';

export class IntegrationService extends EventEmitter implements IntegrationServiceTypes.IIntegrationService {
    async getConfig(): Promise<NSIntegration.Config> {
        const result = await graphqlService.query({
            query: INTEGRATION_CONFIG,
        });
        return result.data.integrationConfig;
    }

    async createIntegration(values: NSIntegration.NewIntegrationParams): Promise<NSIntegration.Integration> {
        const result = (await graphqlService.mutate(
            {
                mutation: INTEGRATION_CREATE,
                variables: { input: values },
            },
            false
        )) as ApolloQueryResult<{ integrationCreate: { integration: NSIntegration.Integration } }>;
        this.emit(INTEGRATION_UPDATED_EVENT);
        return result.data.integrationCreate.integration;
    }

    async updateIntegration(
        integrationId: string,
        values: NSIntegration.UpdateIntegrationParams
    ): Promise<NSIntegration.Integration> {
        const result = (await graphqlService.mutate(
            {
                mutation: INTEGRATION_UPDATE,
                variables: { integrationId, input: values },
            },
            false
        )) as ApolloQueryResult<{ integration: { update: { integration: NSIntegration.Integration } } }>;

        this.emit(INTEGRATION_UPDATED_EVENT, { updated: result.data.integration.update.integration });
        return result.data.integration.update.integration;
    }

    async deleteIntegration(integrationId: string) {
        const result = (await graphqlService.mutate({
            mutation: INTEGRATION_DELETE,
            variables: { integrationId },
        })) as ApolloQueryResult<{ integration: { delete: { integration: NSIntegration.Integration } } }>;
        this.emit(INTEGRATION_UPDATED_EVENT);
        return result.data.integration.delete.integration;
    }

    async getMyIntegrations(forceRefresh?: boolean): Promise<NSIntegration.Integration[]> {
        const result = (await graphqlService.query(
            merge(
                {
                    query: INTEGRATION_MY_INTEGRATIONS,
                },
                forceRefresh ? { fetchPolicy: 'no-cache' } : {}
            ),
            false
        )) as ApolloQueryResult<{ currentUser: { integrations: NSIntegration.Integration[] } }>;

        return result.data.currentUser.integrations;
    }

    async getIntegration(integrationId: string): Promise<NSIntegration.Integration> {
        const result = (await graphqlService.query(
            {
                query: INTEGRATION_INTEGRATION,
                variables: { integrationId },
            },
            false
        )) as ApolloQueryResult<{ integration: NSIntegration.Integration }>;

        let integration = result.data.integration;
        // @ts-ignore
        integration.restrictedSpaces = integration._restrictedSpaces;
        return integration;
    }

    async getIntegrationPage(spaceId: string, integrationId: string, pageId: string): Promise<string> {
        const result = (await graphqlService.query(
            {
                query: INTEGRATION_PAGE,
                variables: { spaceId, integrationId, pageId },
            },
            false
        )) as ApolloQueryResult<{ space: { page: NSIntegration.IntegrationContent } }>;

        let pageContent = result.data.space.page.content;
        return pageContent;
    }

    async performPageAction(spaceId: string, params: NSIntegration.PageActionParams) {
        // TODO: should detect the type from server and we should be able to send Json params directly
        // This is just a patch
        const jsonProps = params.props.map((prop: any) => {
            if (prop.value) {
                return { ...prop, value: JSON.stringify(prop.value) };
            } else {
                return prop;
            }
        });

        // const encodedParams = {...params, props: jsonProps};
        const encodedParams = {
            ...pick(params, 'integrationId', 'pageId', 'action'),
            props: jsonProps,
        };

        const result = (await graphqlService.mutate({
            mutation: INTEGRATION_PAGE_ACTION,
            variables: { spaceId, params: encodedParams },
        })) as ApolloQueryResult<{ space: { pageAction: { statusCode: number; content: string } } }>;

        let pageContent = result.data.space.pageAction.content;
        return JSON.parse(pageContent);
    }
}

const integrationService: IntegrationServiceTypes.IIntegrationService = new IntegrationService();

export default integrationService;
