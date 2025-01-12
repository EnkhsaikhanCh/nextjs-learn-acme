import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!,
);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get("authToken")?.value;

  // Define the current path and authentication page check
  const currentPath = req.nextUrl.pathname;
  const isAuthPage =
    currentPath.startsWith("/login") || currentPath.startsWith("/signup");

  // If the token is missing
  if (!token) {
    if (isAuthPage) {
      return NextResponse.next(); // Allow access to login/signup pages
    }
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login for protected pages
  }

  try {
    // Verify the token
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      token,
      JWT_ACCESS_SECRET,
    );
    console.log("Token is valid:", payload);

    // If accessing an authentication page, redirect to the dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // Handle expired token errors specifically
    if (
      error instanceof Error &&
      (error.message.includes("expired") || error.name === "JWTExpired")
    ) {
      console.log("Access token expired. Attempting to refresh...");

      const refreshTokenValue = req.cookies.get("refreshToken")?.value;
      if (!refreshTokenValue) {
        if (!isAuthPage) {
          return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
      }

      // Attempt to refresh the access token
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
        const data: {
          data?: {
            refreshToken?: {
              token: string;
              refreshToken: string;
            };
          };
        } = await refreshResponse.json();

        const newAccessToken = data?.data?.refreshToken?.token;
        const newRefreshToken = data?.data?.refreshToken?.refreshToken;

        if (newAccessToken) {
          console.log("Access token refreshed successfully.");

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
        }
      }
      console.error("Refresh token failed. Redirecting to login...");
    }

    // For invalid tokens or refresh failures, redirect to login
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Only apply middleware to protected routes
};
