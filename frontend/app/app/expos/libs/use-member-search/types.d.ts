declare namespace NSUseMemberSearch {

    type UseMemberSearchOptions = {
        /**
         * Space service for dependency injection
         */
        spaceService?: SpaceServiceTypes.ISpacesService;
        
        /**
         * Dependency inject members.
         */
        members?: User[];
    };

    interface MemberSearchEntry extends Membership {        
        fullName: string;
    }
}