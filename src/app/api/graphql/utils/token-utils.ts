// utils/token-utils.ts
import crypto from "crypto";

/**
 * Generate a secure refresh token.
 * @returns {string} A secure random refresh token.
 */
export const generateSecureRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};
