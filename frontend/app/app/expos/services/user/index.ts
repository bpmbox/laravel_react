import { ApolloQueryResult } from 'apollo-client';
import { EventEmitter } from 'events';
import { toGraphqlError } from '../../libs/convert-graphql-error';
import graphqlService from '../graphql';
import {
    REGISTER_USER,
    UPDATE_USER,
    REQUEST_EMAIL_CHANGE_CODE,
    USER_DEACTIVATE_ACCOUNT,
    USER_GET_INFO,
} from './queries';
import { UserServiceTypes } from './types';
import authService from '../auth';
import gql from "graphql-tag";

export const USER_UPDATED_EVENT = 'USER_UPDATED_EVENT';

/**
 * Implementation for UserService.
 */
export class UserService extends EventEmitter implements UserServiceTypes.IUserService {
    /**
     * User registration.
     * @param newUserParams
     */
    async registerAccountUser(newUserParams: UserServiceTypes.IRegisterUserParams): Promise<User> {
        try {
            const result = (await graphqlService.mutate({
                mutation: REGISTER_USER,
                variables: {
                    givenName: newUserParams.givenName,
                    familyName: newUserParams.familyName,
                    purpose: newUserParams.purpose,
                    avatarUrl: newUserParams.avatarUrl,
                },
            })) as ApolloQueryResult<{ currentUser: { updateProfile: { user: User } } }>;
            const user = result.data.currentUser.updateProfile.user;
            this.emit(USER_UPDATED_EVENT, user);
            return user;
        } catch (err) {
            throw toGraphqlError(err);
        }
    }

    async updateAccountUser(updateParams: UserServiceTypes.IUpdateUserParams): Promise<User> {
        try {
            const result = (await graphqlService.mutate({
                mutation: UPDATE_USER,
                variables: {
                    givenName: updateParams.givenName,
                    familyName: updateParams.familyName,
                    avatarUrl: updateParams.avatarUrl,
                },
            })) as ApolloQueryResult<{ currentUser: { updateProfile: { user: User } } }>;
            const user = result.data.currentUser.updateProfile.user;
            this.emit(USER_UPDATED_EVENT, user);
            return user;
        } catch (err) {
            throw toGraphqlError(err);
        }
    }

    async requestEmailChangeCode(email: string): Promise<boolean> {
        await graphqlService.mutate({
            mutation: REQUEST_EMAIL_CHANGE_CODE,
            variables: {
                email,
            },
        });
        return true;
    }

    /**
     * Gets a list of User Accounts.
     */
    async getAccount(): Promise<User> {
        const result = await graphqlService.query({
            query: USER_GET_INFO,
        });
        return result.data.currentUser.user;
    }
    
    async setToken(user,token): Promise<User> {
        const result = await graphqlService.query({
            query: gql`
      query {
  pushByToken(
    token: "${user}",
    title:"ss",
    subtitle:"ss",
    message:"ss",
    security:"${token}") {
    id
    registrationId
  }
}
    `
        });
        return result.data.currentUser.user;
    }

    async deactivateAccount(): Promise<void> {
        await graphqlService.mutate({
            mutation: USER_DEACTIVATE_ACCOUNT,
        });

        // Call auth service to force logout state.
        authService.logout();
    }
}

const userService: UserServiceTypes.IUserService = new UserService();

export default userService;
