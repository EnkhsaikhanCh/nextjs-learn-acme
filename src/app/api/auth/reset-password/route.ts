// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";
import { connectToDatabase } from "@/lib/mongodb";
import { redis } from "@/lib/redis";

const RATE_LIMIT_KEY = "rate_limit:reset-password:";
const MAX_REQUESTS = 3; // Цагт 3 удаа
const WINDOW = 3600; // 1 цаг (секундээр)

export async function POST(request: NextRequest) {
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

    // Нууц үгийг шинэчлэх
    const hashedPassword = await argon2.hash(password);
    const updateResult = await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } },
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй эсвэл алдаа гарлаа" },
        { status: 400 },
      );
    }

    // Токеныг устгах
    await redis.del(`reset-token:${token}`);

    return NextResponse.json({ message: "Нууц үг амжилттай шинэчлэгдлээ." });
  } catch {
    return NextResponse.json(
      { error: "Серверт алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
