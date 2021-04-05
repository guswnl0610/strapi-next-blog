import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import nookies from "nookies";
import { initializeApollo } from "lib/apollo/client";
import { MYINFO } from "lib/apollo/query";
import BaseLayout from "components/Layout/BaseLayout";
import LoginForm from "components/Auth/LoginForm";
import SignupForm from "components/Auth/SignupForm";

export default function Index() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const { data: me, refetch } = useQuery(MYINFO);

  useEffect(() => {
    if (me) router.push("/home");
  }, [me]);

  return (
    <BaseLayout>
      <Head>
        <title>로그인</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-10">
        <div className="flex justify-center mb-5">
          <button
            className={`py-5 px-10 w-56 text-gray-500 border-b-2 focus:outline-none ${
              isLogin ? "border-red-200" : "border-gray-200"
            }`}
            onClick={() => setIsLogin(true)}>
            로그인
          </button>
          <button
            className={`py-5 px-10 w-56 text-gray-500 border-b-2 focus:outline-none ${
              isLogin ? "border-gray-200" : "border-red-200"
            }`}
            onClick={() => setIsLogin(false)}>
            회원가입
          </button>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
      </main>
    </BaseLayout>
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
