import { EventEmitter } from 'events';

declare namespace UserServiceTypes {
    interface NewUserParams {
        email: string;
        givenName: string;
        familyName: string;
        avatarUrl?: string;
        purpose: string;
    }

    interface IUserService extends EventEmitter {
        registerAccountUser: (NewUserParams) => Promise<User>;
        requestEmailChangeCode: (string) => Promise<boolean>;
        getAccount: () => Promise<User>;
        updateAccountUser: (updateParams: UserServiceTypes.IUpdateUserParams) => Promise<User>;
        deactivateAccount: () => Promise<void>;
    }

    interface IUserServiceDependencies {
        graphqlService: IGraphqlService;
    }

    interface IUpdateUserParams {
        givenName: string;
        familyName: string;
        avatarUrl: string | null | undefined;
    }

    interface IRegisterUserParams extends IUpdateUserParams {
        purpose: string;
    }

    interface IUserUpdateEventPayload {
        givenName?: string;
        familyName?: string;
        avatarUrl?: string;
    }
}
