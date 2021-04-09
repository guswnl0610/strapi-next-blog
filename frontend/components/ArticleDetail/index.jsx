import React, { memo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { TrashOutline } from "react-ionicons";
import { useMutation, useReactiveVar, gql } from "@apollo/client";
import { userVar } from "lib/apollo/store";
import { GET_ARTICLES } from "pages/home";
import { GET_LOUNGE_ARTICLE } from "pages/lounge";
import CommentList from "components/CommentList";

const DELETE_ARTICLE = gql`
  mutation DeleteArticle($input: deleteArticleInput) {
    deleteArticle(input: $input) {
      article {
        id
      }
    }
  }
`;

function ArticleDetail({ article }) {
  const _userVar = useReactiveVar(userVar);
  const router = useRouter();
  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    variables: {
      input: {
        where: {
          id: router.query.id,
        },
      },
    },
    update(cache, { data }) {
      const existingArticles = cache.readQuery({ query: GET_ARTICLES });
      const newArticles = existingArticles.articlesByUser.filter(
        (article) => article.id !== data.deleteArticle.article.id
      );
      cache.writeQuery({
        query: GET_ARTICLES,
        data: {
          articlesByUser: newArticles,
        },
      });

      const existingLoungeArticles = cache.readQuery({ query: GET_LOUNGE_ARTICLE });
      const newLoungeArticles = existingLoungeArticles.articles.filter(
        (article) => article.id !== data.deleteArticle.article.id
      );

      cache.writeQuery({
        query: GET_LOUNGE_ARTICLE,
        data: {
          articles: newLoungeArticles,
        },
      });
    },
    onCompleted: () => router.push("/home"),
  });

  return (
    <article className="flex-1 p-10 ml-8 shadow-lg">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold pb-3">{article?.title}</h2>
        {article?.user.id === _userVar?.id && (
          <span className="flex items-center text-sm">
            <Link href={`/articles/editor?id=${article?.id || ""}`}>
              <a className=" text-gray-400">편집</a>
            </Link>
            <span className="ml-2" onClick={deleteArticle}>
              <TrashOutline color="red" height="1.1rem" />
            </span>
          </span>
        )}
      </div>
      <p className="pb-3 text-gray-600">{dayjs(article?.created_at).format("YYYY MMMM D ddd hh:mm a")}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: article?.desc }} />
      <div className="mt-10 pt-10 border-t-2 border-gray-200">
        <h3 className="text-xl font-semibold pb-5">Comments</h3>
        <CommentList article={article} />
      </div>
    </article>
  );
}

export default memo(ArticleDetail);
