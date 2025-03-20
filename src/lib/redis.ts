// src/lib/redis.ts
import { Redis as UpstashRedis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

// Орчин тодорхойлох
const isProduction = process.env.VERCEL_ENV === "production";

// Redis URL болон токеныг орчноос хамааруулан сонгох
const redisUrl = isProduction
  ? process.env.REDIS_PROD_KV_REST_API_URL
  : process.env.UPSTASH_REDIS_REST_URL;

const redisToken = isProduction
  ? process.env.REDIS_PROD_KV_REST_API_TOKEN
  : process.env.UPSTASH_REDIS_REST_TOKEN;

// Хэрэв URL эсвэл токен байхгүй бол алдаа шидэх
if (!redisUrl || !redisToken) {
  throw new Error(
    `Required Upstash Redis environment variables are missing for ${
      isProduction ? "production" : "dev/preview"
    } environment (URL or TOKEN)`,
  );
}

// Upstash Redis клиент үүсгэх
export const redis = new UpstashRedis({
  url: redisUrl,
  token: redisToken,
});
