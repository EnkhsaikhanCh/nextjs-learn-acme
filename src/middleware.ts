import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("Token is valid:", payload);

    const response = NextResponse.next();
    response.headers.set("X-User-Id", payload.userId as string);
    response.headers.set("X-User-Email", payload.email as string);
    response.headers.set("X-User-Role", payload.role as string);

    return response;
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
