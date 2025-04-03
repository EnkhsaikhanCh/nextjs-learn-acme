import { GraphQLError } from "graphql";
import { redis } from "@/lib/redis";

const RATE_LIMIT_KEY = "rate_limit:get-email-from-token:";
const MAX_REQUESTS = 10; // Цагт 10 удаа
const WINDOW = 3600; // 1 цаг (секундээр)

export const getEmailFromToken = async (
  _: unknown,
  { token }: { token: string },
) => {
  if (!token) {
    throw new GraphQLError("Token шаардлагатай", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    // Rate limiting шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${token}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      throw new GraphQLError(
        "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
        { extensions: { code: "TOO_MANY_REQUESTS" } },
      );
    }

    // Хүсэлтийн тоог нэмэх
    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW });
    } else {
      await redis.incr(rateLimitKey);
    }

    // Redis-ээс имэйл авах
    const email = await redis.get(`temp-token:${token}`);
    if (!email) {
      throw new GraphQLError("Token буруу эсвэл хугацаа дууссан", {
        extensions: { code: "BAD_REQUEST" },
      });
    }

    return { email };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
