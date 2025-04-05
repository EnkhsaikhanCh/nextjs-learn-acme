// src/app/api/graphql/mutations/auth/generate-temp-token-mutation.ts
import { redis } from "@/lib/redis";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

const RATE_LIMIT_KEY = "rate_limit:generate-temp-token:";
const MAX_REQUESTS = 5;
const WINDOW = 3600;

export const generateTempToken = async (
  _: unknown,
  { email }: { email: string },
) => {
  if (!email) {
    throw new GraphQLError("И-мэйл хаяг шаардлагатай", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new GraphQLError("Имэйл хаяг буруу байна", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validateEmail(normalizedEmail)) {
    throw new GraphQLError("Имэйл хаяг буруу байна");
  }

  try {
    const rateLimitKey = `${RATE_LIMIT_KEY}${normalizedEmail}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      throw new GraphQLError(
        "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
        {
          extensions: { code: "TOO_MANY_REQUESTS" },
        },
      );
    }

    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW });
    } else {
      await redis.incr(rateLimitKey);
    }

    const token = uuidv4();
    await redis.set(`temp-token:${token}`, normalizedEmail, { ex: 600 });

    return { token };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Серверийн алдаа гарлаа", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
