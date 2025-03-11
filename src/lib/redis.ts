// src/lib/redis.ts
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL орчингийн тохиргооны файлд тохируулна уу.");
}

export const redis = new Redis(redisUrl);
