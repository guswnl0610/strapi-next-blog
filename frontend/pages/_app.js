import { ApolloProvider } from "@apollo/client";
import Head from "next/head";
import { useApollo } from "lib/apollo/client";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
