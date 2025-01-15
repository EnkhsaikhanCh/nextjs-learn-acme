// src/utils/sanitize.ts
import { escape } from "validator";

export const sanitizeInput = (input: string): string => {
  return escape(input);
};
