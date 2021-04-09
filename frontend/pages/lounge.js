import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import BaseLayout from "components/Layout/BaseLayout";
import { initializeApollo } from "lib/apollo/client";
import checkLoggedIn from "lib/checkLoggedIn";
import LoungeList from "components/LoungeList";

export const GET_LOUNGE_ARTICLE = gql`
  query ARTICLES($sort: String, $start: Int, $limit: Int) {
    articles(sort: $sort, start: $start, limit: $limit) {
      id
      title
      desc
      likes
      user {
        username
        profile_image {
          url
        }
      }
      comments {
        id
      }
    }
  }
`;

const limit = 16;

function Lounge() {
  const { data } = useQuery(GET_LOUNGE_ARTICLE, {
    variables: {
      sort: "id:desc",
      start: 0,
      limit,
    },
    fetchPolicy: "cache-and-network",
  });

  return (
    <BaseLayout>
      <main className="w-full max-w-4xl my-10 mx-auto p-10 shadow-xl ">
        <h2 className="pb-3 mb-3 text-2xl font-bold text-gray-700">Lounge</h2>
        <LoungeList />
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo(null, ctx);

  await checkLoggedIn(client, ctx);

  try {
    await client.query({
      query: GET_LOUNGE_ARTICLE,
      variables: {
        sort: "id:desc",
        start: 0,
        limit,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};

export default Lounge;
