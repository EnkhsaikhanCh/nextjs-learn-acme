// utils/token-utils.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { RefreshTokenModel } from "../models";

/**
 * Generate a secure refresh token.
 * @returns {string} A secure random refresh token.
 */
export const generateSecureRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * Verify a JWT token.
 * @param {string} token - The token to verify.
 * @param {string} secret - The secret key to verify the token.
 * @returns {JwtPayload | null} The decoded payload if valid, or null if invalid.
 */
export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

/**
 * Decode a JWT token without verifying it.
 * @param {string} token - The token to decode.
 * @returns {JwtPayload | null} The decoded payload if valid, or null if invalid.
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

/**
 * Refresh the access token using a refresh token.
 * @param {string} refreshToken - The refresh token to validate.
 * @param {string} secret - The secret key to sign the new access token.
 * @returns {Promise<string>} The new access token.
 * @throws {Error} If the refresh token is invalid or expired.
 */
export const refreshAccessToken = async (
  refreshToken: string,
  secret: string,
): Promise<string> => {
  // Check if the refresh token exists in the database
  const existingToken = await RefreshTokenModel.findOne({
    token: refreshToken,
  });
  if (!existingToken) {
    throw new Error("Invalid Refresh Token");
  }

  // Generate a new access token
  const newAccessToken = jwt.sign(
    { _id: existingToken.user }, // Payload
    secret,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }, // Expiry
  );

  return newAccessToken;
};
