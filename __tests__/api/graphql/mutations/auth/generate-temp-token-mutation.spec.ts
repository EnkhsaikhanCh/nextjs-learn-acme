import { generateTempToken } from "@/app/api/graphql/resolvers/mutations";
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import { validateEmail } from "@/utils/validation";
import { normalizeEmail } from "@/utils/validation";

// Mock dependencies
jest.mock("../../../../../src/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../../../../../src/utils/validation", () => ({
  normalizeEmail: jest.fn(),
  validateEmail: jest.fn(),
}));

describe("generateTempToken", () => {
  const email = "test@example.com";
  const normalizedEmail = "test@example.com"; // assume normalization yields same value
  const rateLimitKey = `rate_limit:generate-temp-token:${normalizedEmail}`;
  const tempTokenKeyPrefix = "temp-token:";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws BAD_USER_INPUT if email is not provided", async () => {
    await expect(generateTempToken(null, { email: "" })).rejects.toThrow(
      "И-мэйл хаяг шаардлагатай",
    );
  });

  it("throws BAD_USER_INPUT if normalized email is falsy", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(null);
    await expect(generateTempToken(null, { email })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  it("throws an error if email is invalid", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(false);
    await expect(generateTempToken(null, { email })).rejects.toThrow(
      "Имэйл хаяг буруу байна",
    );
  });

  it("throws TOO_MANY_REQUESTS if rate limit is exceeded", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue(String(5)); // MAX_REQUESTS = 5
    await expect(generateTempToken(null, { email })).rejects.toThrow(
      "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
    );
  });

  it("sets rate limit key if no current count", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue(null);
    (uuidv4 as jest.Mock).mockReturnValue("generated-token");
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await generateTempToken(null, { email });
    expect(redis.set).toHaveBeenCalledWith(rateLimitKey, "1", { ex: 3600 });
    expect(redis.set).toHaveBeenCalledWith(
      `${tempTokenKeyPrefix}generated-token`,
      normalizedEmail,
      { ex: 600 },
    );
    expect(result).toEqual({ token: "generated-token" });
  });

  it("increments rate limit if current count exists but is below MAX_REQUESTS", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockResolvedValue("2");
    (uuidv4 as jest.Mock).mockReturnValue("generated-token");
    (redis.incr as jest.Mock).mockResolvedValue("3");
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await generateTempToken(null, { email });
    expect(redis.incr).toHaveBeenCalledWith(rateLimitKey);
    expect(redis.set).toHaveBeenCalledWith(
      `${tempTokenKeyPrefix}generated-token`,
      normalizedEmail,
      { ex: 600 },
    );
    expect(result).toEqual({ token: "generated-token" });
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (redis.get as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await expect(generateTempToken(null, { email })).rejects.toThrow(
      "Серверийн алдаа гарлаа",
    );
  });
});
