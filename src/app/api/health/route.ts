// /app/api/health/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const status =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const statusCode = status === "connected" ? 200 : 500;
  return NextResponse.json({ db: status }, { status: statusCode });
}
