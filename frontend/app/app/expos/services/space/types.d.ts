declare type EventEmitter = import('events').EventEmitter;

declare namespace SpaceServiceTypes {
    type SpaceInvitationParams = {
        email: string;
        role: Role | null;
        groups: Group[];
        customMessage: string;
    };

    type SpaceUpdateInvitationParams = {
        email: string;
        role?: Role | null;
        groups?: Group[];
        customMessage?: string;
    }

    /**
     * Contains space along with associated properties in relations to the current user's
     * access to this space such as his role, invitation status, and chat access.
     */
    type SpaceInfo = {
        /**
         * Space object
         */
        space: Space;

        /**
         * Current Users role in this space.
         * null = user not member of this space.
         */
        role: Role | null;

        /**
         * Chat info for this user for this space.
         * null = user is not member of this space.
         */
        chat: ChatInfo | null;

        /**
         * If the user is invited to the space.
         */
        invited: boolean;
    };

    type MembershipWithChat = {
        chat: ChatInfo;
    } & Membership;

    type SpacePage = {
        statusCode: number;
        content: any;
    };

    interface ISpacesService extends EventEmitter {
        getInfoBySlug: (slug: string) => Promise<SpaceInfo | null>;
        getInfoById: (id: string) => Promise<SpaceInfo | null>;
        getSpaces: () => Promise<Space[]>;
        getInvitedSpaces: () => Promise<Space[]>;
        createSpace: (name: string, slug?: string, icon?: string) => Promise<Space>;
        updateSpace: (space: Space) => Promise<Space>;
        checkNameNotTaken: (name: string) => Promise<boolean>;
        checkSlugNotTaken: (slug: string) => Promise<boolean>;
        getMemberById: (space: Space, membershipId: string) => Promise<MembershipWithChat>;
        getMembers: (space: Space, membershipIds?: string[]) => Promise<MembershipWithChat[]>;
        getInvitations: (space: Space) => Promise<Invitation[]>;
        isSoleOwner: (user: User, space: Space) => Promise<boolean>;
        getRole: (user: User, space: Space) => Promise<Role | null>;
        getPage: (space: Space, integration: NSIntegration.Integration, pageId?: string) => Promise<SpacePage>;
        getGroups: (space: Space) => Promise<Group[]>;
        getGroupsForUser: (space: Space, user: User) => Promise<Group[]>;
        sendInvitation: (space: Space, inviteParams: SpaceInvitationParams) => Promise<void>;
        updateInvitation: (space: Space, updateInviteParams: SpaceUpdateInvitationParams) => Promise<void>;
        cancelInvitation: (space: Space, email: string) => Promise<void>;
        resendInvitation: (space: Space, email: string) => Promise<void>;
        updateRole: (space: Space, user: User, role: Role) => Promise<void>;
        removeMember: (space: Space, user: User) => Promise<void>;
        deleteSpace: (space: Space) => Promise<boolean>;
        leaveSpace: (space: Space) => Promise<boolean>;
        getIntegrationInfos: (
            space: Space,
            keyword?: string,
            category?: string,
            isInstalled?: boolean
        ) => Promise<NSIntegration.IntegrationInfo[]>;
        getInstalledIntegrations: (space: Space) => Promise<NSIntegration.InstalledIntegration[]>;
        getInstalledIntegrationInfos: (
            space: Space
        ) => Promise<{ integration: NSIntegration.Integration; installationInfo: NSIntegration.InstallationInfo }[]>;
        getAccessibleIntegrationInfos: (
            space: Space,
            user: User,
            role: Role,
            keyword?: string,
            category?: string,
            isInstalled?: boolean
        ) => Promise<NSIntegration.IntegrationInfo[]>;
        getCanViewIntegrations: (space: Space, user: User) => Promise<NSIntegration.Integration[]>;
        getHomepageIntegration: (space: Space) => Promise<NSIntegration.Integration | null>;
        getInstallationInfo: (space: Space, installationId: string) => Promise<NSIntegration.InstallationInfo>;
        joinSpace: (space: Space) => Promise<void>;
        installIntegration: (space: Space, integration: NSIntegration.Integration) => Promise<void>;
        uninstallIntegration: (space: Space, integration: NSIntegration.Integration) => Promise<void>;
        activateIntegration: (space: Space, integration: NSIntegration.Integration) => Promise<void>;
        deactivateIntegration: (space: Space, integration: NSIntegration.Integration) => Promise<void>;
        setHomepageIntegration: (space: Space, integration: NSIntegration.Integration) => Promise<void>;
        removeHomepageIntegration: (space: Space, integration: NSIntegration.Integration) => Promise<void>;
        grantInstallationPermissions: (
            space: Space,
            integration: NSIntegration.Integration,
            userIds: string[],
            groupIds: string[],
            permissionIds: string[]
        ) => Promise<void>;
        updateInstallationPermissions: (
            space: Space,
            integration: NSIntegration.Integration,
            userId: string | null,
            groupId: string | null,
            permissionIds: string[]
        ) => Promise<void>;
        revokeInstallationAccess: (
            space: Space,
            integration: NSIntegration.Integration,
            userId: string | null,
            groupId: string | null
        ) => Promise<void>;
    }
}
