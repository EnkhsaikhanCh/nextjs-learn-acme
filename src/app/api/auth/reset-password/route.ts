// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";
import { connectToDatabase } from "@/lib/mongodb";
import { redis } from "@/lib/redis";

const RATE_LIMIT_KEY = "rate_limit:reset-password:"; // Rate limiting-ийн key
const MAX_REQUESTS = 3; // Цагт 3 удаа
const WINDOW = 3600; // 1 цаг (секундээр)

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token болон нууц үг шаардлагатай" },
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

    // Одоо байгаа логик
    const email = await redis.get(`reset-token:${token}`);
    if (!email) {
      return NextResponse.json(
        { error: "Token буруу эсвэл хугацаа дууссан" },
        { status: 400 },
      );
    }

    const hashedPassword = await argon2.hash(password);
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } },
    );
    await redis.del(`reset-token:${token}`);

    return NextResponse.json({ message: "Нууц үг амжилттай шинэчлэгдлээ." });
  } catch {
    return NextResponse.json(
      { error: "Серверт алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
