// src/app/api/graphql/resolver/mutation/user/login-mutation.ts
import { GraphQLError } from "graphql";
import { RefreshTokenModel, UserModel } from "../../../models";
import { LoginInput } from "../../../schemas/user.schema";
import argon2 from "argon2";
import { sanitizeInput, validationEmail } from "@/utils/validation";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateSecureRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

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
  const secret = process.env.JWT_ACCESS_SECRET;
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

    // 3. Access Token үүсгэх (богино хугацаатай)
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      },
    );

    // 4. Refresh token үүсгэх
    const refreshToken = generateSecureRefreshToken();
    console.log(refreshToken);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // +7 хоног

    // 5. RefreshTokenModel-д хадгалах
    await RefreshTokenModel.create({
      token: refreshToken,
      user: user._id,
      expiryDate,
    });

    return {
      message: "Login successful",
      token, // access token
      refreshToken, // refresh token
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
