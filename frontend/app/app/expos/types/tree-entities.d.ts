/**
 * User entity basic info.
 */
interface User {
    id: string;
    givenName: string;
    familyName: string;
    email: string;
    avatarUrl?: string | null;
}

/**
 * User groups within a Space
 */
interface Group {
    id: string;
    name: string;
}

interface Invitation {
    email: string;
    role: Role;

    // optional params
    groupIds?: string[];
    message?: string;

    // User is only available when a invited user has previously already
    // onboarded, other wise it will be undefined or null
    user?: User;
}

/**
 * Space entity basic info.
 */
interface Space {
    id: string;
    name: string;
    slug: string;
    iconUrl?: string | null;
}

interface Membership {
    member: User;
    role: Role;
}

// TODO: this should be split into MyChat info, and MemberChat info.
interface ChatInfo {
    userId: string;
    accessToken?: string;
}

type DjFieldError = {
    message: string;
    code: string;
};

type UploadUrlData = {
    uploadUrl: string;
    postParams: any;
    destUrl: string;
    curl: string;
};
