// src/app/api/auth/verify-reset-token/route.ts
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_KEY = "rate_limit:verify-reset-token:";
const MAX_REQUESTS = 10; // Цагт 10 удаа
const WINDOW = 3600; // 1 цаг (секундээр)

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Токен байгаа эсэхийг шалгах
    if (!token) {
      return NextResponse.json(
        { error: "Token шаардлагатай" },
        { status: 400 },
      );
    }

    // Rate limiting шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${token}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу." },
        { status: 429 },
      );
    }

    // Хүсэлтийн тоог нэмэх
    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW }); // Анхны хүсэлт
    } else {
      await redis.incr(rateLimitKey); // Тоог нэмэх
    }

    // Токеноос имэйл авах
    const email = await redis.get(`reset-token:${token}`);
    if (!email) {
      return NextResponse.json(
        { error: "Token буруу эсвэл хугацаа дууссан" },
        { status: 400 },
      );
    }

    return NextResponse.json({ email });
  } catch {
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа." },
      { status: 500 },
    );
  }
}
