import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest } from "next/server";
import { resolvers } from "./resolvers";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

await connectToDatabase();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    try {
      const session = await getServerSession({ req, ...authOptions });
      const user = session?.user || null;
      return { user };
    } catch {
      return { user: null, error: "auth_failed" };
    }
  },
});

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const response = await handler(req);
  return response;
};

export const POST = async (req: NextRequest) => {
  const reqClone = req.clone();
  return await handler(reqClone);
};
