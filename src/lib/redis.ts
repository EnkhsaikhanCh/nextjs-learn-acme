// src/lib/redis.ts
import Redis from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";

const isDev = process.env.NODE_ENV === "development";

export const redis = isDev
  ? new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    })
  : new UpstashRedis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
