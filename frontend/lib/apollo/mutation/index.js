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

export const REGISTER = gql`
  mutation RegisterWithMail($input: UsersPermissionsRegisterInput!) {
    registerWithMail(input: $input) {
      status
      user {
        id
        username
        email
      }
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

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: createCommentInput) {
    createComment(input: $input) {
      comment {
        id
        user {
          username
          profile_image {
            url
          }
        }
        likes
        content
        created_at
      }
    }
  }
`;
