import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let apolloClient;
let token;

const authLink = setContext((_, { headers }) => {
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }
  if (headers) token = headers.token;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
        credentials: "include",
      })
    ),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, initialState });
  }

  //ssg나 ssr인 경우
  if (typeof window === "undefined") {
    return _apolloClient;
  }

  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

export const useApollo = (initialState) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};
