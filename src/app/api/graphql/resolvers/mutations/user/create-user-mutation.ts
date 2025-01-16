// src/app/api/graphql/resolver/mutation/user/create-user-mutation.ts
import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { RegisterInput } from "../../../schemas/user.schema";
import argon2 from "argon2";
import {
  sanitizeInput,
  validationEmail,
  validationPassword,
} from "@/utils/validation";
import { generateUniqueStudentId } from "../../../../../../utils/generate-unique-student-id";

const validationInputs = (email: string, password: string) => {
  const sanitizedEmail = sanitizeInput(email);

  if (!sanitizedEmail || !password) {
    throw new GraphQLError("Email and password are required.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validationEmail(sanitizedEmail)) {
    throw new GraphQLError("Invalid email format.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validationPassword(password)) {
    throw new GraphQLError("Password must meet complexity requirements.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return { sanitizedEmail };
};

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  try {
    const { sanitizedEmail } = validationInputs(input.email, input.password);

    const existingUser = await UserModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      throw new GraphQLError("A user with this email already exists.", {
        extensions: { code: "CONFLICT" },
      });
    }

    const studentId = await generateUniqueStudentId();

    const hashedPassword = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    const newUser = await UserModel.create({
      email: sanitizedEmail,
      studentId: studentId,
      role: "student",
      password: hashedPassword,
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

    const message = (error as Error).message;

    throw new GraphQLError(`Internal server error: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
