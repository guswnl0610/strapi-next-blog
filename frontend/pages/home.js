import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("components/ArticleList"));
import { initializeApollo } from "lib/apollo/client";
import checkLoggedIn from "lib/checkLoggedIn";
import BaseLayout from "components/Layout/BaseLayout";

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
  const client = initializeApollo(null, ctx);

  await checkLoggedIn(client, ctx);

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};
