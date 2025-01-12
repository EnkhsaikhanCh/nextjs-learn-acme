import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!,
);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const authToken = req.cookies.get("authToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const currentPath = req.nextUrl.pathname;
  const isAuthPage =
    currentPath.startsWith("/login") || currentPath.startsWith("/signup");

  // If authToken and refreshToken exist, redirect to dashboard if on auth pages
  if (authToken && refreshToken) {
    try {
      await jwtVerify(authToken, JWT_ACCESS_SECRET);

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error(
        "Token verification failed. Checking refresh token:",
        error,
      );

      if (refreshToken) {
        if (isAuthPage) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
      }
    }
  }

  // If no authToken or refreshToken, allow access to auth pages or redirect to login
  if (!authToken || !refreshToken) {
    if (isAuthPage) {
      return NextResponse.next(); // Allow access to login/signup pages
    }
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login for protected pages
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"], // Apply middleware to auth and protected routes
};
