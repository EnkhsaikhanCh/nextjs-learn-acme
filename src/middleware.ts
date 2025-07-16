// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { UserV2Role } from "./generated/graphql";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 Check auth token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Define allowed roles
  type Role = UserV2Role;
  const role: Role = (token?.role as Role) || "";
  const isVerified = token?.isVerified ?? false;

  // 🚀 Site launch status
  const isLaunched = process.env.SITE_LAUNCHED === "true";

  // 🧭 Role-based default redirects
  const roleRedirectMap: Record<Role, string> = {
    ADMIN: "/admin",
    INSTRUCTOR: "/instructor",
    STUDENT: "/dashboard",
  };

  const fallbackRedirect = "/";

  // 🛡️ Routes that require login
  const protectedPaths = ["/admin", "/dashboard", "/instructor"];
  const isProtectedRoute = protectedPaths.some((p) => pathname.startsWith(p));

  // 🚫 If site is not launched, block everything except "/"
  if (!isLaunched && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔐 If unauthenticated, redirect protected routes to login
  if (!token) {
    if (pathname === "/verify-otp" || isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // if user is already verified, redirect to the appropriate dashboard
  if (isVerified && pathname === "/verify-otp") {
    const target = roleRedirectMap[role] || fallbackRedirect;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 🧪 OTP not verified → force /verify-otp
  if (!isVerified && pathname !== "/verify-otp") {
    return NextResponse.redirect(new URL("/verify-otp", request.url));
  }

  // 🔄 Define allowed roles for each route.
  const routeRoleMap: { pathPrefix: string; allowedRoles: Role[] }[] = [
    { pathPrefix: "/admin", allowedRoles: [UserV2Role.Admin] },
    { pathPrefix: "/instructor", allowedRoles: [UserV2Role.Instructor] },
    {
      pathPrefix: "/dashboard",
      allowedRoles: [
        UserV2Role.Student,
        UserV2Role.Admin,
        UserV2Role.Instructor,
      ],
    },
  ];

  // Check if the current role is permitted to access the requested route.
  for (const { pathPrefix, allowedRoles } of routeRoleMap) {
    if (pathname.startsWith(pathPrefix) && !allowedRoles.includes(role)) {
      const target = roleRedirectMap[role] || fallbackRedirect;
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // 🔁 Block authenticated users from accessing /login or /signup again
  if (["/login", "/signup"].includes(pathname)) {
    const target = roleRedirectMap[role] || fallbackRedirect;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // ❌ Block authenticated users from accessing /forgot-password or /reset-password
  if (
    ["/forgot-password", "/reset-password"].some((p) => pathname.startsWith(p))
  ) {
    const target = roleRedirectMap[role] || fallbackRedirect;
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next(); // ✅ Allow access if no conditions match
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/instructor/:path*",
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/", // Home — for SITE_LAUNCHED check
  ],
};
