// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!,
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  // login/signup эсэхийг шалгах
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  if (!token) {
    // Токен байхгүй бол login болон signup-д зөвшөөрнө
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Токеныг шалгана
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET);
    // console.log("Token is valid:", payload);

    // Токен хүчинтэй үед login/signup руу орохыг хориглоно
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error: any) {
    console.error("Token verification failed:", error);

    // Хугацаа дууссан эсэхийг шалгах
    if (
      error.message.includes("expired") ||
      error.name === "JWTExpired" ||
      error.code === "ERR_JWT_EXPIRED"
    ) {
      console.log("Access Token expired. Attempting to refresh...");

      // Refresh Token-г ашиглан шинэ access token авах (GraphQL mutation руу fetch, эсвэл /api/refresh гэх мэт)
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
              // refreshToken-ийг cookie-оос уншиж дамжуулна
              refreshToken: req.cookies.get("refreshToken")?.value,
            },
          },
        }),
      });

      // Хариуг унших
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data?.data?.refreshToken?.token;
        const newRefreshToken = data?.data?.refreshToken?.refreshToken;

        if (newAccessToken) {
          console.log("Access Token refreshed successfully.");

          // Шинэ токенийг cookie-д тавих
          const res = NextResponse.next();
          // (cookie-н тохиргоог ашиглан шинэ access token-г authToken гэж хадгалж болно)
          res.cookies.set("authToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          });

          // Refresh Token-ийг бас шинэчилж буцаах уу?
          if (newRefreshToken) {
            res.cookies.set("refreshToken", newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
            });
          }

          // Энэ next() нь хуудсыг үргэлжлүүлнэ
          return res;
        } else {
          console.error("No newAccessToken returned. Redirecting to login...");
          return NextResponse.redirect(new URL("/login", req.url));
        }
      } else {
        console.error("Refresh token failed. Redirecting to login...");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Токен буруу эсвэл өөр алдаа гарсан бол login руу
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
