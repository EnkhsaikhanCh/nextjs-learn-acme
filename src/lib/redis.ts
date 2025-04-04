// src/lib/redis.ts
import { Redis as UpstashRedis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error(
    `Required Upstash Redis environment variables are missing (URL or TOKEN)`,
  );
}

// Upstash Redis клиент үүсгэх
export const redis = new UpstashRedis({
  url: redisUrl,
  token: redisToken,
});
