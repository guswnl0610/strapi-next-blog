import Head from "next/head";
import { useEffect } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("components/ArticleList"));
import { GET_ARTICLES, MYINFO } from "lib/apollo/query";
import { initializeApollo } from "lib/apollo/client";
import nookies from "nookies";
import BaseLayout from "components/Layout/BaseLayout";

export default function Home() {
  const { data, loading, error } = useQuery(GET_ARTICLES);

  return (
    <BaseLayout>
      <Head>
        <title>hello~</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-10">
        <ArticleList data={data?.articlesByUser} />
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

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};
