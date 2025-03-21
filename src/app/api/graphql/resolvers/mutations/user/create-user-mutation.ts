// src/app/api/graphql/resolver/mutation/user/create-user-mutation.ts
import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import argon2 from "argon2";
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
} from "@/utils/validation";
import { RegisterInput } from "@/generated/graphql";
import { generateUniqueStudentId } from "@/utils/generate-unique-student-id";

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  const { email, password } = input;

  if (!email || !password) {
    throw new GraphQLError("Email and password are required.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  // Normalize email (trim and convert to lower case)
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new GraphQLError("Invalid email format.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validateEmail(normalizedEmail)) {
    throw new GraphQLError("Invalid email format.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validatePassword(password)) {
    throw new GraphQLError("Password must meet complexity requirements.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      throw new GraphQLError("A user with this email already exists.", {
        extensions: { code: "CONFLICT" },
      });
    }

    const studentId = await generateUniqueStudentId();

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    const newUser = await UserModel.create({
      email: email,
      studentId: studentId,
      password: hashedPassword,
      isVerified: false,
    });

    return {
      message: "User created successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        studentId: newUser.studentId,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
