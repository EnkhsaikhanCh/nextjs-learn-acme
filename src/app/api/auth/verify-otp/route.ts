// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis"; // Redis клиент импортлох
import { UserModel } from "../../graphql/models";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "И-мэйл болон OTP код шаардлагатай." },
        { status: 400 },
      );
    }

    // Redis-с OTP кодыг авах
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return NextResponse.json(
        { error: "OTP код олдсонгүй эсвэл хугацаа дууссан." },
        { status: 400 },
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        { error: "OTP код буруу байна." },
        { status: 400 },
      );
    }

    // Хэрэглэгчийг баталгаажуулах
    await UserModel.updateOne({ email }, { $set: { isVerified: true } });

    // Redis-с OTP кодыг устгах
    await redis.del(`otp:${email}`);

    return NextResponse.json({
      message: "И-мэйл амжилттай баталгаажлаа.",
    });
  } catch (error) {
    console.error("OTP баталгаажуулахад алдаа гарлаа:", error);
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
