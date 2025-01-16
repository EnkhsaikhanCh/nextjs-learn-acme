// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { UserModel } from "../../graphql/models/user.model";
import crypto from "crypto";
import { sendEmail } from "../../../../lib/email";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "И-мэйл хаяг шаардлагатай." },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй." },
        { status: 404 },
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 5 * 60 * 1000; // 5 минутын хүчинтэй хугацаа

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Нууц үг сэргээх холбоос",
      html: `<p>Нууц үгээ сэргээхийн тулд дараах холбоос дээр дарна уу:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return NextResponse.json({ message: "Сэргээх холбоос илгээгдсэн." });
  } catch (error) {
    console.error("Серверт алдаа гарлаа:", error);
    return NextResponse.json(
      { error: "Серверт алдаа гарлаа." },
      { status: 500 },
    );
  }
}
