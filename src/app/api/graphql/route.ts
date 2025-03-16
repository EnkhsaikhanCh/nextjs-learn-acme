import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest } from "next/server";
import { resolvers } from "./resolvers";
import { connectToDatabase } from "@/lib/mongodb";
import { redis } from "@/lib/redis";
import { GraphQLError } from "graphql";

await connectToDatabase();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    return {
      req,
      checkRateLimit: async (
        key: string,
        maxRequests: number,
        window: number,
      ) => {
        const rateLimitKey = `rate_limit:${key}`;
        const currentCount = await redis.get(rateLimitKey);

        // currentCount нь string эсвэл null байж болно, тиймээс parseInt-д default утга өгнө
        if (
          currentCount &&
          parseInt(currentCount as string, 10) >= maxRequests
        ) {
          throw new GraphQLError(
            "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
            {
              extensions: { code: "RATE_LIMIT_EXCEEDED" },
            },
          );
        }

        if (!currentCount) {
          await redis.set(rateLimitKey, "1", { ex: window }); // Анхны хүсэлт
        } else {
          await redis.incr(rateLimitKey); // Тоог нэмэх
        }
      },
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
