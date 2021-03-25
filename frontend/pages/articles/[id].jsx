import React from "react";
import { apiClient } from "../../lib/api";

function Article({ data }) {
  console.log(data);
  return (
    <main className="w-max m-auto p-10 shadow-lg my-10">
      <h2 className="text-2xl">{data?.title}</h2>
      <p>{data?.created_at}</p>
      <p>{data?.desc}</p>
    </main>
  );
}

export const getStaticPaths = async () => {
  const response = await apiClient.get("/articles");
  const { data } = response;
  const paths = data.map((article) => ({ params: { id: `${article.id}` } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const response = await apiClient.get(`/articles/${id}`);
  const { data } = response;
  return { props: { data } };
};

export default Article;
