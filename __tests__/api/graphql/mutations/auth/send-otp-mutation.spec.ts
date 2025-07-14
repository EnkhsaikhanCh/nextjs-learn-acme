import { sendOTP } from "@/app/api/graphql/resolvers/mutations/auth/send-otp-mutation";
import { redis } from "@/lib/redis";
import { sendEmail } from "@/lib/email";
import { generateOTP } from "@/utils/generate-otp";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { emailHash } from "@/utils/email-hash";

jest.mock("../../../../../src/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  },
}));

jest.mock("../../../../../src/lib/email", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../../../../src/utils/generate-otp", () => ({
  generateOTP: jest.fn(),
}));

jest.mock("../../../../../src/utils/validation", () => ({
  normalizeEmail: jest.fn(),
  validateEmail: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("sendOTP", () => {
  const email = "test@example.com";
  const normalizedEmail = "test@example.com"; // assume normalization yields same value
  const hashedEmail = emailHash(normalizedEmail);
  const RATE_LIMIT_KEY = "rate_limit:send_otp:";
  const MAX_REQUESTS = 5;
  const WINDOW = 3600;
  const rateLimitKey = `${RATE_LIMIT_KEY}${normalizedEmail}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws BAD_USER_INPUT if email is not provided", async () => {
    await expect(sendOTP(null, { email: "" })).rejects.toThrow(
      "И-мэйл хаяг шаардлагатай",
    );
  });

  it("throws BAD_USER_INPUT if normalized email is falsy", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(null);
    await expect(sendOTP(null, { email })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  it("throws BAD_USER_INPUT if validateEmail returns false", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(false);
    await expect(sendOTP(null, { email })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  it("throws TOO_MANY_REQUESTS if rate limit is exceeded", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue(String(MAX_REQUESTS)); // currentCount equals MAX_REQUESTS
    await expect(sendOTP(null, { email })).rejects.toThrow(
      "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
    );
  });

  it("sets rate limit key and sends OTP if no current count exists", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue(null);
    // We don't need to mock uuid here since it's not used for OTP key
    (generateOTP as jest.Mock).mockReturnValue("123456");
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await sendOTP(null, { email });

    // Verify that the rate limit key is set to "1" with expiration WINDOW (3600 sec)
    expect(redis.set).toHaveBeenCalledWith(rateLimitKey, "1", { ex: WINDOW });
    // Verify that the OTP is stored with key "otp:test@example.com", value "123456", expiration 300 sec
    expect(redis.set).toHaveBeenCalledWith(`otp:${hashedEmail}`, "123456", {
      ex: 300,
    });
    // Verify that sendEmail was called
    expect(sendEmail).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: "OTP код амжилттай илгээгдлээ.",
    });
  });

  it("increments rate limit if current count exists but is below MAX_REQUESTS", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue("2");
    (generateOTP as jest.Mock).mockReturnValue("123456");
    (redis.incr as jest.Mock).mockResolvedValue("3");
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await sendOTP(null, { email });

    expect(redis.incr).toHaveBeenCalledWith(rateLimitKey);
    expect(redis.set).toHaveBeenCalledWith(`otp:${hashedEmail}`, "123456", {
      ex: 300,
    });
    expect(sendEmail).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: "OTP код амжилттай илгээгдлээ.",
    });
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await expect(sendOTP(null, { email })).rejects.toThrow(
      "Internal server error",
    );
  });
});
