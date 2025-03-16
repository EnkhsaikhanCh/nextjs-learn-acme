// src/app/api/rate-limit.ts
import { NextResponse } from "next/server";
import { ipAddress } from "@vercel/edge";
import { redis } from "@/lib/redis";

export const runtime = "edge";

export async function POST(request: Request) {
  const ip = ipAddress(request) || "unknown";
  const { key, maxRequests, window } = await request.json();

  const rateLimitKey = `rate_limit:${key}:${ip}`;
  const currentCount = await redis.get(rateLimitKey);

  if (currentCount && parseInt(currentCount) >= maxRequests) {
    return NextResponse.json(
      { error: "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.", ip },
      { status: 429 },
    );
  }

  if (!currentCount) {
    await redis.set(rateLimitKey, 1, "EX", window);
  } else {
    await redis.incr(rateLimitKey);
  }

  return NextResponse.json({ success: true, ip });
}
