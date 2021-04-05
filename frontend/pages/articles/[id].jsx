import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import nookies from "nookies";
import { MYINFO, GET_ARTICLE } from "lib/apollo/query";
import { useQuery } from "@apollo/client";
import { initializeApollo } from "lib/apollo/client";
import BaseLayout from "components/Layout/BaseLayout";

function Article() {
  const router = useRouter();
  const { data: article } = useQuery(GET_ARTICLE, { variables: router.query });
  console.log(article.article);

  return (
    <BaseLayout>
      <Head>
        <title>{article.article.title}</title>
      </Head>
      <main className="flex m-10 shadow-lg">
        <section className="flex-1">
          <h2>{article.article.title}</h2>
          <div></div>
        </section>
        <aside className="w-96">dddddd</aside>
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  // console.log(context.req.cookies);
  console.log(ctx);
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
