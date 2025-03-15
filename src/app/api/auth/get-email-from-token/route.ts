// src/app/api/auth/get-email-from-token/route.ts
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

const RATE_LIMIT_KEY = "rate_limit:get-email-from-token:"; // Rate limiting-ийн key
const MAX_REQUESTS = 10; // Цагт 10 удаа
const WINDOW = 3600; // 1 цаг (секундээр)

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token шаардлагатай" },
        { status: 400 },
      );
    }

    // Rate limiting шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${token}`; // Token дээр суурилсан key
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount) >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу." },
        { status: 429 },
      );
    }

    // Хүсэлтийн тоог нэмэх
    if (!currentCount) {
      await redis.set(rateLimitKey, 1, "EX", WINDOW); // Анхны хүсэлт
    } else {
      await redis.incr(rateLimitKey); // Тоог нэмэх
    }

    const email = await redis.get(`temp-token:${token}`);
    if (!email) {
      return NextResponse.json(
        { error: "Token буруу эсвэл хугацаа дууссан" },
        { status: 400 },
      );
    }

    return NextResponse.json({ email });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
