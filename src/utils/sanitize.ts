// src/utils/sanitize.ts
import { escape, isLength } from "validator";

export const sanitizeInput = (
  input: string | undefined | null,
  maxLength: number = 255,
): string => {
  // Хэрэв утга байхгүй бол хоосон тэмдэгт буцаана
  if (!input) {
    return "";
  }

  const trimmedInput = input.trim();

  // Урт хязгаарыг шалгана (XSS болон бусад халдлагаас хамгаалах)
  if (!isLength(trimmedInput, { max: maxLength })) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  // HTML тусгай тэмдэгтүүдийг escape хийж, XSS-ээс хамгаална
  return escape(trimmedInput);
};
