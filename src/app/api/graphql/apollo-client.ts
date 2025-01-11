// src/app/api/graphql/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        // Refresh Token-г ашиглан шинэ Access Token авах
        return new Observable((observer) => {
          fetch("/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              query: `
                mutation RefreshToken {
                  refreshToken {
                    token
                    refreshToken
                  }
                }
              `,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              const newAccessToken = data.data?.refreshToken?.token;

              if (newAccessToken) {
                // Шинэ Access Token-ийг хүсэлт дээр нэмнэ
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                }));

                // Шинэ токентой хүсэлтийг үргэлжлүүлнэ
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              } else {
                console.error("Refresh failed. Redirecting to login...");
                window.location.href = "/login";
                observer.complete();
              }
            })
            .catch((error) => {
              console.error("Failed to refresh token:", error);
              window.location.href = "/login";
              observer.error(error);
            });
        });
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
