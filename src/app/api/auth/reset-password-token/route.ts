// src/app/api/auth/reset-password-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
// import { sendEmail } from "../../../../lib/email";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../../graphql/models";
import { connectToDatabase } from "@/lib/mongodb";

const RATE_LIMIT_KEY = "rate_limit:reset-password-token:";
const MAX_REQUESTS = 5; // 1 цагт хамгийн ихдээ 5 хүсэлт
const WINDOW = 3600; // 1 цаг (секундээр)

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

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

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу." },
        { status: 429 },
      );
    }

    // Хүсэлтийн тоог нэмэх
    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW, nx: true }); // Анхны хүсэлт
    } else {
      await redis.incr(rateLimitKey); // Тоог нэмэх
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return NextResponse.json(
        {
          error:
            "Бүртгэлгүй имайл байна! Та имайл хаягаа шалгаад дахин оролдон уу.",
        },
        { status: 409 },
      );
    }

    // Шинэ токен үүсгэх
    const token = uuidv4();
    const expiry = 15 * 60; // 15 минут (секундээр)

    // Шинэ токенийг Redis-д хадгалах
    await redis.set(`reset-token:${token}`, email, { ex: expiry });

    // Reset URL үүсгэх
    // const baseUrl = process.env.VERCEL_URL
    //   ? `https://${process.env.VERCEL_URL}`
    //   : "http://localhost:3000";
    // const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Имэйл илгээх
    // await sendEmail({
    //   to: email,
    //   subject: "Нууц үг сэргээх холбоос",
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff; color: #333;">
    //       <h2 style="text-align: center; font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #222;">Нууц үг сэргээх</h2>
    //       <p style="font-size: 16px; text-align: center; margin-bottom: 30px;">
    //         Нууц үгээ сэргээхийн тулд доорх холбоос дээр дарна уу:
    //       </p>
    //       <div style="text-align: center;">
    //         <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: #fff; text-decoration: none; border-radius: 5px;">
    //           Нууц үг сэргээх
    //         </a>
    //       </div>
    //       <p style="font-size: 14px; text-align: center; margin-top: 20px; color: #666;">
    //         Энэ холбоос 15 минутын дотор хүчинтэй.
    //       </p>
    //       <p style="font-size: 12px; text-align: center; margin-top: 20px; color: #aaa;">
    //         Хэрэв та энэ хүсэлтийг илгээгээгүй бол үл тоомсорлоно уу.
    //       </p>
    //     </div>
    //   `,
    // });

    return NextResponse.json({ message: "Нууц үг сэргээх линк илгээгдлээ." });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
