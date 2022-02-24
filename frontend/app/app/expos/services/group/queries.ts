import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';

export const LIST_GROUPS = gql`
    query getGroups($spaceId: ID!) {
        space(spaceId: $spaceId) {
            groups {
                id
                name
                memberCount
            }
        }
    }
`;
export type LIST_GROUP_TYPE = ApolloQueryResult<{
    space: {
        groups: [NSGroupService.GroupWithMemberCount];
    };
}>;

export const GET_MEMBERS = gql`
    query getGroups($spaceId: ID!, $groupId: ID!) {
        space(spaceId: $spaceId) {
            group(groupId: $groupId) {
                members {
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
export type GET_MEMBERS_TYPE = ApolloQueryResult<{
    space: {
        group: {
            members: User[];
        };
    };
}>;

export const ADD_GROUP = gql`
    mutation createGroup($spaceId: ID!, $name: String!) {
        space(spaceId: $spaceId) {
            createGroup(input: { name: $name }) {
                group {
                    id
                    name
                }
            }
        }
    }
`;
export type ADD_GROUP_TYPE = ApolloQueryResult<{
    space: {
        createGroup: {
            group: Group;
        };
    };
}>;

export const ADD_MEMBERS = gql`
    mutation addMembers($spaceId: ID!, $groupId: ID!, $userIds: [ID]!) {
        space(spaceId: $spaceId) {
            group(groupId: $groupId) {
                addMembers(userIds: $userIds) {
                    success
                    members {
                        id
                        givenName: firstName
                        familyName: lastName
                        email
                        avatarUrl: avatar
                    }
                }
            }
        }
    }
`;
export type ADD_MEMBERS_TYPE = ApolloQueryResult<{
    space: {
        group: {
            addMembers: {
                success: boolean;
                members: User[];
            };
        };
    };
}>;

export const UPDATE_GROUP = gql`
    mutation updateGroup($spaceId: ID!, $groupId: ID!, $newName: String!) {
        space(spaceId: $spaceId) {
            group(groupId: $groupId) {
                update(input: { name: $newName }) {
                    group {
                        id
                        name
                    }
                }
            }
        }
    }
`;
export type UPDATE_GROUP_TYPE = ApolloQueryResult<{
    space: {
        group: {
            update: {
                group: Group;
            };
        };
    };
}>;

export const DELETE_GROUP = gql`
    mutation deleteGroup($spaceId: ID!, $groupId: ID!) {
        space(spaceId: $spaceId) {
            group(groupId: $groupId) {
                delete {
                    success
                }
            }
        }
    }
`;
export type DELETE_GROUP_TYPE = ApolloQueryResult<{
    space: {
        group: {
            update: {
                delete: {
                    success: boolean;
                };
            };
        };
    };
}>;

export const GET_MEMBERS_WITH_NON_MEMBERS = gql`
    query getGroups($spaceId: ID!, $groupId: ID!) {
        space(spaceId: $spaceId) {
            group(groupId: $groupId) {
                members {
                    id
                    givenName: firstName
                    familyName: lastName
                    email
                    avatarUrl: avatar
                }
            }
            members {
                member {
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
export type GET_MEMBERS_WITH_NON_MEMBERS_TYPE = ApolloQueryResult<{
    space: {
        group: {
            members: User[];
        };
        members: User[];
    };
}>;

export const REMOVE_MEMBERS = gql`
    mutation removeMembers($spaceId: ID!, $groupId: ID!, $memberIds: [ID]!) {
        space(spaceId: $spaceId) {
            group(groupId: $groupId) {
                removeMembers(userIds: $memberIds) {
                    success
                    members {
                        id
                        givenName: firstName
                        familyName: lastName
                        email
                        avatarUrl: avatar
                    }
                }
            }
        }
    }
`;
export type REMOVE_MEMBERS_TYPE = ApolloQueryResult<{
    space: {
        group: {
            removeMembers: {
                success: boolean;
                members: User[];
            };
        };
    };
}>;
