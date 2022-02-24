declare namespace NSIntegration {
    interface Category {
        codename: string;
        label: string;
    }

    interface Access {
        codename: string;
        label: string;
    }

    interface Type {
        codename: string;
        label: string;
    }

    interface Permission {
        name: string;
        codename: string;
        label: string;
    }

    interface Config {
        categoryChoices: Category[];
        typeChoices: Type[];
        accessChoices: Access[];
        defaultPermissionChoices: Permission[];
    }

    type NewIntegrationParams = {
        name: string;
        logo: string;
        url: string;
        uiHook?: string;
        messageHook?: string;
        searchHook?: string;
        shortDesc: string;
        fullDesc: string;
        category: string;
        type: string;
        access: string;
        permissions: string[];
        restrictedSpaceSlugs: string[];
    };

    type UpdateIntegrationParams = {
        name?: string;
        logo?: string;
        url?: string;
        uiHook?: string;
        messageHook?: string;
        searchHook?: string;
        shortDesc?: string;
        fullDesc?: string;
        category?: string;
        type?: string;
        access?: string;
        permissions?: string[];
        restrictedSpaceSlugs?: string[];
    };

    type FormData = NewIntegrationParams | UpdateIntegrationParams;

    interface Integration {
        id: string;
        name: string;
        logo: string;
        url: string;
        uiHook?: string;
        messageHook?: string;
        searchHook?: string;
        shortDesc: string;
        fullDesc: string;
        category: string;
        type: string;
        access: string;
        permissions: string[];
        restrictedSpaces: Space[];
    }

    interface InstalledIntegration {
        id: string;
        name: string;
        logo: string;
        uiHook: string;
    }

    interface IntegrationInfo {
        integration: Integration;
        isInstalled: boolean;
        isActive: boolean;
        installationId: string;
        isHomepage: boolean;
    }

    interface UserPermissions {
        user: User;
        permissions: string[];
    }

    interface GroupPermissions {
        group: Group;
        permissions: string[];
    }

    interface InstallationInfo {
        usersPermissions: UserPermissions[];
        groupsPermissions: GroupPermissions[];
    }

    type PermissionsInfo = {
        id: string;
        name: string;
        permissions: any[];
        avatar?: string | null;
        type: 'user' | 'group';
    };

    interface IntegrationContent {
        status: number;
        content: string;
    }

    type PageActionParams = {
        integrationId: string;
        pageId?: string;
        action: 'submit';
        props: any[];
    };
}
