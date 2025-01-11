// src/app/api/graphql/resolver/mutation/user/login-mutation.ts
import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { LoginInput } from "../../../schemas/user.schema";
import argon2 from "argon2";
import { sanitizeInput, validationEmail } from "@/utils/validation";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const validateLoginInputs = (email: string, password: string) => {
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

  return { sanitizedEmail };
};

export const loginUser = async (
  _: unknown,
  { input }: { input: LoginInput },
) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const { sanitizedEmail } = validateLoginInputs(input.email, input.password);

    const user = await UserModel.findOne({ email: sanitizedEmail });
    if (!user) {
      throw new GraphQLError("Invalid email or password.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // Нууц үгийг шалгах
    const isPasswordValid = await argon2.verify(user.password, input.password);
    if (!isPasswordValid) {
      throw new GraphQLError("Invalid email or password.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // Токен үүсгэх
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      message: "Login successful",
      token,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Internal server error.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
