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
        id
        url
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query ArticleByUser($sort: String, $start: Int, $limit: Int) {
    articlesByUser(sort: $sort, start: $start, limit: $limit) {
      id
      title
      desc
      created_at
      comments {
        id
      }
    }
  }
`;
