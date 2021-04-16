import React, { memo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { TrashOutline, HeartOutline, Heart } from "react-ionicons";
import { useMutation, useReactiveVar, gql } from "@apollo/client";
import { userVar } from "lib/apollo/store";
import { GET_ARTICLES } from "pages/home";
import { GET_LOUNGE_ARTICLE } from "pages/lounge";
import { GET_ARTICLE } from "pages/articles/[id]";
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

const LIKE_ARTICLE = gql`
  mutation LikeArticle($id: ID!) {
    likeArticle(id: $id) {
      like_users {
        id
      }
    }
  }
`;

const DISLIKE_ARTICLE = gql`
  mutation DislikeArticle($id: ID!) {
    dislikeArticle(id: $id) {
      like_users {
        id
      }
    }
  }
`;

function ArticleDetail({ article }) {
  const _userVar = useReactiveVar(userVar);
  const router = useRouter();

  const [likeArticle] = useMutation(LIKE_ARTICLE, {
    variables: {
      id: router.query.id,
    },
    update(cache, { data }) {
      const prevArticle = cache.readQuery({
        query: GET_ARTICLE,
        variables: {
          id: router.query.id,
        },
      });

      cache.writeQuery({
        query: GET_ARTICLE,
        variables: { id: router.query.id },
        data: {
          article: {
            ...prevArticle.article,
            like_users: data.likeArticle.like_users,
          },
        },
      });
    },
  });
  const [dislikeArticle] = useMutation(DISLIKE_ARTICLE, {
    variables: {
      id: router.query.id,
    },
    update(cache, { data }) {
      const prevArticle = cache.readQuery({
        query: GET_ARTICLE,
        variables: {
          id: router.query.id,
        },
      });

      cache.writeQuery({
        query: GET_ARTICLE,
        variables: { id: router.query.id },
        data: {
          article: {
            ...prevArticle.article,
            like_users: data.dislikeArticle.like_users,
          },
        },
      });
    },
  });

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
      <div className="flex items-center text-sm text-gray-400 pt-5">
        {article?.like_users.find((user) => user.id === _userVar?.id) ? (
          <span onClick={dislikeArticle} className="cursor-pointer">
            <Heart color="#fecaca" width="2rem" height="2rem" />
          </span>
        ) : (
          <span onClick={likeArticle} className="cursor-pointer">
            <HeartOutline color="gray" width="2rem" height="2rem" />
          </span>
        )}
        <span className="ml-3">{`${article?.like_users.length}`}</span>
      </div>
      <div className="mt-10 pt-10 border-t-2 border-gray-200">
        <h3 className="text-xl font-semibold pb-5">Comments</h3>
        <CommentList article={article} />
      </div>
    </article>
  );
}

export default memo(ArticleDetail);
