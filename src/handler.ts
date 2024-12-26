import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./app/api/graphql/schemas";
import { NextRequest } from "next/server";
import { resolvers } from "./app/api/graphql/resolvers";
import { connectToDatabase } from "@/lib/mongodb";

connectToDatabase();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async () => {
    return {};
  },
});
