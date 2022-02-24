declare namespace AuthStoreTypes {
    type AuthStateType = {
        isAuthenticated: boolean;
        currentUser: User | null;
        isLoading?: boolean;
    };

    interface IAuthUserUpdate extends UserServiceTypes.IUserUpdateEventPayload {}
}
