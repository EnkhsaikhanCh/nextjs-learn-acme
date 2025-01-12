// src/app/api/graphql/resolvers/mutations/user/refresh-token-mutation.ts
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { RefreshTokenModel, UserModel } from "../../../models";
import { RefreshTokenInput } from "../../../schemas/user.schema";

export async function refreshToken(
  _: unknown,
  { input }: { input: RefreshTokenInput },
) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET environment variable is not defined.");
  }

  if (!process.env.JWT_ACCESS_EXPIRES_IN) {
    throw new Error("JWT_ACCESS_EXPIRES_IN variable is not defined");
  }

  try {
    console.log("Refreshing token with input:", input);

    // 1. Орж ирсэн refreshToken-ийг хайх
    const existingToken = await RefreshTokenModel.findOne({
      token: input.refreshToken,
    });

    if (!existingToken) {
      console.error("Refresh token not found.");
      throw new GraphQLError("refresh token буруу эсвэл олдсонгүй.");
    }

    // 2. Дууссан эсэхийг шалгах
    if (existingToken.expiryDate < new Date()) {
      console.log("Refresh token expired:", existingToken.expiryDate);
      // MongoDB автоматаар устгах хэдий ч энд шалгах нь зүйтэй
      throw new GraphQLError("refresh token-ийн хугацаа дууссан байна.");
    }

    // 3. Холбогдох хэрэглэгчийг олох
    const user = await UserModel.findById(existingToken.user);
    if (!user) {
      console.error("User not found for token:", existingToken.user);
      throw new GraphQLError("Холбогдох хэрэглэгч олдсонгүй.");
    }

    // 4. Шинэ access token үүсгэх
    const newAccessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
    );

    console.log("New tokens generated successfully.");
    return {
      message: "Шинэ token амжилттай үүслээ",
      token: newAccessToken, // Шинэ access token
      refreshToken: input.refreshToken,
    };
  } catch (error) {
    console.error("Error in refreshToken:", error);
    const message = (error as Error).message;
    throw new GraphQLError(message);
  }
}
