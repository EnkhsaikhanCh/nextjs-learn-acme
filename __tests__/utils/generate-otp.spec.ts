// __tests__/generateOTP.test.ts

import crypto from "crypto";
import { generateOTP } from "../../src/utils/generate-otp";

describe("generateOTP", () => {
  it("should generate a 6-digit OTP as a string", () => {
    // Mock crypto.randomInt to return a fixed value
    jest.spyOn(crypto, "randomInt").mockImplementation(() => 123456);

    const otp = generateOTP();
    expect(otp).toBe("123456");

    // Restore the original implementation
    jest.restoreAllMocks();
  });

  it("should generate a value within the 6-digit range", () => {
    const otp = generateOTP();
    expect(otp).toMatch(/^\d{6}$/); // Ensure the result is 6 digits
    const numericOtp = parseInt(otp, 10);
    expect(numericOtp).toBeGreaterThanOrEqual(100000);
    expect(numericOtp).toBeLessThanOrEqual(999999);
  });
});
