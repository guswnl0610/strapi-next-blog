import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation, useQuery, gql } from "@apollo/client";
import { initializeApollo } from "lib/apollo/client";
import BaseLayout from "components/Layout/BaseLayout";
import LoginForm from "components/Auth/LoginForm";
import SignupForm from "components/Auth/SignupForm";
import checkLoggedIn from "lib/checkLoggedIn";

export const MYINFO = gql`
  query {
    myInfo {
      id
      username
      email
      profile_image {
        id
        url
      }
    }
  }
`;

export default function Index() {
  const router = useRouter();
  const [isLoginTab, setisLoginTab] = useState(true);
  const { data: me, refetch } = useQuery(MYINFO, {
    onCompleted: (me) => {
      console.log(me);
      router.push("/home");
    },
  });

  // useEffect(() => {
  //   if (me) router.push("/home");
  // }, [me]);

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
              isLoginTab ? "border-red-200" : "border-gray-200"
            }`}
            onClick={() => setisLoginTab(true)}>
            로그인
          </button>
          <button
            className={`py-5 px-10 w-56 text-gray-500 border-b-2 focus:outline-none ${
              isLoginTab ? "border-gray-200" : "border-red-200"
            }`}
            onClick={() => setisLoginTab(false)}>
            회원가입
          </button>
        </div>
        {isLoginTab ? <LoginForm /> : <SignupForm />}
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo(null, ctx);

  try {
    await client.query({
      query: gql`
        query {
          myInfo {
            id
            username
          }
        }
      `,
    });
    ctx.res.setHeader("Location", "/home");
    ctx.res.statusCode = 303;
    ctx.res.end();
  } catch (error) {}

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};
