// src/app/api/auth/refresh.ts
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { RefreshTokenModel } from "../graphql/models";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh Token not provided" },
      { status: 401 },
    );
  }

  try {
    const existingToken = await RefreshTokenModel.findOne({
      token: refreshToken,
    });
    if (!existingToken) {
      return NextResponse.json(
        { message: "Invalid Refresh Token" },
        { status: 401 },
      );
    }

    const newAccessToken = jwt.sign(
      { _id: existingToken.user },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
    );

    const res = NextResponse.json({ token: newAccessToken });
    res.cookies.set("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { message: "Failed to refresh token" },
      { status: 500 },
    );
  }
}
