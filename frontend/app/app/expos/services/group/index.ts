import { EventEmitter } from 'events';
import graphqlService from '../graphql';
import {
    ADD_GROUP,
    ADD_GROUP_TYPE,
    LIST_GROUPS,
    LIST_GROUP_TYPE,
    GET_MEMBERS,
    GET_MEMBERS_TYPE,
    ADD_MEMBERS,
    ADD_MEMBERS_TYPE,
    UPDATE_GROUP,
    UPDATE_GROUP_TYPE,
    DELETE_GROUP,
    GET_MEMBERS_WITH_NON_MEMBERS,
    GET_MEMBERS_WITH_NON_MEMBERS_TYPE,
    REMOVE_MEMBERS,
    REMOVE_MEMBERS_TYPE,
} from './queries';
import merge from 'lodash/merge';

export type GroupChangeEventPayload = {
    type: string;
    value?: Group;
};

export const GROUP_UPDATED_EVENT = 'GROUP_UPDATED_EVENT';
export const GROUP_ADDED_EVENT = 'GROUP_ADDED_EVENT';
export const GROUP_REMOVED_EVENT = 'GROUP_REMOVED_EVENT';
export const GROUP_MEMBERS_UPDATED_EVENT = 'GROUP_MEMBERS_UPDATED_EVENT';

export class GroupService extends EventEmitter implements NSGroupService.IGroupService {
    async getGroups(space: Space, forceRefresh: boolean = false): Promise<Array<NSGroupService.GroupWithMemberCount>> {
        const result = (await graphqlService.query(
            merge(
                {
                    query: LIST_GROUPS,
                    variables: {
                        spaceId: space.id,
                    },
                },
                forceRefresh
                    ? {
                          fetchPolicy: 'no-cache',
                      }
                    : {}
            )
        )) as LIST_GROUP_TYPE;

        return result.data.space.groups;
    }

    async addGroup(space: Space, name: string): Promise<Group> {
        const result = (await graphqlService.mutate({
            mutation: ADD_GROUP,
            variables: {
                spaceId: space.id,
                name: name,
            },
        })) as ADD_GROUP_TYPE;
        const group = result.data.space.createGroup.group;
        this.emit(GROUP_ADDED_EVENT, group);
        return group;
    }

    async getMembers(space: Space, group: Group): Promise<User[]> {
        const result = (await graphqlService.query({
            query: GET_MEMBERS,
            variables: {
                spaceId: space.id,
                groupId: group.id,
            },
            fetchPolicy: 'no-cache',
        })) as GET_MEMBERS_TYPE;

        return result.data.space.group.members;
    }

    async addMembers(space: Space, group: Group, users: User[]): Promise<User[]> {
        const result = (await graphqlService.mutate({
            mutation: ADD_MEMBERS,
            variables: {
                spaceId: space.id,
                groupId: group.id,
                userIds: users.map(x => x.id),
            },
        })) as ADD_MEMBERS_TYPE;
        const members = result.data.space.group.addMembers.members;
        this.emit(GROUP_MEMBERS_UPDATED_EVENT, group, members);
        return members;
    }

    async renameGroup(space: Space, group: Group, newName: string) {
        const result = (await graphqlService.mutate({
            mutation: UPDATE_GROUP,
            variables: {
                spaceId: space.id,
                groupId: group.id,
                newName: newName,
            },
        })) as UPDATE_GROUP_TYPE;
        const updatedGroup = result.data.space.group.update.group;
        this.emit(GROUP_UPDATED_EVENT, updatedGroup);
        return result.data.space.group.update.group;
    }

    async removeGroup(space: Space, group: Group) {
        await graphqlService.mutate({
            mutation: DELETE_GROUP,
            variables: {
                spaceId: space.id,
                groupId: group.id,
            },
        });
        this.emit(GROUP_REMOVED_EVENT, group);
    }

    async getSpaceAndGroupMembers(space: Space, group: Group): Promise<NSGroupService.SpaceAndGroupMembers> {
        const result = (await graphqlService.query({
            query: GET_MEMBERS_WITH_NON_MEMBERS,
            variables: {
                spaceId: space.id,
                groupId: group.id,
            },
            fetchPolicy: 'no-cache',
        })) as GET_MEMBERS_WITH_NON_MEMBERS_TYPE;

        return {
            groupMembers: result.data.space.group.members,
            spaceMembers: result.data.space.members,
        };
    }

    async removeMembers(space: Space, group: Group, users: User[]): Promise<User[]> {
        const result = (await graphqlService.mutate({
            mutation: REMOVE_MEMBERS,
            variables: {
                spaceId: space.id,
                groupId: group.id,
                memberIds: users.map(x => x.id),
            },
        })) as REMOVE_MEMBERS_TYPE;

        const updatedMembers = result.data.space.group.removeMembers.members;
        this.emit(GROUP_MEMBERS_UPDATED_EVENT, group, updatedMembers);
        return updatedMembers;
    }
}

const groupService = new GroupService();
export default groupService;
