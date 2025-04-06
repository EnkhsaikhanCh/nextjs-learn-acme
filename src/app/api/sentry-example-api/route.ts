// import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  // Intentionally throw an error to trigger Sentry monitoring
  throw new Error("🔴 Sentry Example API Route Error");

  // Unreachable code — safe to remove
  // return NextResponse.json({ data: "Testing Sentry Error..." });
}
