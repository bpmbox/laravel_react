import gql from 'graphql-tag';

// Seperating the queries into a separate file allows backend developers to easily see the queries
// being used by our services.
export const REGISTER_USER = gql`
    mutation AccountUserRegister($givenName: String!, $familyName: String!, $purpose: String!, $avatarUrl: String) {
        currentUser {
            updateProfile(
                input: { firstName: $givenName, lastName: $familyName, purpose: $purpose, avatar: $avatarUrl }
            ) {
                user {
                    givenName: firstName
                    familyName: lastName
                    avatarUrl: avatar
                    email: email
                }
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation AccountUserRegister($givenName: String!, $familyName: String!, $avatarUrl: String) {
        currentUser {
            updateProfile(input: { firstName: $givenName, lastName: $familyName, avatar: $avatarUrl }) {
                user {
                    givenName: firstName
                    familyName: lastName
                    avatarUrl: avatar
                    email: email
                }
            }
        }
    }
`;

export const REQUEST_EMAIL_CHANGE_CODE = gql`
    mutation RequestEmailChangeCode($email: String!) {
        currentUser {
            requestEmailChangeCode(input: { email: $email }) {
                success
            }
        }
    }
`;

export const LOGIN_WITH_APPLE = gql`
    mutation LoginWithApple($appleToken: String!) {
        authLoginWithApple(input: { idToken: $appleToken }) {
            accessToken: token
            refreshToken
            isOnboarded
            user {
                id
                givenName: firstName
                familyName: lastName
                email
                avatarUrl: avatar
            }
        }
    }
`;

export const LOGIN_WITH_GOOGLE = gql`
    mutation LoginWithGoogle($idToken: String!) {
        authLoginWithGoogle(input: { idToken: $idToken }) {
            accessToken: token
            isOnboarded
            user {
                id
                givenName: firstName
                familyName: lastName
                email
                avatarUrl: avatar
            }
        }
    }
`;

export const USER_GET_INFO = gql`
    query {
        currentUser {
            user {
                id
                givenName: firstName
                familyName: lastName
                email
                avatarUrl: avatar
            }
        }
    }
`;

export const USER_DEACTIVATE_ACCOUNT = gql`
    mutation DeactivateAccount {
        currentUser {
            deactivate {
                success
            }
        }
    }
`;
