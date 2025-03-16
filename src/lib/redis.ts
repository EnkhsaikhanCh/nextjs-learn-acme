// src/lib/redis.ts
import Redis from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";

if (
  !isDev &&
  (!(isPreview
    ? process.env.UPSTASH_REDIS_REST_URL
    : process.env.REDIS_PROD_KV_REST_API_URL) ||
    !(isPreview
      ? process.env.UPSTASH_REDIS_REST_TOKEN
      : process.env.REDIS_PROD_KV_REST_API_TOKEN))
) {
  throw new Error(
    "Required Redis environment variables (URL or TOKEN) are missing",
  );
}

export const redis = isDev
  ? new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    })
  : new UpstashRedis({
      url: isPreview
        ? process.env.UPSTASH_REDIS_REST_URL
        : process.env.REDIS_PROD_KV_REST_API_URL,
      token: isPreview
        ? process.env.UPSTASH_REDIS_REST_TOKEN
        : process.env.REDIS_PROD_KV_REST_API_TOKEN,
    });
