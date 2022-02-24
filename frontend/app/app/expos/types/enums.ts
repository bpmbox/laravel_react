/**
 * Defining enums
 *
 * Dev note: they are defined here because they cannot be automatically inferred like
 * interface types.  These need to be imported.
 */
import i18n from '../i18n';

/**
 * Message types.
 */
export enum MessageType {
    SUCCESS,
    ERROR,
    MESSAGE,
    WARNING,
}

/**
 * User Purpose
 */
export enum UserPurpose {
    PERSONAL = 'personal',
    COMPANY = 'company',
    BUILDING = 'building',
    COMMUNITY = 'community',
    SOMETHING_ELSE = 'something_else',
}

/**
 * Role types.
 */
export enum Role {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
    GUEST = 'guest',
    INTEGRATION = 'integration',
}

export const getUserRoles = (): Array<Role> => {
    return Object.values(Role).filter(role => role !== Role.INTEGRATION);
};

/**
 * Converts a string to a role.
 * @param input
 */
export function roleFromString(input: string) {
    switch (input.toLowerCase()) {
        case 'owner':
            return Role.OWNER;
        case 'admin':
            return Role.ADMIN;
        case 'member':
            return Role.MEMBER;
        case 'guest':
            return Role.GUEST;
        case 'integration':
            return Role.INTEGRATION;
        default:
            throw new Error('Invalid Role type');
    }
}

export function roleToString(role: Role) {
    switch (role) {
        case Role.ADMIN:
            return 'Admin';
        case Role.MEMBER:
            return 'Member';
        case Role.OWNER:
            return 'Owner';
        case Role.GUEST:
            return 'Guest';
        case Role.INTEGRATION:
            return 'Integration';

        // not reachable
        // istanbul ignore next
        default:
            throw new Error('Invalid Role type');
    }
}

export function isAtLeastAdmin(role: Role | null): boolean {
    return role === Role.ADMIN || role === Role.OWNER;

    // null is considered no access.
}

export function isAtLeastMember(role: Role | null): boolean {
    return role === Role.MEMBER || role === Role.ADMIN || role === Role.OWNER;
}

export function roleDescription(role: Role): string {
    switch (role) {
        case Role.GUEST:
            return i18n.t('Can access allowed Integrations but cannot initiate chats with Members.');
        case Role.MEMBER:
            return i18n.t('Can access allowed Integrations and can initiate chats with Members and Guests.');
        case Role.ADMIN:
            return i18n.t(
                'In addition to Member permissions, can change space settings and invite Members and Guests.'
            );
        case Role.OWNER:
            return i18n.t(
                'In addition to Admin permissions, can invite other Admins and Owners, and delete the Space.'
            );
        case Role.INTEGRATION:
            return i18n.t('Used for Integrations accounts.');
    }
}

/**
 * Chat
 */
export enum ConversationType {
    ONE2ONE = 'one2one',
    GROUPCHAT = 'groupchat',
}

export function conversationTypeFromString(input: string) {
    switch (input.toLowerCase()) {
        case 'one2one':
            return ConversationType.ONE2ONE;
        case 'groupchat':
            return ConversationType.GROUPCHAT;
        default:
            throw new Error('Invalid Role type');
    }
}
