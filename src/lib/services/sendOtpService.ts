import { redis } from "@/lib/redis";
import { generateOTP } from "@/utils/generate-otp";
import { sendEmail } from "@/lib/email";
import { emailHash } from "@/utils/email-hash";

const RATE_LIMIT_KEY = "rate_limit:send_otp:";
const MAX_REQUESTS = 5;
const WINDOW = 3600; // 1 hour in seconds

export const sendOtpService = async (email: string) => {
  if (!email) {
    throw new Error("И-мэйл хаяг шаардлагатай");
  }

  try {
    const rateLimitKey = `${RATE_LIMIT_KEY}${emailHash(email)}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      throw new Error("Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.");
    }

    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW });
    } else {
      await redis.incr(rateLimitKey);
    }

    const otp = generateOTP();

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

    const otpExpiry = 5 * 60;
    await redis.set(`otp:${emailHash(email)}`, otp, { ex: otpExpiry });

    return true;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `sendOtpService алдаа: ${error.message}`
        : "sendOtpService: Серверийн алдаа гарлаа",
    );
  }
};
