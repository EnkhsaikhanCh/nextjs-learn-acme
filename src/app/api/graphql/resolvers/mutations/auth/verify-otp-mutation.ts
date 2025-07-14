import { GraphQLError } from "graphql";
import { redis } from "@/lib/redis";
import { UserV2Model } from "@/app/api/graphql/models";
import { v4 as uuidv4 } from "uuid";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { emailHash } from "@/utils/email-hash";

const RATE_LIMIT_KEY = "rate_limit:verify-otp:";
const MAX_REQUESTS = 4; // Maximum requests per minute
const WINDOW = 60; // 1 minute in seconds

export const verifyOTP = async (
  _: unknown,
  { email, otp }: { email: string; otp: string },
) => {
  if (!email || !otp) {
    throw new GraphQLError("И-мэйл болон OTP код шаардлагатай", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !validateEmail(normalizedEmail)) {
    throw new GraphQLError("Имэйл хаяг буруу байна", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const rateLimitKeyForEmail = `${RATE_LIMIT_KEY}${emailHash(normalizedEmail)}`;

  try {
    // Check rate limit
    const currentCount = await redis.get(rateLimitKeyForEmail);
    if (currentCount && parseInt(currentCount as string, 10) >= MAX_REQUESTS) {
      throw new GraphQLError(
        "Хэт олон оролдлого. 1 минутын дараа дахин оролдоно уу.",
        { extensions: { code: "TOO_MANY_REQUESTS" } },
      );
    }

    if (!currentCount) {
      await redis.set(rateLimitKeyForEmail, "1", { ex: WINDOW });
    } else {
      await redis.incr(rateLimitKeyForEmail);
    }

    // Retrieve the stored OTP from Redis
    const storedOtp = await redis.get(`otp:${emailHash(normalizedEmail)}`);
    if (!storedOtp) {
      throw new GraphQLError("OTP код олдсонгүй эсвэл хугацаа дууссан.", {
        extensions: { code: "BAD_REQUEST" },
      });
    }

    if (String(storedOtp) !== String(otp)) {
      return {
        success: false,
        message: "OTP код буруу байна.",
        signInToken: null,
      };
    }

    // Update the user's verification status in the database
    const updateResult = await UserV2Model.updateOne(
      { email: normalizedEmail },
      { $set: { isVerified: true } },
    );
    if (updateResult.modifiedCount === 0) {
      throw new GraphQLError(
        "Хэрэглэгч олдсонгүй эсвэл аль хэдийн баталгаажсан байна.",
        { extensions: { code: "BAD_REQUEST" } },
      );
    }

    // Delete the OTP from Redis now that it has been used
    await redis.del(`otp:${emailHash(normalizedEmail)}`);

    // Generate a sign-in token
    const signInToken = uuidv4();
    await redis.set(`signin-token:${signInToken}`, normalizedEmail, {
      ex: 300,
    }); // 5 minutes expiry

    return {
      success: true,
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken,
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
