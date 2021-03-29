import Head from "next/head";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
const ArticleList = dynamic(() => import("components/ArticleList"));

const GET_ARTICLES = gql`
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

export default function Home() {
  const { data, loading, error } = useQuery(GET_ARTICLES);

  return (
    <div>
      <Head>
        <title>hello~</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-10">
        <ArticleList data={data?.articlesByUser} />
      </main>
    </div>
  );
}
