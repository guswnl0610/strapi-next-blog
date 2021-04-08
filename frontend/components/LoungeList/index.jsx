import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";

const GET_LOUNGE_ARTICLE = gql`
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

function LoungeIndex() {
  const { data, fetchMore } = useQuery(GET_LOUNGE_ARTICLE, {
    variables: {
      sort: "id:desc",
      start: 0,
      limit,
    },
  });

  return (
    <section className="grid grid-cols-4 gap-5 ">
      {data?.articles.map((article) => (
        <div key={article.id} className="p-5 shadow-md group cursor-pointer rounded-lg hover:shadow-lg transition-all">
          <Link href={`/articles/${article.id}`}>
            <a>
              <h4 className="truncate text-gray-600 font-semibold group-hover:text-red-300 transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center my-3">
                <div className="relative rounded-1/2 overflow-hidden w-6 h-6 mr-2">
                  {article.user.profile_image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_SERVER}${article.user.profile_image.url}`}
                      height="40"
                      width="40"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                </div>
                <span className=" text-sm text-gray-500 truncate group-hover:text-gray-800 transition-colors">
                  {article.user.username}
                </span>
              </div>
              <div
                className="text-sm text-gray-500 group-hover:text-gray-800 transition-colors line-clamp-4"
                dangerouslySetInnerHTML={{ __html: article.desc }}
              />
            </a>
          </Link>
        </div>
      ))}
    </section>
  );
}

export default LoungeIndex;
