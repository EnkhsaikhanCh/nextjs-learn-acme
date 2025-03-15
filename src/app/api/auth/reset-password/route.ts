// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";
import { connectToDatabase } from "@/lib/mongodb";
import { redis } from "@/lib/redis";

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
  } catch (error) {
    console.error("Серверийн алдаа:", error);

    // Ерөнхий алдааны хариу
    return NextResponse.json(
      { error: "Серверт алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
