// src/app/api/auth/generate-temp-token/route.ts
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server"; // NextRequest ашиглах
import { v4 as uuidv4 } from "uuid";

const RATE_LIMIT_KEY = "rate_limit:generate-temp-token:";
const MAX_REQUESTS = 10;
const WINDOW = 3600;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "И-мэйл хаяг шаардлагатай" },
        { status: 400 },
      );
    }

    // Rate limit шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${email}`;
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

    // Токен үүсгэх
    const token = uuidv4();

    // Redis-д 10 минутын хугацаатай хадгалах
    await redis.set(`temp-token:${token}`, email, { ex: 600 });

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
