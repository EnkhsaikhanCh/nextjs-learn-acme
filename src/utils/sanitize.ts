// src/utils/sanitize.ts
import { escape } from "validator";

export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) return "";
  return escape(input.trim().toLowerCase());
};
