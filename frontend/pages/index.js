import Head from "next/head";
import Link from "next/link";
import qs from "qs";
import styles from "../styles/Home.module.css";
import { apiClient } from "../lib/api";

export default function Home({ data }) {
  // console.log(data);
  const qstring = qs.stringify({ _limit: 30, test: { deep: 1 } });
  console.log("qstring", qstring);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="my-10">
        <div>
          {data?.map((article) => (
            <div key={article.id} className="text-2xl">
              <Link href={`/articles/${article.id}`}>
                <a>{article.title}</a>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export const getStaticProps = async (ctx) => {
  const response = await apiClient.get("/articles");
  const { data } = response;
  return {
    props: {
      data,
    },
  };
};
