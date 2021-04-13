import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { PersonCircleOutline, SettingsSharp, Pencil, CompassOutline, Search } from "react-ionicons";
import { useLazyQuery, useMutation, useReactiveVar, gql } from "@apollo/client";
import { userVar } from "lib/apollo/store";
import { useClickOutside } from "hooks/useClickOutside";
import { useAuth } from "hooks/useAuth";

const LOGOUT = gql`
  mutation {
    logout {
      authorized
      message
    }
  }
`;

const SEARCH_ARTICLES = gql`
  query SearchArticles($where: JSON) {
    articles(where: $where, limit: 20, start: 0) {
      id
      title
      user {
        username
      }
    }
  }
`;

function Nav() {
  const _userVar = useReactiveVar(userVar);
  const [logout, { client, data: logoutData }] = useMutation(LOGOUT, {
    onCompleted: (data) => {
      setIsModalOn(false);
      userVar(null);
      client.cache.reset();
      router.push("/");
    },
  });
  const [isModalOn, setIsModalOn] = useState(false);
  const [searchModalOn, setSearchModalOn] = useState(false);
  const [search, { data: searchResult, error }] = useLazyQuery(SEARCH_ARTICLES, { fetchPolicy: "cache-and-network" });
  const profileRef = useRef(null);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const router = useRouter();

  useClickOutside(modalRef, () => setIsModalOn(false), profileRef);
  useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (!value.trim()) return;
    search({
      variables: {
        where: {
          title_contains: value,
        },
      },
    });
  };

  return (
    <nav className="flex justify-between items-center sticky top-0 w-full py-3 px-6 h-14 bg-white shadow-lg z-20">
      <Link href="/home">
        <a className="text-2xl text-gray-700 font-bold">
          {_userVar && _userVar.blogTitle ? _userVar.blogTitle : "menglog"}
        </a>
      </Link>
      <span className="flex relative w-64 group text-gray-700 text-sm ">
        <input
          className=" pl-7 pb-1 w-full border-b border-gray-400 focus:outline-none focus:border-red-200 transition-colors"
          type="text"
          onChange={handleChange}
          onFocus={() => setSearchModalOn(true)}
          onBlur={() => setSearchModalOn(false)}
          ref={searchInputRef}
        />
        <span className="absolute">
          <Search color="gray" />
        </span>
        {searchModalOn && (
          <div className="  absolute top-10 bg-white w-64 px-3 py-2 shadow-lg">
            {!searchInputRef.current.value.trim() || !searchResult.articles.length ? (
              <div className="text-center">{`검색 결과가 없습니다 :(`}</div>
            ) : (
              searchResult.articles.map((article) => (
                <div key={article.id} className="flex justify-between">
                  <span className=" text-md truncate">{article.title}</span>
                  <span className="text-sm text-gray-600">{article.user.username}</span>
                </div>
              ))
            )}
            <div className="flex justify-end items-center"></div>
          </div>
        )}
      </span>
      <span>
        {_userVar && (
          <div className="flex items-center">
            <span className="cursor-pointer" onClick={() => router.push("/lounge")}>
              <CompassOutline color="gray" height="2rem" width="2rem" />
            </span>
            <span className="mx-8 cursor-pointer" onClick={() => router.push("/articles/editor")}>
              <Pencil color="gray" height="2rem" width="2rem" />
            </span>
            <span onClick={() => setIsModalOn((prev) => !prev)} className="cursor-pointer" ref={profileRef}>
              {_userVar.profile_image?.url ? (
                <div className="rounded-1/2 overflow-hidden w-8 h-8 hover:shadow-md transition-all">
                  <Image
                    alt={`${_userVar.username}의 프로필사진`}
                    src={`${process.env.NEXT_PUBLIC_API_SERVER}${_userVar?.profile_image?.url}`}
                    width={50}
                    height={50}
                    objectFit="cover"
                  />
                </div>
              ) : (
                <PersonCircleOutline color={`rgb(248, 113, 113)`} height="2rem" width="2rem" />
              )}
            </span>
          </div>
        )}
      </span>
      <div
        ref={modalRef}
        className={`fixed top-12 right-6 py-4 px-6 text-sm z-10 bg-white shadow-lg rounded-xl text-gray-800 cursor-pointer ${
          !isModalOn && "opacity-0 pointer-events-none"
        } transition-opacity`}>
        <p>
          <span className="text-red-400 font-bold mr-1">{_userVar?.username}</span>님 안녕하세요!
        </p>
        <Link href="/user/settings">
          <p className="flex items-center my-2">
            <SettingsSharp color="rgba(0,0,0,0.2)" />
            <a className="ml-2">설정</a>
          </p>
        </Link>
        <p className="flex justify-end mt-2 pt-2 border-t w-full border-gray-200 text-gray-400" onClick={handleLogout}>
          로그아웃
        </p>
      </div>
    </nav>
  );
}

export default Nav;
