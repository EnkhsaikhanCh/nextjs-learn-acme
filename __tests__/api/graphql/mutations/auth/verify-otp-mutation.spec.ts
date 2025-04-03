import { redis } from "@/lib/redis";
import { UserModel } from "@/app/api/graphql/models";
import { v4 as uuidv4 } from "uuid";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { verifyOTP } from "@/app/api/graphql/resolvers/mutations";

jest.mock("../../../../../src/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../../../../../src/utils/validation", () => ({
  normalizeEmail: jest.fn(),
  validateEmail: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserModel: {
    updateOne: jest.fn(),
  },
}));

describe("verifyOTP", () => {
  const email = "test@example.com";
  const normalizedEmail = "test@example.com";
  const RATE_LIMIT_KEY = "rate_limit:verify-otp:";
  const MAX_REQUESTS = 4;
  const WINDOW = 60;
  const rateLimitKeyForEmail = `${RATE_LIMIT_KEY}${normalizedEmail}`;
  const otpKey = `otp:${normalizedEmail}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Existing tests…

  it("throws BAD_USER_INPUT if email or otp is missing", async () => {
    await expect(verifyOTP(null, { email: "", otp: "123456" })).rejects.toThrow(
      "И-мэйл болон OTP код шаардлагатай",
    );
    await expect(verifyOTP(null, { email, otp: "" })).rejects.toThrow(
      "И-мэйл болон OTP код шаардлагатай",
    );
  });

  it("throws BAD_USER_INPUT if normalized email is falsy", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(null);
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  it("throws BAD_USER_INPUT if validateEmail returns false", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(false);
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  it("throws TOO_MANY_REQUESTS if rate limit is exceeded", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue(String(MAX_REQUESTS));
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Хэт олон оролдлого. 1 минутын дараа дахин оролдоно уу.",
    );
  });

  it("throws BAD_REQUEST if no stored OTP is found", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // For rate limit key: simulate no current count, so key is set.
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce(null); // for OTP key
    (redis.set as jest.Mock).mockResolvedValue("OK");

    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "OTP код олдсонгүй эсвэл хугацаа дууссан.",
    );
  });

  it("throws BAD_REQUEST if provided OTP does not match stored OTP", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce("111111"); // stored OTP
    (redis.set as jest.Mock).mockResolvedValue("OK");

    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "OTP код буруу байна.",
    );
  });

  it("throws BAD_USER_INPUT if user update does not modify any document", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce("123456"); // for OTP key
    (redis.set as jest.Mock).mockResolvedValue("OK");
    (UserModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 0 });

    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Хэрэглэгч олдсонгүй эсвэл аль хэдийн баталгаажсан байна.",
    );
  });

  it("verifies OTP successfully and returns sign-in token", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // For rate limit: simulate no previous count (so branch: if (!currentCount) ...)
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce("123456"); // for OTP key
    (redis.set as jest.Mock).mockResolvedValue("OK");
    (UserModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });
    (redis.del as jest.Mock).mockResolvedValue("OK");
    (uuidv4 as jest.Mock).mockReturnValue("sign-token");
    // Ensure setting sign-in token resolves
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await verifyOTP(null, { email, otp: "123456" });
    expect(redis.del).toHaveBeenCalledWith(`otp:${normalizedEmail}`);
    expect(redis.set).toHaveBeenCalledWith(
      "signin-token:sign-token",
      normalizedEmail,
      { ex: 300 },
    );
    expect(result).toEqual({
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken: "sign-token",
    });
  });

  it("increments rate limit if current count exists but is below MAX_REQUESTS", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // Simulate that a rate limit key exists: first call returns "1" for rateLimitKey
    (redis.get as jest.Mock)
      .mockResolvedValueOnce("1") // for rateLimitKey
      .mockResolvedValueOnce("123456"); // for OTP key
    (redis.incr as jest.Mock).mockResolvedValue("2");
    (redis.set as jest.Mock).mockResolvedValue("OK");
    (UserModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });
    (redis.del as jest.Mock).mockResolvedValue("OK");
    (uuidv4 as jest.Mock).mockReturnValue("sign-token");
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await verifyOTP(null, { email, otp: "123456" });
    expect(redis.incr).toHaveBeenCalledWith(rateLimitKeyForEmail);
    expect(result).toEqual({
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken: "sign-token",
    });
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Internal server error",
    );
  });
});
