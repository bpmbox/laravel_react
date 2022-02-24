declare namespace NSGroupService {
    type GroupWithMemberCount = Group & {
        memberCount: number;
    };

    type SpaceAndGroupMembers = {
        groupMembers: User[];
        spaceMembers: User[];
    };

    interface IGroupService extends EventEmitter {
        getGroups: (space: Space, forceRefresh: boolean) => Promise<Array<GroupWithMemberCount>>;
        addGroup: (space: Space, name: string) => Promise<Group>;

        /**
         * Get all members of a given group.
         */
        getMembers: (space: Space, group: Group) => Promise<User[]>;

        /**
         * Add members to a given group.
         * Returns updated list of users in the group.
         */
        addMembers: (space: Space, group: Group, users: User[]) => Promise<User[]>;

        /**
         * Remove members.
         * Returns a list of members removed.  If member was already removed, would not be returned.
         */
        removeMembers: (space: Space, group: Group, users: User[]) => Promise<User[]>;

        /**
         * Updates name of a Group.
         */
        renameGroup: (space: Space, group: Group, newName: string) => Promise<Group>;

        /**
         * Removes a group.
         */
        removeGroup: (space: Space, group: Group) => Promise<void>;

        /**
         * Fetches both group members and space members.
         */
        getSpaceAndGroupMembers: (space: Space, group: Group) => Promise<SpaceAndGroupMembers>;
    }
}
