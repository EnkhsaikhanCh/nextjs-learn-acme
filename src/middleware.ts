// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Нэвтэрсэн хэрэглэгч `/login` болон `/signup` руу оролдохыг оролдох үед `/dashboard` руу чиглүүлэх
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Нэвтрээгүй хэрэглэгч `/dashboard` руу оролдох үед `/login` руу чиглүүлэх
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // Үргэлжлүүлэх
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"], // Middleware ажиллах замууд
};
