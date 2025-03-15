// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { sendEmail } from "../../../../lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: "И-мэйл хаяг шаардлагатай." },
      { status: 400 },
    );
  }

  const token = uuidv4();
  const expiry = 15 * 60; // 15 минут

  // Redis-д 15 минутын хугацаатай хадгална
  await redis.set(`reset-token:${token}`, email, "EX", expiry);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Нууц үг сэргээх холбоос",
    html: `<p>Нууц үгээ сэргээхийн тулд дараах холбоос дээр дарна уу:</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  });

  return NextResponse.json({ message: "Нууц үг сэргээх линк илгээгдлээ." });
}
