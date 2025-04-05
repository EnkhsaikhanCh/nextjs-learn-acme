// src/app/api/email/admin/verify-payment/route.ts
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import dotenv from "dotenv";
dotenv.config();

export async function POST(request: Request) {
  try {
    const { paymentId, userEmail, courseTitle, transactionNote } =
      await request.json();

    if (!paymentId || !userEmail || !courseTitle || !transactionNote) {
      return NextResponse.json(
        { error: "Мэдээлэл дутуу байна." },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

    await sendEmail({
      to: adminEmail,
      subject: "Төлбөр шалгах хүсэлт ирлээ",
      html: `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
  <div style="text-align: center; margin-bottom: 32px;">
    <div style="background: #f0f2f5; width: 48px; height: 48px; border-radius: 10px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
      <svg style="width: 24px; height: 24px; color: #2d3436;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; margin: 0;">
      Төлбөр шалгах хүсэлт
    </h2>
  </div>

  <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
      <div>
        <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">Хэрэглэгч</div>
        <div style="font-size: 14px; color: #2d3436; font-weight: 500;">${userEmail}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">Сургалт</div>
        <div style="font-size: 14px; color: #2d3436; font-weight: 500;">${courseTitle}</div>
      </div>
    </div>
    
    <div>
      <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">Төлбөрийн утга</div>
      <div style="font-size: 14px; color: #2d3436; font-weight: 500;">${transactionNote}</div>
    </div>
  </div>

  <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eceff1;">
    <p style="font-size: 13px; color: #6c757d; line-height: 1.5; margin: 0;">
      Системд нэвтрэн шалгаж баталгаажуулна уу.
    </p>
    <a href="#" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #2d3436; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
      Шалгах
    </a>
  </div>
</div>
    `,
    });

    return NextResponse.json({ message: "Админ руу имэйл илгээгдлээ." });
  } catch {
    return NextResponse.json(
      { error: "Имэйл илгээхэд алдаа гарлаа." },
      { status: 500 },
    );
  }
}
