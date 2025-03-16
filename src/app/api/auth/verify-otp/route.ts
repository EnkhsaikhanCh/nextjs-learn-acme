// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { UserModel } from "../../graphql/models";
import { connectToDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

const RATE_LIMIT_KEY = "rate_limit:verify-otp:";
const MAX_REQUESTS = 4; // Минутанд хамгийн их хүсэлт
const WINDOW = 60; // 1 минут (секундээр)

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const { email, otp } = await request.json();

    // Оролтын параметрүүдийг шалгах
    if (!email || !otp) {
      return NextResponse.json(
        { error: "И-мэйл болон OTP код шаардлагатай." },
        { status: 400 },
      );
    }

    // Rate limiting шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${email}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Хэт олон оролдлого. 1 минутын дараа дахин оролдоно уу." },
        { status: 429 },
      );
    }

    // Хүсэлтийн тоог шинэчлэх
    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW }); // Анхны хүсэлт
    } else {
      await redis.incr(rateLimitKey); // Тоог нэмэх
    }

    // Redis-ээс хадгалагдсан OTP-г авах
    const storedOtp = await redis.get(`otp:${email}`);

    // OTP-н оршин байгааг шалгах
    if (!storedOtp) {
      return NextResponse.json(
        { error: "OTP код олдсонгүй эсвэл хугацаа дууссан." },
        { status: 400 },
      );
    }

    // OTP таарч байгаа эсэхийг шалгах
    if (storedOtp !== otp) {
      return NextResponse.json(
        { error: "OTP код буруу байна." },
        { status: 400 },
      );
    }

    // Хэрэглэгчийн баталгаажуулалтын төлөвийг шинэчлэх
    const updateResult = await UserModel.updateOne(
      { email },
      { $set: { isVerified: true } },
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй эсвэл аль хэдийн баталгаажсан байна." },
        { status: 400 },
      );
    }

    // Redis-ээс OTP-г устгах
    await redis.del(`otp:${email}`);

    // Нэвтрэх токен үүсгэх ба хадгалах
    const signInToken = uuidv4();
    await redis.set(`signin-token:${signInToken}`, email, { ex: 300 }); // 5 минутын хугацаа

    // Амжилттай хариуг буцаах
    return NextResponse.json({
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken,
    });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
