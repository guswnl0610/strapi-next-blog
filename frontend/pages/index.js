import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter, Router } from "next/router";
import { useMutation, gql, useLazyQuery, useQuery } from "@apollo/client";
import { userVar } from "lib/apollo/store";
import Link from "next/link";
import nookies from "nookies";
import { initializeApollo } from "lib/apollo/client";
import { ME, MYINFO } from "lib/apollo/query";
import { LOGIN } from "lib/apollo/mutation";
import { useAuth } from "hooks/useAuth";

export default function Index() {
  const router = useRouter();
  const [inputState, setInputState] = useState({ identifier: "", password: "" });
  const { data: me, refetch } = useQuery(MYINFO);
  const [login, { loading, error, data: loginData }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      console.log(data);
      router.push("/home");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await login({
        variables: {
          input: inputState,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useAuth();

  return (
    <div>
      <Head>
        <title>로그인</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-10">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            name="identifier"
            className="p-3 my-3 w-full max-w-md text-md rounded-md border border-red-200"
            type="text"
            value={inputState.identifier}
            placeholder="이메일을 입력하세요"
            onChange={handleInputChange}
          />
          <input
            name="password"
            className="p-3 my-3 w-full max-w-md text-md rounded-md border-red-200 border "
            type="password"
            value={inputState.password}
            placeholder="비밀번호를 입력하세요"
            onChange={handleInputChange}
          />
          <button className="bg-red-300 max-w-md w-full py-3 px-6 my-3 text-md rounded-lg text-white hover:bg-red-400 transition-colors">
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  // console.log(context.req.cookies);
  const client = initializeApollo(null, ctx);

  try {
    await client.query({ query: MYINFO });
  } catch (error) {
    console.log(error);
    nookies.destroy(ctx, "token");
  }

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};
