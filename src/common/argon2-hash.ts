import argon2 from "argon2";

export const hashData = async (data: string): Promise<string> => {
  try {
    const salt = process.env.FIXED_SALT;
    if (!salt) {
      throw new Error("FIXED_SALT environment variable is not set");
    }
    const saltBuffer = Buffer.from(salt);

    const hashedData = await argon2.hash(data, {
      type: argon2.argon2id,
      salt: saltBuffer,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    return hashedData;
  } catch (error) {
    console.error("Error hashing data:", error);
    throw new Error("Failed to hash data");
  }
};
