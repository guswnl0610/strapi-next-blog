import React from "react";
import Image from "next/image";
import Link from "next/link";

function AuthorSide({ author }) {
  return (
    <aside className="sticky top-24 flex flex-col items-center w-96 h-full p-10 shadow-lg">
      <div className="relative w-52 h-52 flex items-center justify-center rounded-1/2 overflow-hidden shadow-md ">
        {author?.profile_image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_SERVER}${author.profile_image.url}`}
            width={220}
            height={220}
            objectFit="cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>
      <span className="pt-7 text-gray-600">
        Written by
        <span className="text-gray-800 font-semibold pl-1">{author?.username}</span>
      </span>
      <Link href={`mailto:${author?.email}`}>
        <a className="text-gray-600 pt-3">{author?.email}</a>
      </Link>
    </aside>
  );
}

export default AuthorSide;
