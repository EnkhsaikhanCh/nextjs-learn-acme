import { redis } from "@/lib/redis";
import { emailHash } from "@/utils/email-hash";
import { v4 as uuidv4 } from "uuid";

const RATE_LIMIT_KEY = "rate_limit:generate_temp_token:";
const MAX_REQUESTS = 5;
const WINDOW = 3600; // 1 hour in seconds

export async function generateTempTokenService(email: string) {
  if (!email) {
    throw new Error("И-мэйл хаяг шаардлагатай");
  }

  try {
    const rateLimitKey = `${RATE_LIMIT_KEY}${emailHash(email)}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      throw new Error("Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.");
    }

    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW });
    } else {
      await redis.incr(rateLimitKey);
    }

    const token = uuidv4();
    await redis.set(`temp-token:${token}`, email, { ex: 300 });

    return token;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `generateTempTokenService алдаа: ${error.message}`
        : "generateTempTokenService: Серверийн алдаа гарлаа",
    );
  }
}
