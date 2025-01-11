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
import jwt from "jsonwebtoken";
import { generateUniqueStudentId } from "../../../../../../utils/generate-unique-student-id";
import dotenv from "dotenv";
dotenv.config();

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

// The main function to create a new user
export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

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

    // 2. Token үүсгэх
    const token = jwt.sign(
      {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      message: "User created successfully",
      token,
    };
  } catch (error) {
    // Handle known GraphQL errors
    if (error instanceof GraphQLError) {
      throw error;
    }

    // Handle unexpected errors
    throw new GraphQLError("Internal server error.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
