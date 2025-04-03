import { getEmailFromToken } from "@/app/api/graphql/resolvers/queries";
import { redis } from "@/lib/redis";

jest.mock("../../../../../src/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  },
}));

describe("getEmailFromToken", () => {
  const token = "test-token";
  const RATE_LIMIT_KEY = "rate_limit:get-email-from-token:";
  const MAX_REQUESTS = 10;
  const WINDOW = 3600;
  const rateLimitKeyForEmail = `${RATE_LIMIT_KEY}${token}`;
  const tempTokenKey = `temp-token:${token}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Missing token
  it("throws BAD_USER_INPUT if token is not provided", async () => {
    await expect(getEmailFromToken(null, { token: "" })).rejects.toThrow(
      "Token шаардлагатай",
    );
  });

  // 2. Rate limit exceeded
  it("throws TOO_MANY_REQUESTS if rate limit is exceeded", async () => {
    // Simulate rate limit reached
    (redis.get as jest.Mock).mockResolvedValue(String(MAX_REQUESTS));
    await expect(getEmailFromToken(null, { token })).rejects.toThrow(
      "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу.",
    );
  });

  // 3. No current count: should set rate limit key
  it("sets rate limit key if no current count exists", async () => {
    // For the rate limit key, simulate no current count
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey
      .mockResolvedValueOnce("user@example.com"); // for temp-token key
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const result = await getEmailFromToken(null, { token });
    expect(redis.set).toHaveBeenCalledWith(rateLimitKeyForEmail, "1", {
      ex: WINDOW,
    });
    expect(result).toEqual({ email: "user@example.com" });
  });

  // 4. Current count exists (below MAX_REQUESTS): should increment rate limit key
  it("increments rate limit if current count exists but is below MAX_REQUESTS", async () => {
    (redis.get as jest.Mock)
      .mockResolvedValueOnce("3") // for rateLimitKey, current count exists (e.g., "3")
      .mockResolvedValueOnce("user@example.com"); // for temp-token key
    (redis.incr as jest.Mock).mockResolvedValue("4");

    const result = await getEmailFromToken(null, { token });
    expect(redis.incr).toHaveBeenCalledWith(rateLimitKeyForEmail);
    expect(result).toEqual({ email: "user@example.com" });
  });

  // 5. No stored OTP found
  it("throws BAD_REQUEST if no stored OTP is found", async () => {
    (redis.get as jest.Mock)
      .mockResolvedValueOnce(null) // for rateLimitKey (simulate new request)
      .mockResolvedValueOnce(null); // for temp-token key (OTP not found)
    (redis.set as jest.Mock).mockResolvedValue("OK");

    await expect(getEmailFromToken(null, { token })).rejects.toThrow(
      "Token буруу эсвэл хугацаа дууссан",
    );
  });

  // 6. Successful retrieval of email
  it("returns email if token is found", async () => {
    (redis.get as jest.Mock)
      .mockResolvedValueOnce("3") // for rateLimitKey
      .mockResolvedValueOnce("user@example.com"); // for temp-token key
    (redis.incr as jest.Mock).mockResolvedValue("4");

    const result = await getEmailFromToken(null, { token });
    expect(result).toEqual({ email: "user@example.com" });
  });

  // 7. Unexpected error
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (redis.get as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    await expect(getEmailFromToken(null, { token })).rejects.toThrow(
      "Internal server error",
    );
  });
});
