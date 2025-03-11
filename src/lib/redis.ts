// src/lib/redis.ts
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL орчингийн тохиргооны файлд тохируулна уу.");
}

export const redis = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 5,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  enableOfflineQueue: process.env.NODE_ENV !== "production",
});

redis.on("error", (error) => {
  console.error("❌ Redis холболтын алдаа:", error);
});

redis.on("connect", () => {
  console.log(`✅ Redis сервертэй холбогдлоо: ${redisUrl}`);
});
