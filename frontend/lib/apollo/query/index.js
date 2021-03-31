import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;

export const MYINFO = gql`
  query {
    myInfo {
      id
      username
      email
      profile_image {
        url
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query {
    articlesByUser {
      id
      title
      desc
      likes
      created_at
    }
  }
`;
