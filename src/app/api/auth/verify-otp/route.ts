// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { UserModel } from "../../graphql/models";
import { connectToDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

// Хязгаарлалтын тогтмолууд
const RATE_LIMIT_KEY = "rate_limit:verify-otp:"; // Хязгаарлалтын түлхүүрийн угтвар
const MAX_REQUESTS = 4; // Минутанд хамгийн их хүсэлт
const WINDOW = 60; // Цагийн хугацаа секундээр (1 минут)

// OTP баталгаажуулалтын POST хандлага
export async function POST(request: Request) {
  // Алхам 1: Мэдээллийн сантай холбогдох
  await connectToDatabase();

  try {
    // Алхам 2: Хүсэлтийн биеэс имэйл болон OTP-г авах
    const { email, otp } = await request.json();

    // Алхам 3: Оролтын параметрүүдийг шалгах
    if (!email || !otp) {
      return NextResponse.json(
        { error: "И-мэйл болон OTP код шаардлагатай." },
        { status: 400 },
      );
    }

    // Алхам 4: Хязгаарлалтыг шалгах
    const rateLimitKey = `${RATE_LIMIT_KEY}${email}`; // Имэйл дээр суурилсан өвөрмөц түлхүүр
    const currentCount = await redis.get(rateLimitKey); // Одоогийн хүсэлтийн тоог авах

    // Алхам 5: Хязгаарыг хэтрүүлсэн бол хязгаарлах
    if (currentCount && parseInt(currentCount as string) >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Хэт олон оролдлого. 1 минутын дараа дахин оролдоно уу." },
        { status: 429 },
      );
    }

    // Алхам 6: Хязгаарлалтын тоолуурыг шинэчлэх
    if (!currentCount) {
      // Эхний хүсэлтийн хувьд хугацаатай тоог эхлүүлэх
      await redis.set(rateLimitKey, 1, "EX", WINDOW);
    } else {
      // Одоо байгаа тоог нэмэх
      await redis.incr(rateLimitKey);
    }

    // Алхам 7: Redis-ээс хадгалагдсан OTP-г авах
    const storedOtp = await redis.get(`otp:${email}`);

    // Алхам 8: OTP-н оршин байгааг шалгах
    if (!storedOtp) {
      return NextResponse.json(
        { error: "OTP код олдсонгүй эсвэл хугацаа дууссан." },
        { status: 400 },
      );
    }

    // Алхам 9: OTP таарч байгаа эсэхийг шалгах
    if (storedOtp !== otp) {
      return NextResponse.json(
        { error: "OTP код буруу байна." },
        { status: 400 },
      );
    }

    // Алхам 10: Хэрэглэгчийн баталгаажуулалтын төлөвийг шинэчлэх
    await UserModel.updateOne({ email }, { $set: { isVerified: true } });

    // Алхам 11: Redis-ээс OTP-г устгах
    await redis.del(`otp:${email}`);

    // Алхам 12: Нэвтрэх токен үүсгэх ба хадгалах
    const signInToken = uuidv4();
    await redis.set(`signin-token:${signInToken}`, email, "EX", 300); // 5 минутын хугацаа

    // Алхам 13: Амжилттай хариуг буцаах
    return NextResponse.json({
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken,
    });
  } catch {
    // Алхам 14: Алдааг боловсруулах
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
