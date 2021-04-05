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

export const GET_ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      created_at
      title
      desc
      likes
      user {
        username
      }
      comments {
        id
        user {
          username
        }
        likes
        content
        created_at
      }
    }
  }
`;
