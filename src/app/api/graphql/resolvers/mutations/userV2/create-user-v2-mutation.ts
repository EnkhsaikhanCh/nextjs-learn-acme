import {
  RegisterUserV2Input,
  RegisterUserV2Response,
  UserV2Role,
} from "@/generated/graphql";
import { UserV2Model } from "../../../models";
import argon2 from "argon2";
import { generateUniqueStudentId } from "@/utils/generate-unique-student-id";
import { z } from "zod";

const registerUserV2Schema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const registerUserV2 = async (
  _: unknown,
  { input }: { input: RegisterUserV2Input },
): Promise<RegisterUserV2Response> => {
  const { email, password } = input;

  const parsed = registerUserV2Schema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0].message,
      userV2: null,
    };
  }

  try {
    registerUserV2Schema.parse(input);
    const normalizedEmail = email.toLowerCase();

    const existingUser = await UserV2Model.findOne({ email: normalizedEmail });
    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
        userV2: null,
      };
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    const studentId = await generateUniqueStudentId();

    const newUser = await UserV2Model.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: UserV2Role.Student,
      studentId,
    });

    return {
      success: true,
      message: "User registered successfully.",
      userV2: newUser,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
      userV2: null,
    };
  }
};
