import React from "react";
import Link from "next/link";

function ArticleList({ data }) {
  console.log(data);

  return (
    <div className="max-w-4xl shadow-lg m-auto w-full p-10">
      <h1 className="text-2xl text-gray-800 mb-4">Contents</h1>
      {data?.map((article) => (
        <div key={article.id}>
          <Link className="text-lg" href={`articles/:id`} as={`articles/${article.id}`}>
            {article.title}
          </Link>
          <p className="text-sm">{article.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default ArticleList;
