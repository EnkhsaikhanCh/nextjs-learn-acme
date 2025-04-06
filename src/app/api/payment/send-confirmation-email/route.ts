import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { PaymentModel } from "../../graphql/models";

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: "Төлбөрийн ID шаардлагатай." },
        { status: 400 },
      );
    }

    // Төлбөрийн мэдээллийг хэрэглэгч болон сургалтын мэдээлэлтэй татаж авах
    const payment = await PaymentModel.findById(paymentId)
      .populate("userId courseId")
      .exec();

    if (!payment) {
      return NextResponse.json(
        { error: "Төлбөрийн мэдээлэл олдсонгүй." },
        { status: 404 },
      );
    }

    if (!payment.userId || !payment.userId.email) {
      return NextResponse.json(
        { error: "Хэрэглэгчийн имэйл олдсонгүй." },
        { status: 400 },
      );
    }

    if (payment.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Төлбөр баталгаажаагүй байна." },
        { status: 400 },
      );
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const courseURL = `${baseUrl}/dashboard/courses/${payment.courseId.slug}`;

    // **Имэйл илгээх**
    await sendEmail({
      to: payment.userId.email,
      subject: "Таны төлбөр амжилттай баталгаажлаа!",
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff; color: #333;">
  <!-- Title -->
  <h2 style="text-align: center; font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #222;">
    Төлбөр амжилттай баталгаажлаа!
  </h2>

  <!-- Info Text -->
  <p style="font-size: 16px; text-align: center; margin-bottom: 20px;">
    Сайн байна уу, <strong>${payment.userId.email}</strong>?
  </p>

  <p style="font-size: 15px; text-align: center; margin-bottom: 20px;">
    Та <strong>${payment.courseId.title}</strong> сургалтанд амжилттай бүртгэгдлээ. Одоо та сургалтдаа нэвтрэх боломжтой!
  </p>

  <!-- CTA Button -->
  <div style="text-align: center; margin-top: 24px;">
    <a href="${courseURL}" style="display: inline-block; padding: 12px 24px; background-color: #FACC14; color: black; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
      Сургалт руу очих
    </a>
  </div>

  <!-- Expiry Info -->
  <p style="font-size: 14px; text-align: center; margin-top: 20px; color: #666;">
    Бүртгэл 1 сарын хугацаанд хүчинтэй.
  </p>

  <!-- Support -->
  <p style="font-size: 12px; text-align: center; margin-top: 20px; color: #aaa;">
    Хэрэв танд асуудал гарвал <br>
    <a href="mailto:support@yourwebsite.com" style="color: #000000; text-decoration: none; font-weight: 500;">
      support@yourwebsite.com
    </a> хаягаар холбогдоно уу.
  </p>
</div>
      `,
    });

    return NextResponse.json({ message: "Имэйл амжилттай илгээгдлээ." });
  } catch {
    return NextResponse.json(
      { error: "Имэйл илгээхэд алдаа гарлаа." },
      { status: 500 },
    );
  }
}
