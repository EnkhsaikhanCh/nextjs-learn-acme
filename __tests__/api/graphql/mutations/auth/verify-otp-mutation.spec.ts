import { redis } from "@/lib/redis";
import { UserV2Model } from "@/app/api/graphql/models";
import { v4 as uuidv4 } from "uuid";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { verifyOTP } from "@/app/api/graphql/resolvers/mutations/auth/verify-otp-mutation";

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
  UserV2Model: {
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

  // 1. Missing email or OTP
  it("throws BAD_USER_INPUT if email or otp is missing", async () => {
    await expect(verifyOTP(null, { email: "", otp: "123456" })).rejects.toThrow(
      "И-мэйл болон OTP код шаардлагатай",
    );
    await expect(verifyOTP(null, { email, otp: "" })).rejects.toThrow(
      "И-мэйл болон OTP код шаардлагатай",
    );
  });

  // 2. Invalid email: normalization returns falsy
  it("throws BAD_USER_INPUT if normalized email is falsy", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(null);
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  // 3. Invalid email: validateEmail returns false
  it("throws BAD_USER_INPUT if validateEmail returns false", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(false);
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  // 4. Rate limit exceeded
  it("throws TOO_MANY_REQUESTS if rate limit is exceeded", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue(String(MAX_REQUESTS));
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Хэт олон оролдлого. 1 минутын дараа дахин оролдоно уу.",
    );
  });

  // 5. No stored OTP found
  it("throws BAD_REQUEST if no stored OTP is found", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // For rate limit key, simulate no current count (will set key)
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce(null); // for otp key
    (redis.set as jest.Mock).mockResolvedValue("OK");

    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "OTP код олдсонгүй эсвэл хугацаа дууссан.",
    );
  });

  // 6. OTP mismatch returns failure object (doesn't throw)
  it("returns failure object if provided OTP does not match stored OTP", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // For rate limit, simulate new key (no current count)
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey, so key is set
      .mockResolvedValueOnce("111111"); // for otp key, stored OTP
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await verifyOTP(null, { email, otp: "123456" });
    expect(result).toEqual({
      success: false,
      message: "OTP код буруу байна.",
      signInToken: null,
    });
  });

  // 7. User update failure
  it("throws BAD_USER_INPUT if user update does not modify any document", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // For rate limit: simulate no current count
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce("123456"); // for otp key
    (redis.set as jest.Mock).mockResolvedValue("OK");
    // Simulate update failure: modifiedCount equals 0
    (UserV2Model.updateOne as jest.Mock).mockResolvedValue({
      modifiedCount: 0,
    });

    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Хэрэглэгч олдсонгүй эсвэл аль хэдийн баталгаажсан байна.",
    );
  });

  // 8. Successful verification
  it("verifies OTP successfully and returns sign-in token", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // For rate limit: simulate no previous count (so branch: if (!currentCount))
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce("123456"); // for OTP key
    (redis.set as jest.Mock).mockResolvedValue("OK");
    (UserV2Model.updateOne as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
    });
    (redis.del as jest.Mock).mockResolvedValue("OK");
    (uuidv4 as jest.Mock).mockReturnValue("sign-token");
    // Simulate setting the sign-in token resolves OK
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await verifyOTP(null, { email, otp: "123456" });
    expect(redis.del).toHaveBeenCalledWith(`otp:${normalizedEmail}`);
    expect(redis.set).toHaveBeenCalledWith(
      "signin-token:sign-token",
      normalizedEmail,
      { ex: 300 },
    );
    expect(result).toEqual({
      success: true,
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken: "sign-token",
    });
  });

  // 9. Rate limit branch: increments count if current count exists but below MAX_REQUESTS
  it("increments rate limit if current count exists but is below MAX_REQUESTS", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    // Simulate existing count (e.g., "2")
    (redis.get as jest.Mock)
      .mockResolvedValueOnce("2") // for rateLimitKey
      .mockResolvedValueOnce("123456"); // for OTP key
    (redis.incr as jest.Mock).mockResolvedValue("3");
    (redis.set as jest.Mock).mockResolvedValue("OK");
    (UserV2Model.updateOne as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
    });
    (redis.del as jest.Mock).mockResolvedValue("OK");
    (uuidv4 as jest.Mock).mockReturnValue("sign-token");
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await verifyOTP(null, { email, otp: "123456" });
    expect(redis.incr).toHaveBeenCalledWith(rateLimitKeyForEmail);
    expect(result).toEqual({
      success: true,
      message: "И-мэйл амжилттай баталгаажлаа.",
      signInToken: "sign-token",
    });
  });

  // 10. Unexpected error handling
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    await expect(verifyOTP(null, { email, otp: "123456" })).rejects.toThrow(
      "Internal server error",
    );
  });
});
