import gql from 'graphql-tag';

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
    mutation LoginWithGoogle($idToken: String!, $email: String!) {
        authLoginWithGoogle(input: { idToken: $idToken, email: $email }) {
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

export const REQUEST_EMAIL_CODE = gql`
    mutation RequestEmailCode($email: String!) {
        authRequestLoginCode(input: { email: $email }) {
            success
        }
    }
`;

export const VERIFY_EMAIL_AUTH_CODE = gql`
    mutation LoginWithCode($email: String!, $code: String!) {
        authLoginWithCode(input: { email: $email, loginCode: $code }) {
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

export const UPDATE_EMAIL_WITH_CODE = gql`
    mutation UpdateEmail($newEmail: String!, $code: String!) {
        currentUser {
            updateEmailWithCode(input: { email: $newEmail, loginCode: $code }) {
                accessToken: token
                refreshToken
            }
        }
    }
`;

export const AUTH_REFRESH_TOKEN = gql`
    mutation refreshToken($refreshToken: String!) {
        authRefreshToken(refreshToken: $refreshToken) {
            accessToken: token
            refreshToken
        }
    }
`;

export const AUTH_REVOKE_REFRESH_TOKEN = gql`
    mutation revokeToken($refreshToken: String!) {
        authRevokeToken(refreshToken: $refreshToken)
    }
`;
