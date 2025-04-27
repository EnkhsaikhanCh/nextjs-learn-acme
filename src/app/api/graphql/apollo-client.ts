// src/app/api/graphql/apollo-client.ts
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

// Error handler link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Retry link
const retryLink = new RetryLink({
  attempts: {
    max: 3, // 3 удаа дахин оролдоно
    retryIf: (error) => !!error, // Зөвхөн алдаатай үед retry хийнэ
  },
  delay: {
    initial: 300, // Эхний retry 300ms хүлээнэ
    max: 1000, // Хамгийн ихдээ 1 секунд хүлээн retry хийнэ
    jitter: true, // Randomize timing бага зэрэг
  },
});

// Batch link
const batchLink = new BatchHttpLink({
  uri: "/api/graphql",
  credentials: "include",
  batchMax: 5,
  batchInterval: 20,
});

// Apollo Link Chain
const link = from([errorLink, retryLink, batchLink]);

// Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
