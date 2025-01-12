import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET environment variable is not defined.");
}
const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET,
);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const authToken = req.cookies.get("authToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const currentPath = req.nextUrl.pathname;
  const isAuthPage =
    currentPath.startsWith("/login") || currentPath.startsWith("/signup");

  if (authToken) {
    try {
      await jwtVerify(authToken, JWT_ACCESS_SECRET);

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid access token:", error);
    }
  }

  if (!authToken && refreshToken) {
    console.log("Access token expired. Allowing refresh flow...");
    return NextResponse.next(); // Refresh API руу явуулна
  }

  if (!authToken || !refreshToken) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};
