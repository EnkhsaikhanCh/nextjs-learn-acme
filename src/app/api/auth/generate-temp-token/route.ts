// src/app/api/auth/generate-temp-token/route.ts
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const RATE_LIMIT_KEY = "rate_limit:generate-temp-token:";
const MAX_REQUESTS = 10;
const WINDOW = 3600;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const token = uuidv4();

    // Rate limit шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${email}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount) >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Хэт их хүсэлт. 1 цагийн дараа дахин оролдоно уу." },
        { status: 429 },
      );
    }

    // Хүсэлтийн тоог нэмэх
    if (!currentCount) {
      await redis.set(rateLimitKey, 1, "EX", WINDOW); // Анхны хүсэлт
    } else {
      await redis.incr(rateLimitKey); // Тоог нэмэх
    }

    // Redis-д 10 минутын хугацаатай хадгална
    await redis.set(`temp-token:${token}`, email, "EX", 600);
    return Response.json({ token });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
