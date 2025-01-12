// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!,
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  // login болон signup хуудсыг шалгах
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  // Token байхгүй бол:
  if (!token) {
    if (isAuthPage) {
      // login/signup хуудсанд явуулах
      return NextResponse.next();
    }
    // хамгаалсан хуудсанд token байхгүй бол login руу redirect
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Токеныг шалгана (jwtVerify нь хугацаа дууссан бол TokenExpiredError-ыг шиднэ)
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET);
    console.log("Token is valid:", payload);

    // Хэрэв нэвтрэх (login/signup) хуудсанд орж байгаа бол
    // хэрэглэгчдийг хамгаалсан хуудсуудад чиглүүлнэ
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  } catch (error: unknown) {
    console.error("Token verification failed:", error);

    // Хэрэв алдааны төрлийг шалгаж, хугацаа дууссан гэдэгтэй холбоотой бол refresh хийгээрэй
    if (
      !isAuthPage && // Хэрэв бид login эсвэл signup хуудсанд байгаа бол refresh хийхгүй
      error instanceof Error &&
      (error.message.includes("expired") ||
        error.name === "JWTExpired" ||
        (error as any).code === "ERR_JWT_EXPIRED")
    ) {
      console.log("Access Token expired. Attempting to refresh...");

      // refreshToken-ийг cookie-аас уншаарай
      const refreshTokenValue = req.cookies.get("refreshToken")?.value;
      if (!refreshTokenValue) {
        // refreshToken байхгүй бол login руу чиглүүлнэ
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // GraphQL refreshToken mutation-г дуудаж шинэ access token авах
      const refreshUrl = new URL("/api/graphql", req.url);
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation RefreshToken($input: RefreshTokenInput!) {
              refreshToken(input: $input) {
                token
                refreshToken
              }
            }
          `,
          variables: {
            input: {
              refreshToken: refreshTokenValue,
            },
          },
        }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data?.data?.refreshToken?.token;
        const newRefreshToken = data?.data?.refreshToken?.refreshToken;

        if (newAccessToken) {
          console.log("Access Token refreshed successfully.");

          // Шинэ токеныг cookie-д тохируулж, тухайн хүсэлтийг үргэлжлүүлнэ
          const res = NextResponse.next();
          res.cookies.set("authToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          });
          if (newRefreshToken) {
            res.cookies.set("refreshToken", newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
            });
          }
          return res;
        } else {
          console.error(
            "No new access token returned. Redirecting to login...",
          );
          return NextResponse.redirect(new URL("/login", req.url));
        }
      } else {
        console.error("Refresh token request failed. Redirecting to login...");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Хэрэв токен буруу эсвэл refresh нь боломжгүй бол login руу чиглүүлнэ
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
