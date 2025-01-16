// src/app/api/auth/send-otp/route.ts
import { generateOTP } from "@/utils/generate-otp";
import { NextResponse } from "next/server";
import { UserModel } from "../../graphql/models";
import { sendEmail } from "@/lib/email";
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

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 минутын хүчинтэй

    const user = await UserModel.findOne({ email }).exec();

    if (user) {
      // Хэрэглэгч байгаа бол шинэчлэх
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    await sendEmail({
      to: email,
      subject: "Таны OTP код",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff; color: #333;">
          <h2 style="text-align: center; font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #222;">Таны OTP Код</h2>
          <p style="font-size: 16px; text-align: center; margin-bottom: 30px;">
            Дараах кодыг ашиглан үйлдлээ баталгаажуулна уу:
          </p>
          <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px 20px; border: 1px dashed #ddd; border-radius: 8px; background-color: #f9f9f9; color: #000;">
            ${otp}
          </div>
          <p style="font-size: 14px; text-align: center; margin-top: 20px; color: #666;">
            Код 5 минутын дотор хүчинтэй.
          </p>
          <p style="font-size: 12px; text-align: center; margin-top: 20px; color: #aaa;">
            Хэрэв та энэ имэйлийг санамсаргүйгээр хүлээн авсан бол үл тоомсорлоно уу.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP код амжилттай илгээгдлээ." });
  } catch (error) {
    console.error("OTP илгээхэд алдаа гарлаа:", error);
    return NextResponse.json({ error: "Алдаа гарлаа." }, { status: 500 });
  }
}
