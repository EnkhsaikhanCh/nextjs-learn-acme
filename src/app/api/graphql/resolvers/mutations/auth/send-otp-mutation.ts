import { GraphQLError } from "graphql";
import { redis } from "@/lib/redis";
import { sendEmail } from "@/lib/email";
import { generateOTP } from "@/utils/generate-otp";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { emailHash } from "@/utils/email-hash";

const RATE_LIMIT_KEY = "rate_limit:send_otp:";
const MAX_REQUESTS = 5;
const WINDOW = 3600;

export const sendOTP = async (_: unknown, { email }: { email: string }) => {
  if (!email) {
    throw new GraphQLError("И-мэйл хаяг шаардлагатай", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !validateEmail(normalizedEmail)) {
    throw new GraphQLError("Имэйл хаяг буруу байна", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    const rateLimitKey = `${RATE_LIMIT_KEY}${normalizedEmail}`;
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      throw new GraphQLError(
        "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
        { extensions: { code: "TOO_MANY_REQUESTS" } },
      );
    }

    if (!currentCount) {
      await redis.set(rateLimitKey, "1", { ex: WINDOW });
    } else {
      await redis.incr(rateLimitKey);
    }

    const otp = generateOTP();

    await sendEmail({
      to: normalizedEmail,
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
    await redis.set(`otp:${emailHash(normalizedEmail)}`, otp, {
      ex: otpExpiry,
    });

    return {
      success: true,
      message: "OTP код амжилттай илгээгдлээ.",
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
