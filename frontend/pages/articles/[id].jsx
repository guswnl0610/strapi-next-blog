import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { initializeApollo } from "lib/apollo/client";
import BaseLayout from "components/Layout/BaseLayout";
import AuthorSide from "components/AuthorSide";
import ArticleDetail from "components/ArticleDetail";
import checkLoggedIn from "lib/checkLoggedIn";

const GET_ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      created_at
      title
      desc
      likes
      user {
        id
        username
        email
        profile_image {
          url
        }
      }
      comments {
        id
        user {
          id
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

function Article() {
  const router = useRouter();
  const { data, error } = useQuery(GET_ARTICLE, { variables: router.query });

  // const { article } = data;
  // const { user: author } = article;

  if (error || !data.article)
    return (
      <BaseLayout>
        <Head>
          <title>존재하지 않는 게시물입니다</title>
        </Head>
        <main>존재하지 않는 게시물입니다 :(</main>
      </BaseLayout>
    );

  return (
    <BaseLayout>
      <Head>
        <title>{data?.article?.title}</title>
      </Head>
      <main className="flex m-10 justify-start">
        <AuthorSide author={data?.article?.user} />
        <ArticleDetail article={data?.article} />
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo(null, ctx);

  await checkLoggedIn(client, ctx);

  try {
    await client.query({ query: GET_ARTICLE, variables: ctx.query });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};

export default Article;
