// src/lib/redis.ts
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL орчингийн тохиргооны файлд тохируулна уу.");
}

export const redis = new Redis(redisUrl, {
  lazyConnect: true, // Анхны хүсэлтээр холбогдоно
  maxRetriesPerRequest: 5, // Холболтын оролдлогын дээд хэмжээ
  retryStrategy: (times) => Math.min(times * 100, 2000), // Холболтын алдаанд дахин оролдлогын стратеги
  enableOfflineQueue: process.env.NODE_ENV !== "production", // Prod орчинд offline queue идэвхгүй
});

// Redis холболтын амжилттай байдал болон алдааг логлох
redis.on("connect", () => {
  console.log(`✅ Redis сервертэй холбогдлоо: ${redisUrl}`);
});

redis.on("error", (error) => {
  console.error("❌ Redis холболтын алдаа:", error);
});

// Холболтыг шууд эхлүүлэх, алдаа шалгах
redis.connect().catch((err) => {
  console.error("❌ Redis эхний холболт амжилтгүй:", err);
});
