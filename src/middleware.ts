import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  // Login болон Signup руу хандахыг шалгана
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  // Хэрэв токен байхгүй бол зөвхөн login болон signup-д зөвшөөрнө
  if (!token) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Токен хүчинтэй эсэхийг шалгана
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("Token is valid:", payload);

    // Хэрэв хэрэглэгч login болон signup руу хандаж байгаа бол redirect хийнэ
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);

    // Токен буруу бол login руу чиглүүлнэ
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Middleware-г тодорхой path дээр ажиллуулахаар тохируулна
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"], // Dashboard болон login, signup хуудсуудыг хамгаална
};
