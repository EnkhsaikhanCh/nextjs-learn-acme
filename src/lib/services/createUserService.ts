import { UserV2Model } from "@/app/api/graphql/models";
import { UserV2Role } from "@/generated/graphql";
import argon2 from "argon2";
import { generateUniqueStudentId } from "@/utils/generate-unique-student-id";
import mongoose from "mongoose";

export async function createUserService(
  email: string,
  password: string,
  role: UserV2Role = UserV2Role.Student,
  session?: mongoose.ClientSession,
) {
  try {
    const hashed = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    const studentId = await generateUniqueStudentId();

    const user = new UserV2Model({
      email,
      password: hashed,
      role,
      studentId,
    });

    return await user.save({ session });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `createUserService алдаа: ${error.message}`
        : "createUserService: Серверийн алдаа гарлаа",
    );
  }
}
