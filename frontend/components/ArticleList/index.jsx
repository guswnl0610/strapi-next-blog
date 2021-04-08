import React, { useRef, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { TimeOutline, ChatboxEllipsesOutline } from "react-ionicons";
import { GET_ARTICLES } from "pages/home";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";

const limit = 10;

function ArticleList() {
  const { data, variables, fetchMore } = useQuery(GET_ARTICLES, {
    variables: {
      sort: "id:desc",
      start: 0,
      limit,
    },
  });
  const start = useRef(0);
  const listRef = useRef(null);

  const handleIntersect = async (entries, observer) => {
    if (entries[0].isIntersecting) {
      await fetchMore({ variables: { ...variables, start: start.current + limit } });
      start.current += limit;
      observer.unobserve(entries[0].target);
      if (entries[0].target.previousElementSibling !== listRef.current.previousElementSibling)
        observer.observe(listRef.current);
    }
  };

  useIntersectionObserver(listRef, handleIntersect);

  return (
    <div className="max-w-4xl shadow-lg m-auto w-full p-10">
      <h1 className="text-2xl text-gray-800 mb-4">Contents</h1>
      {data?.articlesByUser.map((article, idx) => {
        return (
          <div
            key={article.id}
            ref={idx === data?.articlesByUser.length - 1 ? listRef : null}
            className="group my-2 cursor-pointer py-2 px-3 rounded-lg text-gray-600">
            <Link href={`/articles/:id`} as={`/articles/${article?.id || ""}`}>
              <a className=" text-gray-800  transition-colors">
                <span className="font-semibold  group-hover:text-red-400 text-lg">{article?.title}</span>
                <p className="flex items-center text-sm text-gray-400">
                  <TimeOutline color={"#00000"} width="1rem" />
                  <span className="pl-1">{dayjs(article?.created_at).format("YYYY MMMM D ddd hh:mm a")}</span>
                </p>
                <div className="text-sm line-clamp-2 " dangerouslySetInnerHTML={{ __html: article?.desc }} />
                <div className="flex items-center text-sm text-gray-400">
                  <ChatboxEllipsesOutline color={"#00000"} />
                  <span className="pl-1">{article?.comments.length}</span>
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default memo(ArticleList);
