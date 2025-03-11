// src/lib/redis.ts
import Redis, { RedisOptions } from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("⚠️ REDIS_URL тохируулагдаагүй байна!");
}

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production" ||
  process.env.VERCEL_ENV === "preview";

const redisOptions: RedisOptions = {
  lazyConnect: true,
  retryStrategy: (times: number) => Math.min(times * 100, 2000),
  connectTimeout: 10000,
  ...(isProduction && {
    enableOfflineQueue: false,
    tls: { rejectUnauthorized: true },
  }),
};

export const redis = new Redis(redisUrl, redisOptions);

// Холболтын алдааг нарийвчлан бүртгэх
redis.on("error", (error) => {
  console.error("❌ Redis холболтын алдаа:", error.message);
  console.log("Redis статус:", redis.status);
});

// Холболт амжилттай болсныг бүртгэх
redis.on("connect", () => {
  console.log(`✅ Redis сервертэй холбогдлоо: ${redisUrl}`);
});

// Холболтыг гараар эхлүүлэх
redis.connect().catch((err) => {
  console.error("❌ Redis эхний холболт амжилтгүй:", err);
});
