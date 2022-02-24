import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';

// Queries =======================================================================
export const SPACE_GET_LIST = gql`
    query {
        currentUser {
            spaces {
                id
                name
                slug
                iconUrl: icon
                membership {
                    role
                }
            }
        }
    }
`;

export const SPACE_GET_INVITES = gql`
    query {
        currentUser {
            invites {
                space {
                    id
                    name
                    slug
                    iconUrl: icon
                }
            }
        }
    }
`;
export type SpaceGetInvitesQueryType = {
    currentUser: {
        invites: {
            space: Space;
        }[];
    };
};

export const SPACE_CHECK_NAME_EXISTS = gql`
    query checkName($name: String!) {
        spaceCheckNameExists(name: $name)
    }
`;

export const SPACE_CHECK_SLUG_EXISTS = gql`
    query checkSlug($slug: String!) {
        spaceCheckSlugExists(slug: $slug)
    }
`;

/**
 * Type returned by GetInfoBySlug and GetInfoById
 */
export type GetInfoQueryResult = {
    space: {
        space: Space;
        spaceMembership: {
            id: string;
            membership: {
                role: string;
                chat: {
                    userId: string;
                    accessToken: string;
                };
            };
        };
        wasInvited: boolean;
    };
};

// TODO: Rename top level space() to getSpace(), and move membership out of space type in graphql API.
export const SPACE_GET_INFO_BY_SLUG = gql`
    query getInfo($slug: String!) {
        space(slug: $slug) {
            space {
                id
                name
                slug
                iconUrl: icon
            }
            # TODO: on the backend, we should move these up one level.
            spaceMembership: space {
                membership {
                    role
                    chatInfo {
                        userId
                        accessToken
                    }
                }
            }
            wasInvited
        }
    }
`;

// TODO: Rename top level space() to getSpace(), and move membership out of space type in graphql API.
export const SPACE_GET_INFO_BY_ID = gql`
    query getInfo($spaceId: ID!) {
        space(spaceId: $spaceId) {
            space {
                id
                name
                slug
                iconUrl: icon
            }
            spaceMembership: space {
                # TODO: on the backend, we should move these up one level.
                membership {
                    role
                    chatInfo {
                        userId
                        accessToken
                    }
                }
            }
            wasInvited
        }
    }
`;

export type SpaceGetInfoByIdType = {
    space: {
        space: Space & {
            membership: Membership;
        };
    };
};

export type SpaceGetMembersResult = {
    space: {
        members: SpaceServiceTypes.MembershipWithChat[];
    };
};

export const SPACE_GET_MEMBERS = gql`
    query getMembers($spaceId: ID!, $membershipIds: [ID]) {
        space(spaceId: $spaceId) {
            members(membershipIds: $membershipIds) {
                member {
                    id
                    givenName: firstName
                    familyName: lastName
                    email
                    avatarUrl: avatar
                }
                role
                chat: chatInfo {
                    userId
                    accessToken
                }
            }
        }
    }
`;

export const SPACE_GET_INVITATIONS = gql`
    query getInvitations($spaceId: ID!) {
        space(spaceId: $spaceId) {
            invites {
                email
                role
                groupIds
                message
                user {
                    id
                    givenName: firstName
                    familyName: lastName
                    email
                    avatarUrl: avatar
                }
            }
        }
    }
`;
export type SpaceGetInvitationsQueryType = {
    space: {
        invites: {
            email: string;
            role: string;
            user?: User;
            groupIds?: string[];
            message?: string;
        }[];
    };
};

export const SPACE_GROUPS = gql`
    query getGroups($spaceId: ID!) {
        space(spaceId: $spaceId) {
            groups {
                id
                name
            }
        }
    }
`;

export const SPACE_INSTALLATION_INFO = gql`
    query getInstallationInfo($spaceId: ID!, $installationId: ID!) {
        space(spaceId: $spaceId) {
            installationInfo(id: $installationId) {
                usersPermissions {
                    user {
                        id
                        givenName: firstName
                        familyName: lastName
                        avatarUrl: avatar
                    }
                    permissions
                }
                groupsPermissions {
                    group {
                        id
                        name
                    }
                    permissions
                }
            }
        }
    }
`;

export const SPACE_INTEGRATION_INFOS = gql`
    query getIntegrationInfos($spaceId: ID!, $keyword: String, $category: String, $isInstalled: Boolean) {
        space(spaceId: $spaceId) {
            integrationInfos(keyword: $keyword, category: $category, isInstalled: $isInstalled) {
                integration {
                    id
                    name
                    access
                    logo
                    shortDesc
                    fullDesc
                    category
                    permissions
                }
                isInstalled
                isActive
                isHomepage
                installationId
            }
        }
    }
`;

export const SPACE_GET_INSTALLED_INTEGRATIONS = gql`
    query getInstalledIntegrations($spaceId: ID!) {
        space(spaceId: $spaceId) {
            integrationInfos(isInstalled: true, isActivated: true) {
                integration {
                    id
                    name
                    logo
                    uiHook
                }
            }
        }
    }
`;


export const SPACE_GET_CAN_VIEW_INTEGRATIONS = gql`
    query getCanViewIntegrations($spaceId: ID!, $permissions: [String]) {
        space(spaceId: $spaceId) {
            integrationInfos(isInstalled: true, isActivated: true, permissions: $permissions) {
                integration {
                    id
                    name
                    logo
                    uiHook
                }
            }
        }
    }
`;


export const SPACE_GET_PAGE = gql`
    query spaceGetPage($spaceId: ID!, $integrationId: ID!, $pageId: ID) {
        space(spaceId: $spaceId) {
            page(integrationId: $integrationId, pageId: $pageId) {
                statusCode
                content
            }
        }
    }
`;

// Mutations ========================================================================
export const SPACE_CREATE_NEW = gql`
    mutation spaceCreateNew($name: String!, $slug: String!, $icon: String) {
        spaceCreateNew(input: { name: $name, slug: $slug, icon: $icon }) {
            space {
                id
                name
                slug
                iconUrl: icon
            }
        }
    }
`;

export const SPACE_UNINSTALL_INTEGRATION = gql`
    mutation uninstallIntegration($spaceId: ID!, $integrationId: ID!) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                uninstall {
                    success
                }
            }
        }
    }
`;

export const SPACE_ACTIVATE_INTEGRATION = gql`
    mutation activateIntegration($spaceId: ID!, $integrationId: ID!) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                activate {
                    success
                }
            }
        }
    }
`;

export const SPACE_DEACTIVATE_INTEGRATION = gql`
    mutation deactivateIntegration($spaceId: ID!, $integrationId: ID!) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                deactivate {
                    success
                }
            }
        }
    }
`;

export const SPACE_SET_HOMEPAGE_INTEGRATION = gql`
    mutation setHomepageIntegration($spaceId: ID!, $integrationId: ID!) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                setHomepage {
                    success
                }
            }
        }
    }
`;

export const SPACE_REMOVE_HOMEPAGE_INTEGRATION = gql`
    mutation setHomepageIntegration($spaceId: ID!, $integrationId: ID!) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                removeHomepage {
                    success
                }
            }
        }
    }
`;

export const SPACE_DELETE = gql`
    mutation deleteSpace($spaceId: ID!) {
        space(spaceId: $spaceId) {
            delete {
                success
            }
        }
    }
`;

export const JOIN_SPACE = gql`
    mutation joinSpace($spaceId: ID!) {
        space(spaceId: $spaceId) {
            join {
                space {
                    id
                    name
                    icon
                    slug
                    membership {
                        role
                        chatInfo {
                            userId
                            accessToken
                        }
                    }
                }
            }
        }
    }
`;
export type JoinSpacePayloadType = ApolloQueryResult<{
    space: {
        join: {
            space: Space;
        };
    };
}>;

export const SPACE_LEAVE = gql`
    mutation leaveSpace($spaceId: ID!) {
        space(spaceId: $spaceId) {
            leave {
                success
            }
        }
    }
`;

export const SPACE_INSTALL_INTEGRATION = gql`
    mutation installIntegration($spaceId: ID!, $integrationId: ID!) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                install {
                    success
                }
            }
        }
    }
`;

export const REMOVE_MEMBER = gql`
    mutation updateUserSpaceRole($spaceId: ID!, $userId: ID!) {
        space(spaceId: $spaceId) {
            removeMember(input: { userId: $userId }) {
                success
            }
        }
    }
`;

export const SPACE_INVITE = gql`
    mutation sendSpaceInvite($spaceId: ID!, $params: SpaceInviteMutationInput!) {
        space(spaceId: $spaceId) {
            invite(input: $params) {
                success
            }
        }
    }
`;

export const SPACE_INVITE_UPDATE = gql`
    mutation updateSpaceInvite($spaceId: ID!, $params: SpaceUpdateInviteMutationInput!) {
        space(spaceId: $spaceId) {
            updateInvite(input: $params) {
                invite {
                    email
                    role
                    message
                    groupIds
                }
            }
        }
    }
`;

export const SPACE_CANCEL_INVITE = gql`
    mutation cancelSpaceInvite($spaceId: ID!, $params: SpaceCancelInviteMutationInput!) {
        space(spaceId: $spaceId) {
            cancelInvite(input: $params) {
                success
            }
        }
    }
`;

export const SPACE_RESEND_INVITE = gql`
    mutation resendSpaceInvite($spaceId: ID!, $params: SpaceResendInviteMutationInput!) {
        space(spaceId: $spaceId) {
            resendInvite(input: $params) {
                success
            }
        }
    }
`;


export const UPDATE_ROLE = gql`
    mutation updateUserSpaceRole($spaceId: ID!, $roleUpdateParams: SpaceUpdateMemberRoleMutationInput!) {
        space(spaceId: $spaceId) {
            updateMemberRole(input: $roleUpdateParams) {
                membership {
                    role
                }
            }
        }
    }
`;

export const SPACE_UPDATE = gql`
    mutation spaceUpdate($id: ID!, $name: String!, $slug: String!, $iconUrl: String) {
        space(spaceId: $id) {
            update(input: { name: $name, slug: $slug, icon: $iconUrl }) {
                space {
                    id
                    name
                    slug
                    iconUrl: icon
                }
            }
        }
    }
`;

export const SPACE_GRANT_INSTALLATION_PERMISSIONS = gql`
    mutation spaceGrantInstallationPermissions(
        $spaceId: ID!
        $integrationId: ID!
        $userIds: [UUID]
        $groupIds: [UUID]
        $permissions: [String!]!
    ) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                grantPermissions(input: { userIds: $userIds, groupIds: $groupIds, permissions: $permissions }) {
                    success
                }
            }
        }
    }
`;

export const SPACE_UPDATE_INSTALLATION_PERMISSIONS = gql`
    mutation spaceUpdateInstallationPermissions(
        $spaceId: ID!
        $integrationId: ID!
        $userId: String
        $groupId: String
        $permissions: [String!]!
    ) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                updatePermissions(input: { userId: $userId, groupId: $groupId, permissions: $permissions }) {
                    success
                }
            }
        }
    }
`;

export const SPACE_REVOKE_INSTALLATION_ACCESS = gql`
    mutation spaceRevokeInstallationAccess($spaceId: ID!, $integrationId: ID!, $userId: String, $groupId: String) {
        space(spaceId: $spaceId) {
            integration(id: $integrationId) {
                revokeAccess(input: { userId: $userId, groupId: $groupId }) {
                    success
                }
            }
        }
    }
`;
