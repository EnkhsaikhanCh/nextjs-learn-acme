// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Мэдээлэл дутуу байна." },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Токен хүчинтэй эсэхийг шалгах
    }).exec();

    if (!user) {
      return NextResponse.json(
        { error: "Токен хүчингүй эсвэл хугацаа дууссан." },
        { status: 400 },
      );
    }

    // Нууц үг шифрлэх ба хадгалах
    user.password = await argon2.hash(newPassword);
    user.resetToken = undefined; // Токеныг устгах
    user.resetTokenExpiry = undefined; // Хугацааг устгах

    await user.save();

    return NextResponse.json({ message: "Нууц үг амжилттай шинэчлэгдсэн." });
  } catch (error) {
    console.error("Серверийн алдаа:", error);

    // Ерөнхий алдааны хариу
    return NextResponse.json(
      { error: "Серверт алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
