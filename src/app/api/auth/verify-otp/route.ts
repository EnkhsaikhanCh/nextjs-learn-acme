// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
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

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй." },
        { status: 404 },
      );
    }

    // OTP шалгалт
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: "OTP код буруу байна." },
        { status: 400 },
      );
    }

    if (Date.now() > user.otpExpiry) {
      return NextResponse.json(
        { error: "OTP кодын хугацаа дууссан байна." },
        { status: 400 },
      );
    }

    // Хэрэглэгчийн баталгаажуулалт хийх
    await UserModel.updateOne(
      { email },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpiry: "" }, // OTP болон хугацааг устгах
      },
    );

    return NextResponse.json({
      message: "И-мэйл амжилттай баталгаажлаа.",
    });
  } catch (error) {
    console.error("OTP баталгаажуулахад алдаа гарлаа:", error);
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
