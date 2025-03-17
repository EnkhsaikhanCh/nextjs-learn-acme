import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest } from "next/server";
import { resolvers } from "./resolvers";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Таны auth.js файл

await connectToDatabase();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    // getServerSession-г App Router-д тохируулан дуудна
    const session = await getServerSession({ req, ...authOptions });
    console.log("Session in context:", session); // Шалгах
    return {
      user: session?.user || null,
    };
  },
});

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const response = await handler(req);
  return response;
};

export const POST = async (req: NextRequest) => {
  const response = await handler(req);
  return response;
};
