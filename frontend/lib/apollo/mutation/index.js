import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation LoginWithToken($input: UsersPermissionsLoginInput!) {
    loginWithToken(input: $input) {
      status
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout {
      authorized
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: updateUserInput) {
    updateUser(input: $input) {
      user {
        id
        username
        profile_image {
          url
        }
      }
    }
  }
`;
