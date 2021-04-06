import React, { useRef, useEffect, memo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { TimeOutline, ChatboxEllipsesOutline } from "react-ionicons";

function ArticleList({ data, onPagination }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;

    const handleIntersect = async (entries, observer) => {
      if (entries[0].isIntersecting) {
        await onPagination();
        observer.unobserve(entries[0].target);
        if (entries[0].target.previousElementSibling !== listRef.current.previousElementSibling)
          observer.observe(listRef.current);
      }
    };
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0 });
    observer.observe(listRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-4xl shadow-lg m-auto w-full p-10">
      <h1 className="text-2xl text-gray-800 mb-4">Contents</h1>
      {data.map((article, idx) => {
        return (
          <div
            key={article.id}
            ref={idx === data.length - 1 ? listRef : null}
            className="group my-2 cursor-pointer py-2 px-3 rounded-lg text-gray-600">
            <Link href={`articles/:id`} as={`articles/${article.id}`}>
              <a className=" text-gray-800  transition-colors">
                <span className="font-semibold  group-hover:text-red-400 text-lg">{article.title}</span>
                <p className="flex items-center text-sm text-gray-400">
                  <TimeOutline color={"#00000"} width="1rem" />
                  <span className="pl-1">{dayjs(article.created_at).format("YYYY MMMM D ddd hh:mm a")}</span>
                </p>
                <div className="text-sm line-clamp-2 " dangerouslySetInnerHTML={{ __html: article.desc }} />
                <div className="flex items-center text-sm text-gray-400">
                  <ChatboxEllipsesOutline color={"#00000"} />
                  <span className="pl-1">{article.comments.length}</span>
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
