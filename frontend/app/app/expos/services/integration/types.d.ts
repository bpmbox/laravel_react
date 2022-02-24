declare namespace IntegrationServiceTypes {
    interface IIntegrationService extends EventEmitter {
        getConfig: () => Promise<IntegrationConfig>;
        createIntegration: (newData: NSIntegration.NewData) => Promise<NSIntegration.Integration>;
        updateIntegration: (
            integrationId: string,
            changes: NSIntegration.UpdateIntegrationParams
        ) => Promise<NSIntegration.Integration>;
        deleteIntegration: (integrationId: string) => Promise<NSIntegration.Integration>;
        getIntegration: (integrationId: string) => Promise<NSIntegration.Integration>;
        getMyIntegrations: (forceRefresh?: boolean) => Promise<NSIntegration.Integration[]>;
        performPageAction: (spaceId: string, params: NSIntegration.PageActionParams) => Promise<any>;
    }
}
