import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("components/ArticleList"));
import { GET_ARTICLES, MYINFO } from "lib/apollo/query";
import { initializeApollo } from "lib/apollo/client";
import nookies from "nookies";
import BaseLayout from "components/Layout/BaseLayout";

const limit = 10;

export default function Home() {
  const start = useRef(0);
  const { data, loading, variables, fetchMore } = useQuery(GET_ARTICLES, {
    variables: {
      sort: "id:desc",
      start: 0,
      limit,
    },
  });

  const handlePagination = async () => {
    await fetchMore({ variables: { ...variables, start: start.current + limit } });
    start.current += limit;
  };

  return (
    <BaseLayout>
      <Head>
        <title>hello~</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-10">
        {data && <ArticleList data={data.articlesByUser} onPagination={handlePagination} />}
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
