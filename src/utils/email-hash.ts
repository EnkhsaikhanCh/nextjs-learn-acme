import { createHash } from "crypto";

export const emailHash = (email: string): string => {
  return createHash("sha256").update(email).digest("hex");
};
