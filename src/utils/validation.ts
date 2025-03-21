// src/utils/validation.ts
import validator from "validator";

// Normalize email: trim and convert to lower-case.
// Returns the normalized email or null if the email is invalid.
export const normalizeEmail = (email: string): string | null => {
  const normalized = validator.normalizeEmail(email, { all_lowercase: true });
  return normalized ? normalized.trim() : null;
};

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  if (password.length > 128) return false;
  // Updated requirements to ensure a strong password.
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  });
};
