import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set.");
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error("Invalid encryption key length. Expected 32 bytes in hex.");
}

const ENCRYPTION_KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, "hex");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export const encryptData = (
  data: string,
): { encryptedData: string; iv: string; authTag: string } => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY_BUFFER, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return { encryptedData: encrypted, iv: iv.toString("hex"), authTag };
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data.");
  }
};
