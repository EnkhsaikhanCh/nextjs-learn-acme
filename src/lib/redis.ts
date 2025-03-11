// src/lib/redis.ts
import Redis, { RedisOptions } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("⚠️ REDIS_URL тохируулагдаагүй байна!");
}

const redisOptions: RedisOptions = {
  lazyConnect: true, // Холболтыг эхний хүсэлтээр эхлүүлнэ
  maxRetriesPerRequest: 5,
  retryStrategy: (times) => Math.min(times * 100, 2000),
  connectTimeout: 10000,
  commandTimeout: 5000,
  enableOfflineQueue: process.env.NODE_ENV !== "production", // Prod-д false
};

// Staging & Production-д TLS болон password тохируулах
if (
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "preview"
) {
  redisOptions.tls = {
    rejectUnauthorized: true, // Redis Cloud TLS-ийн хувьд зөв
  };
  // REDIS_URL-д username ба password аль хэдийн багтсан тул redisPassword-г хасах эсвэл шалгах
  if (
    process.env.REDIS_PASSWORD &&
    !redisUrl.includes(process.env.REDIS_PASSWORD)
  ) {
    redisOptions.password = process.env.REDIS_PASSWORD;
  }
}

export const redis = new Redis(redisUrl, redisOptions);

redis.on("error", (error) => {
  console.error("❌ Redis холболтын алдаа:", error);
});

redis.on("connect", () => {
  console.log(`✅ Redis сервертэй холбогдлоо: ${redisUrl}`);
});

// Холболтыг шалгах (заавал биш)
redis.connect().catch((err) => {
  console.error("❌ Redis эхний холболт амжилтгүй:", err);
});
