import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "lib/apollo/mutation";
import { MYINFO, GET_ARTICLE } from "lib/apollo/query";
import { initializeApollo } from "lib/apollo/client";
import BaseLayout from "components/Layout/BaseLayout";
import AuthorSide from "components/AuthorSide";
import ArticleDetail from "components/ArticleDetail";

function Article() {
  const router = useRouter();
  const { data } = useQuery(GET_ARTICLE, { variables: router.query });

  const { article } = data;
  const { user: author } = article;

  return (
    <BaseLayout>
      <Head>
        <title>{article.title}</title>
      </Head>
      <main className="flex m-10 justify-start">
        <AuthorSide author={author} />
        <ArticleDetail article={article} />
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  // console.log(context.req.cookies);
  const client = initializeApollo(null, ctx);
  try {
    await client.query({ query: MYINFO });
  } catch (error) {
    console.log(error);
    nookies.destroy(ctx, "token");
  }

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
