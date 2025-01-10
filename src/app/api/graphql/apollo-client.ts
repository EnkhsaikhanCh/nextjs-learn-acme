// src/app/api/graphql/apollo-client.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
  credentials: "include", // Cookie-г автоматаар илгээх
});

export default client;
