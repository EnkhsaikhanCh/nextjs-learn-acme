import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // Token байгаа эсэхийг шалгах
    if (!token) {
      return NextResponse.json(
        { error: "Token шаардлагатай" },
        { status: 400 },
      );
    }

    // Redis-с token-той холбоотой имэйлийг авах
    const email = await redis.get(`forgot-password-token:${token}`);

    // Token олдсон эсэх, хугацаа дуусаагүй эсэхийг шалгах
    if (!email) {
      return NextResponse.json(
        { error: "Token буруу эсвэл хугацаа дууссан" },
        { status: 400 },
      );
    }

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Token баталгаажуулахад алдаа гарлаа:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа." },
      { status: 500 },
    );
  }
}
