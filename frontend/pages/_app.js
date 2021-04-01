import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import BaseLayout from "../components/Layout/BaseLayout";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "lib/apollo/client";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <BaseLayout>
        <Component {...pageProps} />;
      </BaseLayout>
    </ApolloProvider>
  );
}

export default MyApp;
