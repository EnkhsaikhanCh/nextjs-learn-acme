// src/app/api/graphql/resolvers/mutations/user/refresh-token-mutation.ts
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { RefreshTokenModel, UserModel } from "../../../models";
import crypto from "crypto";

interface RefreshTokenInput {
  refreshToken: string;
}

const generateSecureRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export async function refreshToken(
  _: any,
  { input }: { input: RefreshTokenInput },
) {
  try {
    // 1. Орж ирсэн refreshToken-ийг хайх
    const existingToken = await RefreshTokenModel.findOne({
      token: input.refreshToken,
    });

    if (!existingToken) {
      throw new GraphQLError("refresh token буруу эсвэл олдсонгүй.");
    }

    // 2. Дууссан эсэхийг шалгах
    if (existingToken.expiryDate < new Date()) {
      // MongoDB автоматаар устгах хэдий ч энд шалгах нь зүйтэй
      throw new GraphQLError("refresh token-ийн хугацаа дууссан байна.");
    }

    // 3. Холбогдох хэрэглэгчийг олох
    const user = await UserModel.findById(existingToken.user);
    if (!user) {
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
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    // 5. (Сонголтоор) Refresh Token-ээ шинэчлэх үү эсвэл хуучин хэвээр нь үлдээх үү?
    //    Жишээ нь бүр шинэ болгоно гэвэл:
    const newRefreshToken = generateSecureRefreshToken();
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 7); // дахин 7 хоног

    existingToken.token = newRefreshToken;
    existingToken.expiryDate = newExpiryDate;
    await existingToken.save();

    return {
      message: "Шинэ token амжилттай үүслээ",
      token: newAccessToken, // Шинэ access token
      refreshToken: newRefreshToken, // Шинэ refresh token
    };
  } catch (error: any) {
    throw new GraphQLError(error.message);
  }
}
