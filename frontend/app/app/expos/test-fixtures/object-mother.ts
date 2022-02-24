/* istanbul ignore file */
import { ApolloError } from 'apollo-client';
import { ASTNode } from 'graphql';
import { DateTime } from 'luxon';
import { sign } from 'jsonwebtoken';
import { Role } from '../types/enums';

/**
 * Object Mother for frequently reused test data.
 */

export const simpleApolloError = new ApolloError({
    graphQLErrors: [
        {
            message: 'test error',
            locations: [{ line: 1, column: 10 }],
            path: ['Space', 'id'],
            nodes: [{} as ASTNode],
            source: undefined,
            positions: [5],
            originalError: null,
            name: 'SomethingWrongError',
            extensions: {
                code: '001-500-0011',
                time_thrown: DateTime.local().toISO(),
            },
        },
    ],
    networkError: null,
});

export const sampleUser: User = {
    id: 'abc123',
    givenName: 'Jon',
    familyName: 'Snow',
    email: 'j.snow@winterfell.com',
    avatarUrl:
        'https://vignette.wikia.nocookie.net/gameofthrones/images/d/d0/JonSnow8x06.PNG/revision/latest?cb=20190714094440',
};

export const sampleGroup: Group = {
    id: '1111111-1111-1111-111111111111',
    name: 'Sample group',
};

export const sampleSpace: Space = {
    id: '112233',
    name: 'Space One',
    slug: 'space-one',
    iconUrl: 'http://icons.iconarchive.com/icons/limav/game-of-thrones/512/Baratheon-icon.png',
};

export const sampleSpaceInfo: SpaceServiceTypes.SpaceInfo = {
    space: sampleSpace,
    role: Role.ADMIN,
    chat: {
        userId: '123',
        accessToken: 'abc',
    },
    invited: false,
};

export const sampleIntegration: NSIntegration.Integration = {
    id: '1111111-1111-1111-111111111111',
    name: 'Event',
    logo: 'https://s3.amazonaws.com/dev-uploads.withtree.com/tmp/test.jpg',
    shortDesc: 'This is event',
    fullDesc: 'This is full desc of event',
    category: 'fun',
    type: 'native',
    url: 'http://test.com',
    access: 'published',
    permissions: ['can_view', 'full_access'],
    restrictedSpaces: [],
};

export const sampleNewIntegration: NSIntegration.NewIntegrationParams = {
    name: 'Event',
    logo: 'https://s3.amazonaws.com/dev-uploads.withtree.com/tmp/test.jpg',
    shortDesc: 'This is event',
    fullDesc: 'This is full desc of event',
    category: 'fun',
    type: 'native',
    url: 'http://test.com',
    access: 'published',
    permissions: ['can_view', 'full_access'],
    restrictedSpaceSlugs: [],
};

export const sampleIntegrationInfo: NSIntegration.IntegrationInfo = {
    integration: sampleIntegration,
    isInstalled: true,
    isActive: true,
    installationId: '1111111-1111-1111-111111111111',
    isHomepage: false,
};

export const sampleAvailableIntegrationInfo: NSIntegration.IntegrationInfo = {
    integration: sampleIntegration,
    isInstalled: false,
    isActive: false,
    installationId: '',
    isHomepage: false,
};

export const sampleInstallationInfo: NSIntegration.InstallationInfo = {
    usersPermissions: [{ user: sampleUser, permissions: ['can_view'] }],
    groupsPermissions: [{ group: sampleGroup, permissions: ['can_view'] }],
};

export const sampleSpaces: Space[] = [
    {
        id: '112233',
        name: 'Space One',
        slug: 'space-one',
        iconUrl:
            'https://static.tumblr.com/8f24acdc4b08ac20a2de3b8378b28934/eomrklq/JFDncmaga/tumblr_static_3wev7wkhxa0440s4g04wcc840.png',
    },
    {
        id: '223344',
        name: 'Space Two',
        slug: 'space-two',
        iconUrl: 'http://icons.iconarchive.com/icons/limav/game-of-thrones/512/Baratheon-icon.png',
    },
];

export const sampleMembersWithChat: SpaceServiceTypes.MembershipWithChat[] = [
    {
        member: {
            id: 'abc123',
            givenName: 'Jon',
            familyName: 'Snow',
            email: 'j.snow@winterfell.com',
            avatarUrl:
                'https://vignette.wikia.nocookie.net/gameofthrones/images/d/d0/JonSnow8x06.PNG/revision/latest?cb=20190714094440',
        },
        role: Role.OWNER,
        chat: {
            userId: 'abc123',
            accessToken: 'SECRET',
        },
    },
    {
        member: {
            id: 'def456',
            givenName: 'Daenerys',
            familyName: 'Targarian',
            email: 'd.targarian@dragonriders.com',
            avatarUrl:
                'https://www.telegraph.co.uk/content/dam/fashion/2017/06/19/TELEMMGLPICT000131421802_trans_NvBQzQNjv4BqkUE_BTgBOQu3VWKvpDGX9fr7sARQy7EgBjwPUzvqL_M.jpeg?imwidth=450',
        },
        role: Role.ADMIN,
        chat: {
            userId: 'def456',
            accessToken: 'SECRET',
        },
    },
    {
        member: {
            id: 'ghi789',
            givenName: 'Tyrion',
            familyName: 'Lannister',
            email: 't.lannister@kingslanding.com',
            avatarUrl: 'https://static.toiimg.com/photo/62981209/.jpg',
        },
        role: Role.MEMBER,
        chat: {
            userId: 'ghi789',
            accessToken: 'SECRET',
        },
    },
    {
        member: {
            id: 'jkl101112',
            givenName: 'Grey',
            familyName: 'Worm',
            email: 'gworm@unsullied.com',
            avatarUrl: 'https://www.stickpng.com/assets/images/5cb83a4a32c4f52f2e5ea223.png',
        },
        role: Role.MEMBER,
        chat: {
            userId: 'jkl101112',
            accessToken: 'SECRET',
        },
    },
    {
        member: {
            id: 'mno131415',
            givenName: 'Arya',
            familyName: 'Stark',
            email: 'as@faceless.com',
            avatarUrl: 'https://pbs.twimg.com/profile_images/1117701700360581126/4p020QBx_400x400.jpg',
        },
        role: Role.MEMBER,
        chat: {
            userId: 'mno131415',
            accessToken: 'SECRET',
        },
    },
];

export const sampleGroups: Group[] = [
    { id: '1', name: 'Los Angeles' },
    { id: '2', name: 'Hanoi' },
    { id: '5', name: 'Paris' },
    { id: '6', name: 'Tokyo' },
    { id: '7', name: 'London' },
    { id: '8', name: 'New York' },
    { id: '9', name: 'Cairo' },
];

export const sampleAccessToken: string = sign(sampleUser, 'secret', {
    expiresIn: '1h',
});

export const sampleRefreshToken: string = sign(sampleUser, 'secret', {
    expiresIn: '4320h', // 6 months
});
