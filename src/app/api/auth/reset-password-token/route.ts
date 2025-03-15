// src/app/api/auth/reset-password-token/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { sendEmail } from "../../../../lib/email";
import { v4 as uuidv4 } from "uuid";

const RATE_LIMIT_KEY = "rate_limit:reset-password-token:"; // Имэйл тус бүрт rate limit-ийн key
const MAX_REQUESTS = 5; // 1 цагт хамгийн ихдээ 5 хүсэлт
const WINDOW = 3600; // 1 цаг (секундээр)

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Имэйл байгаа эсэхийг шалгах
    if (!email) {
      return NextResponse.json(
        { error: "И-мэйл хаяг шаардлагатай." },
        { status: 400 },
      );
    }

    // Rate limiting шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${email}`;
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

    // Шинэ токен үүсгэх
    const token = uuidv4();
    const expiry = 15 * 60; // 15 минут

    // Шинэ токенийг Redis-д хадгалах (хуучин токенийг устгахгүй)
    await redis.set(`reset-token:${token}`, email, "EX", expiry);

    // Reset URL үүсгэх
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Имэйл илгээх
    await sendEmail({
      to: email,
      subject: "Нууц үг сэргээх холбоос",
      html: `<p>Нууц үгээ сэргээхийн тулд дараах холбоос дээр дарна уу:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return NextResponse.json({ message: "Нууц үг сэргээх линк илгээгдлээ." });
  } catch (error) {
    console.error("Reset password token error:", error);
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
