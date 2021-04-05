import React, { memo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMutation, useReactiveVar } from "@apollo/client";
import { CREATE_COMMENT } from "lib/apollo/mutation";
import { GET_ARTICLE } from "lib/apollo/query";
import { dateFormatter } from "utils/date";
import { userVar } from "lib/apollo/store";

function ArticleDetail({ article }) {
  const _userVar = useReactiveVar(userVar);
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [createComment, { data, error }] = useMutation(CREATE_COMMENT, {
    update(cache, { data }) {
      const existingArticle = cache.readQuery({ query: GET_ARTICLE, variables: router.query });
      const newComments = [...existingArticle.article.comments, data.createComment.comment];
      cache.writeQuery({
        query: GET_ARTICLE,
        data: {
          article: {
            ...existingArticle.article,
            comments: newComments,
          },
        },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createComment({
      variables: {
        input: {
          data: {
            content: comment,
            user: _userVar.id,
            article: router.query.id,
            likes: 0,
          },
        },
      },
    });
    setComment("");
  };

  const handleChange = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  return (
    <article className="flex-1 p-10 ml-8 shadow-lg">
      <h2 className="text-3xl font-bold pb-3">{article.title}</h2>
      <p className="pb-3 text-gray-600">{dateFormatter(article.created_at)}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: article.desc }} />
      <div className="mt-10 pt-10 border-t-2 border-gray-200">
        <h3 className="text-xl font-semibold pb-5">Comments</h3>
        <div>
          {article.comments.map((comment) => (
            <div key={comment.id} className="flex py-2">
              <div className="flex items-center w-32">
                <div className="relative flex items-center justify-center w-5 h-5 mr-2 rounded-1/2 overflow-hidden ">
                  {comment.user.profile_image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_SERVER}${comment.user.profile_image.url}`}
                      width="20"
                      height="20"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300" />
                  )}
                </div>
                <span>{comment.user.username}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
        <form className="flex pt-7" onSubmit={handleSubmit}>
          <input
            className="flex-1 py-2 px-2 mr-3 ring-2 ring-gray-200 rounded-lg focus:outline-none focus:ring-red-200"
            type="text"
            value={comment}
            onChange={handleChange}
          />
          <button className="py-2 px-4 bg-red-200 rounded-xl">Submit</button>
        </form>
      </div>
    </article>
  );
}

export default memo(ArticleDetail);
