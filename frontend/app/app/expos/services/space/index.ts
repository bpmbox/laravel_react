// TODO: Move integrations related code to integration service.
// TODO: Move group management code to group service.

import { ApolloQueryResult } from 'apollo-client';
import { EventEmitter } from 'events';
import defaultTo from 'lodash/defaultTo';
import find from 'lodash/find';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import get from 'lodash/get';
import { MANDATORY_PERMISSION } from '../../libs/integrations';
import { Role, roleFromString, isAtLeastAdmin } from '../../types/enums';
import graphqlService from '../graphql';
import groupService from '../group';
import { INTEGRATION_UPDATED_EVENT } from '../integration';
//import chatService from '../../services/chat';
import {
    GetInfoQueryResult,
    SpaceGetInvitationsQueryType,
    JOIN_SPACE,
    REMOVE_MEMBER,
    SpaceGetInvitesQueryType,
    SpaceGetMembersResult,
    SPACE_ACTIVATE_INTEGRATION,
    SPACE_CHECK_NAME_EXISTS,
    SPACE_CHECK_SLUG_EXISTS,
    SPACE_CREATE_NEW,
    SPACE_DEACTIVATE_INTEGRATION,
    SPACE_DELETE,
    SPACE_GET_INFO_BY_ID,
    SPACE_GET_INFO_BY_SLUG,
    SPACE_GET_INSTALLED_INTEGRATIONS,
    SPACE_GET_INVITES,
    SPACE_GET_LIST,
    SPACE_GET_MEMBERS,
    SPACE_GET_PAGE,
    SPACE_GRANT_INSTALLATION_PERMISSIONS,
    SPACE_GROUPS,
    SPACE_INSTALLATION_INFO,
    SPACE_INSTALL_INTEGRATION,
    SPACE_INTEGRATION_INFOS,
    SPACE_INVITE,
    SPACE_LEAVE,
    SPACE_REMOVE_HOMEPAGE_INTEGRATION,
    SPACE_REVOKE_INSTALLATION_ACCESS,
    SPACE_SET_HOMEPAGE_INTEGRATION,
    SPACE_UNINSTALL_INTEGRATION,
    SPACE_UPDATE,
    SPACE_UPDATE_INSTALLATION_PERMISSIONS,
    UPDATE_ROLE,
    SPACE_GET_INVITATIONS,
    SPACE_CANCEL_INVITE,
    SPACE_GET_CAN_VIEW_INTEGRATIONS,
    SPACE_INVITE_UPDATE,
    SPACE_RESEND_INVITE,
} from './queries';

/**
 * Event emitted when an operation is performed that could possibly alter spaces.
 *
 * Payload: null
 */
export const SPACES_UPDATED_EVENT = 'SPACES_UPDATED_EVENT';

/**
 * This event is fired when a Role is updated for user in a given space.
 *
 * Payload {
 *      user - user affected,
 *      role - this user's new role
 * }
 */
export const SPACES_USER_ROLE_UPDATED_EVENT = 'SPACES_USER_ROLE_UPDATED_EVENT';
export type SpacesRoleUpdatedEventPayload = {
    space: Space;
    user: User;
    role: Role;
};

/**
 * Emitted when a new invitation is sent.
 *
 * Payload: null
 */
export const SPACES_NEW_INVITATION_SENT_EVENT = 'SPACES_NEW_INVITATION_SENT_EVENT';
export const SPACES_INVITATION_CANCELED_EVENT = 'SPACES_NEW_INVITATION_CANCELED_EVENT';
export const SPACES_INVITATION_UPDATED_EVENT = 'SPACES_INVITATION_UPDATED_EVENT';

/**
 * Service class for interacting with the spaces API.
 */
export class SpaceService extends EventEmitter implements SpaceServiceTypes.ISpacesService {
    async getSpaces(): Promise<Space[]> {
        const result = await graphqlService.query({
            query: SPACE_GET_LIST,
            fetchPolicy: 'no-cache',
        });
        return result.data.currentUser.spaces.map((x: Space) => new SerializableSpace(x));
    }

    async getInvitedSpaces(): Promise<Space[]> {
        const result = (await graphqlService.query({
            query: SPACE_GET_INVITES,
            fetchPolicy: 'no-cache',
        })) as ApolloQueryResult<SpaceGetInvitesQueryType>;

        return result.data.currentUser.invites.map(x => x.space).map(x => new SerializableSpace(x));
    }

    async createSpace(name: string, slug?: string | null, icon?: string | null): Promise<Space> {
        const result = (await graphqlService.mutate({
            mutation: SPACE_CREATE_NEW,
            variables: {
                name,
                slug,
                icon,
            },            
        })) as ApolloQueryResult<{ spaceCreateNew: { space: Space } }>;

        // TODO: refactor this to more specific event, e.g. SPACE_EVENT.CREATED
        const space = new SerializableSpace(result.data.spaceCreateNew.space);
        this.emit(SPACES_UPDATED_EVENT, { createdSpace: space });
        return space;
    }

    async checkNameNotTaken(name: string): Promise<boolean> {
        const result = (await graphqlService.query({
            query: SPACE_CHECK_NAME_EXISTS,
            variables: {
                name,
            },
        })) as ApolloQueryResult<{ spaceCheckNameExists: boolean }>;
        return !result.data.spaceCheckNameExists;
    }

    async checkSlugNotTaken(slug: string): Promise<boolean> {
        const result = (await graphqlService.query({
            query: SPACE_CHECK_SLUG_EXISTS,
            variables: {
                slug,
            },
        })) as ApolloQueryResult<{ spaceCheckSlugExists: boolean }>;
        return !result.data.spaceCheckSlugExists;
    }

    async updateSpace(space: Space): Promise<Space> {
        const result = (await graphqlService.mutate({
            mutation: SPACE_UPDATE,
            variables: {
                ...space,
            },
        })) as ApolloQueryResult<{ space: { update: { space: Space } } }>;
        this.emit(SPACES_UPDATED_EVENT);
        return new SerializableSpace(result.data.space.update.space);
    }

    /**
     * Gets basic unauthenticated info for a space.
     *
     * If null is returned, that means space not found.
     * @param slug
     * @returns Space if exists, if not exist returns null.
     */
    async getInfoBySlug(slug: string): Promise<SpaceServiceTypes.SpaceInfo | null> {
        const result = (await graphqlService.query(
            {
                query: SPACE_GET_INFO_BY_SLUG,
                variables: {
                    slug,
                },
                // We want to return data that's available if error occurrs.
                // This can happen if the user does not have access to certain
                // pieces of this space such as roles and members.
                errorPolicy: 'all',
                fetchPolicy: 'no-cache',
            },
            false
        )) as ApolloQueryResult<GetInfoQueryResult>;

        const space = get(result, 'data.space.space', null);
        const role = get(result, 'data.space.spaceMembership.membership.role', null);
        const chat = get(result, 'data.space.spaceMembership.membership.chatInfo', null);
        const invited = get(result, 'data.space.wasInvited', false);

        if (!space) {
            return null;
        } else {
            return {
                space: new SerializableSpace(space),
                // Note: expected that either role or invited will be defined, but never both at the same time.
                role: role && roleFromString(role),
                invited,
                chat,
            };
        }
    }

    /**
     * Gets basic unauthenticated info for a space.
     *
     * If null is returned, that means space not found.
     * @param slug
     * @returns Space if exists, if not exist returns null.
     */
    async getInfoById(id: string): Promise<SpaceServiceTypes.SpaceInfo | null> {
        const result = (await graphqlService.query(
            {
                query: SPACE_GET_INFO_BY_ID,
                variables: {
                    spaceId: id,
                },
                errorPolicy: 'all',
                fetchPolicy: 'no-cache',
            },
            false
        )) as ApolloQueryResult<GetInfoQueryResult>;
        const space = get(result, 'data.space.space', null);
        const role = get(result, 'data.space.spaceMembership.membership.role', null);
        const chat = get(result, 'data.space.spaceMembership.membership.chatInfo', null);
        const invited = get(result, 'data.space.wasInvited', false);

        if (!space) {
            return null;
        } else {
            return {
                space: new SerializableSpace(space),
                // Note: expected that either role or invited will be defined, but never both at the same time.
                role: role && roleFromString(role),
                invited,
                chat,
            };
        }
    }

    /**
     * Gets a single member for a given space.
     */
    async getMemberById(space: Space, membershipId: string): Promise<SpaceServiceTypes.MembershipWithChat> {
        const queryResult = await this.getMembers(space, [membershipId]);
        if (queryResult && queryResult.length > 0) {
            return queryResult[0];
        } else {
            return null;
        }
    }

    /**
     * Gets a list of members for a given space.
     * @param space
     */
    async getMembers(space: Space, membershipIds?: string[]): Promise<SpaceServiceTypes.MembershipWithChat[]> {
        const result = (await graphqlService.query(
            {
                query: SPACE_GET_MEMBERS,
                variables: {
                    spaceId: space.id,
                    membershipIds,
                },
                fetchPolicy: 'no-cache',
            },
            false
        )) as ApolloQueryResult<SpaceGetMembersResult>;

        // Because roles get transferred as a scalar ('string'), we need to convert it into Role enum
        return result.data.space.members.map(x => ({
            member: new SerializableUser(x.member),
            role: roleFromString(x.role),
            chat: x.chat,
        }));
    }

    async getInvitations(space: any): Promise<Invitation[]> {
        const result = (await graphqlService.query(
            {
                query: SPACE_GET_INVITATIONS,
                variables: {
                    spaceId: space.id,
                },
                fetchPolicy: 'no-cache',
            },
            false
        )) as ApolloQueryResult<SpaceGetInvitationsQueryType>;

        return result.data.space.invites.map(x => ({
            email: x.email,
            role: roleFromString(x.role),
            user: x.user ? new SerializableUser(x.user) : null,
            groupIds: x.groupIds,
            message: x.message,
        }));
    }

    /**
     * Check whether a user is sole Owner
     * @param user
     * @param space
     */
    async isSoleOwner(user: User, space: Space): Promise<boolean> {
        const members = await this.getMembers(space);
        const owners = members.filter(member => member.role === Role.OWNER);
        return owners.length === 1 && owners[0].member.id === user.id;
    }

    /**
     * Get the role of a User in a Space.  Null role signifies this user
     * does not have access.
     * @param user
     * @param space
     */
    async getRole(user: User, space: Space): Promise<Role | null> {
        const members = await this.getMembers(space);
        const matchingMember = members.find(x => x.member.id === user.id);
        return matchingMember && matchingMember.role;
    }

    /**
     * Gets a list of groups for the associated space.
     * @param space
     */
    async getGroups(space: Space, forceRefresh: boolean = false): Promise<Group[]> {
        const result = (await graphqlService.query(
            merge(
                {
                    query: SPACE_GROUPS,
                    variables: {
                        spaceId: space.id,
                    },
                },
                forceRefresh
                    ? {
                          fetchPolicy: 'no-cache',
                      }
                    : {}
            ),
            false
        )) as ApolloQueryResult<{ space: { groups: Group[] } }>;
        return result.data.space.groups;
    }

    async getGroupsForUser(space: Space, user: User): Promise<Group[]> {
        const groups = await this.getGroups(space, true);
        return Promise.all(
            groups.filter(async group => {
                const members = (await groupService.getMembers(space, group)).map(m => new SerializableUser(m));
                return defaultTo(
                    find(members, m => m.id === user.id),
                    false
                );
            })
        );
    }

    async sendInvitation(space: Space, inviteParams: SpaceServiceTypes.SpaceInvitationParams) {
        await graphqlService.mutate({
            mutation: SPACE_INVITE,
            variables: {
                spaceId: space.id,
                params: {
                    email: inviteParams.email,
                    role: inviteParams.role,
                    message: inviteParams.customMessage,
                    groupIds: inviteParams.groups.map((g: Group) => g.id),
                },
            },
        });
        this.emit(SPACES_NEW_INVITATION_SENT_EVENT);
    }

    async updateInvitation(space: Space, updateInviteParams: SpaceServiceTypes.SpaceUpdateInvitationParams) {
        const mutationParams: object = pick(updateInviteParams, 'email', 'role', 'message');
        if(updateInviteParams.groups) {
            mutationParams['groupIds'] = updateInviteParams.groups.map(g => g.id);
        }

        await graphqlService.mutate({
            mutation: SPACE_INVITE_UPDATE,
            variables: {
                spaceId: space.id,
                params: mutationParams,
            },
        });
        this.emit(SPACES_INVITATION_UPDATED_EVENT);
    }

    async cancelInvitation(space: Space, email: string) {
        await graphqlService.mutate({
            mutation: SPACE_CANCEL_INVITE,
            variables: {
                spaceId: space.id,
                params: {
                    email: email,
                },
            },
        });        

        this.emit(SPACES_INVITATION_CANCELED_EVENT);
    }

    /**
     * Resend an existing space invite.
     * @param space space scope
     * @param email email of user to reinvite
     */
    async resendInvitation(space: Space, email: string) {
        await graphqlService.mutate({
            mutation: SPACE_RESEND_INVITE,
            variables: {
                spaceId: space.id,
                params: {
                    email: email,
                },
            },
        });
    }

    async updateRole(space: Space, user: User, role: Role) {
        await graphqlService.mutate({
            mutation: UPDATE_ROLE,
            variables: {
                spaceId: space.id,
                roleUpdateParams: {
                    email: user.email,
                    role: role,
                },
            },
        });

        this.emit(SPACES_UPDATED_EVENT);
        this.emit(SPACES_USER_ROLE_UPDATED_EVENT, {
            space,
            user,
            role,
        } as SpacesRoleUpdatedEventPayload);
    }

    async removeMember(space: Space, user: User) {
        await graphqlService.mutate({
            mutation: REMOVE_MEMBER,
            variables: {
                spaceId: space.id,
                userId: user.id,
            },
        });
        this.emit(SPACES_UPDATED_EVENT);
    }

    async deleteSpace(space: Space): Promise<boolean> {
        const result = (await graphqlService.mutate({
            mutation: SPACE_DELETE,
            variables: {
                spaceId: space.id,
            },
        })) as ApolloQueryResult<{ space: { delete: { success: boolean } } }>;

        // TODO: refactor this to more specific event, e.g. SPACE_EVENT.DELETED
        const isSuccess = result.data.space.delete.success;
        if (isSuccess) {
            this.emit(SPACES_UPDATED_EVENT, { deletedSpace: space });
        }
        return isSuccess;
    }

    /**
     * Joins a space that the user is already invited to.
     * @param space
     */
    async joinSpace(space: Space) {
        await graphqlService.mutate({
            mutation: JOIN_SPACE,
            variables: {
                spaceId: space.id,
            },
        });
        this.emit(SPACES_UPDATED_EVENT);
    }

    async getIntegrationInfos(
        space: Space,
        keyword?: string,
        category?: string,
        isInstalled?: boolean
    ): Promise<NSIntegration.IntegrationInfo[]> {
        const result = (await graphqlService.query({
            query: SPACE_INTEGRATION_INFOS,
            variables: {
                spaceId: space.id,
                keyword,
                category,
                isInstalled,
            },
            fetchPolicy: 'network-only',
        })) as ApolloQueryResult<{
            space: { integrationInfos: NSIntegration.IntegrationInfo[] };
        }>;
        return result.data.space.integrationInfos;
    }

    async getInstalledIntegrations(space: Space): Promise<NSIntegration.InstalledIntegration[]> {
        const result = (await graphqlService.query({
            query: SPACE_GET_INSTALLED_INTEGRATIONS,
            variables: {
                spaceId: space.id,
            },
            fetchPolicy: 'network-only',
        })) as ApolloQueryResult<{
            space: {
                integrationInfos: Array<{
                    integration: NSIntegration.InstalledIntegration;
                }>;
            };
        }>;
        return result.data.space.integrationInfos.map(info => info.integration);
    }

    async getInstalledIntegrationInfos(
        space: Space
    ): Promise<{ integration: NSIntegration.Integration; installationInfo: NSIntegration.InstallationInfo }[]> {
        const integrationInfos = await spaceService.getIntegrationInfos(space);
        const activeIntegrationInfos = integrationInfos.filter(info => info.isActive);
        return Promise.all(
            activeIntegrationInfos.map(async info => {
                const installationInfo = await this.getInstallationInfo(space, info.installationId);
                return {
                    integration: info.integration,
                    installationInfo: installationInfo,
                };
            })
        );
    }

    async getCanViewIntegrations(space: Space, user: User): Promise<NSIntegration.Integration[]> {
        const result = (await graphqlService.query({
            query: SPACE_GET_CAN_VIEW_INTEGRATIONS,
            variables: {
                spaceId: space.id,
                permissions: [MANDATORY_PERMISSION.codename]
            },
            fetchPolicy: 'network-only',
        })) as ApolloQueryResult<{
            space: {
                integrationInfos: Array<{
                    integration: NSIntegration.Integration;
                }>;
            };
        }>;

        return result.data.space.integrationInfos.map(info => info.integration);
    }

    /**
     * Returns the integrations for the given space that the given user can access.
     * If the user is an owner or admin, this will return all integrations for the given space.
     */
    async getAccessibleIntegrationInfos(
        space: Space,
        user: User,
        role: Role,
        keyword?: string,
        category?: string,
        isInstalled?: boolean
    ): Promise<NSIntegration.IntegrationInfo[]> {
        let integrationInfos = await spaceService.getIntegrationInfos(space, keyword, category, isInstalled);
        if (!isAtLeastAdmin(role || Role.GUEST)) {
            // filter integrations based on which ones this user can view
            const canViewIntegrations = (await this.getCanViewIntegrations(space, user)) || [];
            const canViewIDs = new Set(canViewIntegrations.map(integration => integration.id));
            integrationInfos = integrationInfos.filter(info => canViewIDs.has(info.integration.id));
        }
        return integrationInfos;
    }

    async getHomepageIntegration(space: Space): Promise<NSIntegration.Integration | null> {
        const integrationInfos = await spaceService.getIntegrationInfos(space, null, null, true);
        return get(
            find(integrationInfos, i => i.isHomepage),
            'integration',
            null
        );
    }

    async getInstallationInfo(space: Space, installationId: string): Promise<NSIntegration.InstallationInfo> {
        const result = (await graphqlService.query({
            query: SPACE_INSTALLATION_INFO,
            variables: {
                spaceId: space.id,
                installationId,
            },
            fetchPolicy: 'network-only',
        })) as ApolloQueryResult<{
            space: { installationInfo: NSIntegration.InstallationInfo };
        }>;
        return result.data.space.installationInfo;
    }

    async installIntegration(space: Space, integration: NSIntegration.Integration) {
        await graphqlService.mutate({
            mutation: SPACE_INSTALL_INTEGRATION,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async uninstallIntegration(space: Space, integration: NSIntegration.Integration) {
        await graphqlService.mutate({
            mutation: SPACE_UNINSTALL_INTEGRATION,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async activateIntegration(space: Space, integration: NSIntegration.Integration) {
        await graphqlService.mutate({
            mutation: SPACE_ACTIVATE_INTEGRATION,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async deactivateIntegration(space: Space, integration: NSIntegration.Integration) {
        await graphqlService.mutate({
            mutation: SPACE_DEACTIVATE_INTEGRATION,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async setHomepageIntegration(space: Space, integration: NSIntegration.Integration) {
        await graphqlService.mutate({
            mutation: SPACE_SET_HOMEPAGE_INTEGRATION,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async removeHomepageIntegration(space: Space, integration: NSIntegration.Integration) {
        await graphqlService.mutate({
            mutation: SPACE_REMOVE_HOMEPAGE_INTEGRATION,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async leaveSpace(space: Space): Promise<boolean> {
        const result = (await graphqlService.mutate({
            mutation: SPACE_LEAVE,
            variables: {
                spaceId: space.id,
            },            
        })) as ApolloQueryResult<{ space: { leave: { success: boolean } } }>;

        const isSuccess = result.data.space.leave.success;
        // TODO: refactor this to more specific event, e.g. SPACE_EVENT.LEFT
        if (isSuccess) {
            this.emit(SPACES_UPDATED_EVENT, { leftSpace: space });
        }
        return isSuccess;
    }

    async updateInstallationPermissions(
        space: Space,
        integration: NSIntegration.Integration,
        userId: string | null,
        groupId: string | null,
        permissions: string[]
    ) {
        await graphqlService.mutate({
            mutation: SPACE_UPDATE_INSTALLATION_PERMISSIONS,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
                userId,
                groupId,
                permissions,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async grantInstallationPermissions(
        space: Space,
        integration: NSIntegration.Integration,
        userIds: string[],
        groupIds: string[],
        permissions: string[]
    ) {
        await graphqlService.mutate({
            mutation: SPACE_GRANT_INSTALLATION_PERMISSIONS,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
                userIds,
                groupIds,
                permissions,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    async revokeInstallationAccess(
        space: Space,
        integration: NSIntegration.Integration,
        userId: string | null,
        groupId: string | null
    ) {
        await graphqlService.mutate({
            mutation: SPACE_REVOKE_INSTALLATION_ACCESS,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
                userId,
                groupId,
            },
        });
        this.emit(INTEGRATION_UPDATED_EVENT);
    }

    // TODO: this should be moved into integration service.
    async getPage(
        space: Space,
        integration: NSIntegration.Integration,
        pageId?: string
    ): Promise<SpaceServiceTypes.SpacePage> {
        // chatService.nativeOnlyRegisterAnalitics("service_space"+space.id+"_inid_"+integration.id+"_pageid_"+pageId);
        const result = (await graphqlService.query({
            query: SPACE_GET_PAGE,
            variables: {
                spaceId: space.id,
                integrationId: integration.id,
                pageId: pageId,
            },
            fetchPolicy: 'no-cache',
        }, false)) as ApolloQueryResult<{
            space: { page: { statusCode: number; content: string } };
        }>;

        const page: SpaceServiceTypes.SpacePage = {
            statusCode: result.data.space.page.statusCode,
            content: JSON.parse(result.data.space.page.content),
        };

        return page;
    }
}

/**
 * Create a SpaceInstance wrapper for our Space type
 * to provide serialize/deserialize methods related
 * to space.
 */
export class SerializableSpace implements Space {
    id: string;
    name: string;
    slug: string;
    iconUrl: string;

    // Used internally by this class to determine if this class is already an instance
    // of itself.
    __META_TYPE__: string;

    constructor(data: Space) {
        this.__META_TYPE__ = 'SerializableSpace';
        Object.assign(this, data);
    }

    toString(): string {
        return this.id as string;
    }

    /**
     * Converts a Space, SerializableSpace, or SpaceID into a SerializableSpace.
     */
    static async getInstance(spaceParam: Space | SerializableSpace | string): Promise<SerializableSpace> {
        if (typeof spaceParam === 'string') {
            const spaceInfo = await spaceService.getInfoById(spaceParam);
            return new SerializableSpace(spaceInfo.space);
        }

        // Check if it is already a SerializableSpace
        if ((spaceParam as any).__META_TYPE__ === 'SerializableSpace') {
            return spaceParam as SerializableSpace;
        }

        // treat it as a Space object.
        return new SerializableSpace(spaceParam);
    }
}

/**
 * Create a SpaceInstance wrapper for our Space type
 * to provide serialize/deserialize methods related
 * to space.
 */
export class SerializableUser implements User {
    id: string;
    givenName: string;
    familyName: string;
    avatarUrl: string;
    email: string;

    // Used internally by this class to determine if this class is already an instance
    // of itself.
    __META_TYPE__: string;

    constructor(data: User) {
        this.__META_TYPE__ = 'SerializableUser';
        Object.assign(this, data);
    }

    toString(): string {
        return this.id as string;
    }
}

const spaceService: SpaceServiceTypes.ISpacesService = new SpaceService();

export default spaceService;
