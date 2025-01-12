// tests/token-utils.test.ts
import { generateSecureRefreshToken } from "../../../../src/app/api/graphql/utils/token-utils";

describe("generateSecureRefreshToken", () => {
  it("should generate a token as a string", () => {
    const token = generateSecureRefreshToken();
    expect(typeof token).toBe("string");
  });

  it("should generate a token with 128 hex characters", () => {
    const token = generateSecureRefreshToken();
    // 64 bytes in hex results in 128 characters
    expect(token).toHaveLength(128);
  });

  it("should generate a token that is hexadecimal", () => {
    const token = generateSecureRefreshToken();
    // A valid hexadecimal string should only contain 0-9 and a-f
    expect(token).toMatch(/^[0-9a-f]+$/);
  });

  it("should generate unique tokens on subsequent calls", () => {
    const tokens = new Set<string>();
    // Generate 10 tokens and ensure each is unique
    for (let i = 0; i < 10; i++) {
      tokens.add(generateSecureRefreshToken());
    }
    expect(tokens.size).toBe(10);
  });
});
