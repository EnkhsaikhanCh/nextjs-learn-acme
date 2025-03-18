// src/app/api/graphql/apollo-client.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

export default client;
