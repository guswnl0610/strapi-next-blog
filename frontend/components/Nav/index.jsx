import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { PersonCircleOutline, SettingsSharp } from "react-ionicons";
import { useQuery, useMutation, useReactiveVar, gql } from "@apollo/client";
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

function Nav() {
  const _userVar = useReactiveVar(userVar);
  const [logout, { client, data: logoutData }] = useMutation(LOGOUT);
  const [isModalOn, setIsModalOn] = useState(false);
  const profileRef = useRef(null);
  const modalRef = useRef(null);
  const router = useRouter();

  useClickOutside(modalRef, () => setIsModalOn(false), profileRef);
  useAuth();

  const handleLogout = async () => {
    await logout();
    client.cache.reset();
    setIsModalOn(false);
    userVar(null);
    router.push("/");
  };

  return (
    <nav className="flex justify-between sticky top-0 w-full py-3 px-6 h-14 bg-white shadow-lg z-20">
      <Link href="/home">
        <a className="text-2xl text-gray-700 font-bold">Title</a>
      </Link>
      <span>
        {_userVar && (
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
