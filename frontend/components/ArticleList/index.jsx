import React from "react";
import Link from "next/link";

function ArticleList({ data }) {
  return (
    <div className="max-w-4xl shadow-lg m-auto w-full p-10">
      <h1 className="text-2xl text-gray-800 mb-4">Contents</h1>
      {data?.map((article) => (
        <div key={article.id} className="group my-2 cursor-pointer py-2 px-3 rounded-lg text-gray-600">
          <Link className="text-lg" href={`articles/:id`} as={`articles/${article.id}`}>
            <a className="font-semibold text-gray-800 group-hover:text-red-400 transition-colors">{article.title}</a>
          </Link>
          <div className="text-sm truncate">{article.desc}</div>
        </div>
      ))}
    </div>
  );
}

export default ArticleList;
