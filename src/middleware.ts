// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Нэвтрээгүй хэрэглэгчдийг `/login` руу чиглүүлэх
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next(); // Үргэлжлүүлэх
  }

  // Token-оос хэрэглэгчийн role авна
  const role = token?.role; // Ensure your token includes the `role` field

  // `/admin` замд зөвхөн admin role-тэй хэрэглэгч нэвтрэх боломжтой
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    pathname.startsWith("/dashboard/courses") &&
    role !== "STUDENT" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!token.isVerified && pathname !== "/verify-otp") {
    return NextResponse.redirect(new URL("/verify-otp", request.url));
  }

  // Хэрэглэгч `/login` эсвэл `/signup` руу орох үед `/dashboard` руу чиглүүлэх
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next(); // Үргэлжлүүлэх
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/signup"], // Middleware ажиллах замууд
};
