// src/lib/redis.ts
import Redis, { RedisOptions } from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisUrl) {
  throw new Error("⚠️ REDIS_URL тохируулагдаагүй байна!");
}

if (
  (process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "preview") &&
  !redisPassword
) {
  throw new Error("⚠️ REDIS_PASSWORD тохируулагдаагүй байна!");
}

const redisOptions: RedisOptions = {
  lazyConnect: true, // Холболтыг эхний хүсэлтээр эхлүүлнэ
  maxRetriesPerRequest: 5, // Дахин оролдлогын тоог 5 болгох
  retryStrategy: (times) => Math.min(times * 100, 2000),
  connectTimeout: 10000, // Холболтын timeout-ийг 10 секунд болгох
  commandTimeout: 5000, // Коммандын timeout-ийг 5 секунд болгох
  enableOfflineQueue: process.env.NODE_ENV !== "production", // Prod-д offline queue ашиглахгүй
};

// **Staging & Production** орчинд TLS ашиглах
if (
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "preview"
) {
  redisOptions.password = redisPassword;
  redisOptions.tls = {
    rejectUnauthorized: true, // Redis SSL холболт
  };
}

export const redis = new Redis(redisUrl, redisOptions);

redis.on("error", (error) => {
  console.error("❌ Redis холболтын алдаа:", error);
});

redis.on("connect", () => {
  console.log(`✅ Redis сервертэй холбогдлоо: ${redisUrl}`);
});
