// src/app/api/staging-redis-test/route.ts
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const testKey = "staging:test";
    const testValue = "success";

    // Redis-д өгөгдөл хадгалах
    await redis.set(testKey, testValue);

    // Redis-с өгөгдөл унших
    const result = await redis.get(testKey);

    if (result === testValue) {
      return NextResponse.json({
        message: "✅ Redis тест амжилттай",
        value: result,
      });
    } else {
      return NextResponse.json(
        {
          message: "⚠️ Redis тест амжилтгүй",
          value: result,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Redis Test Error:", error);
    return NextResponse.json(
      { error: "❌ Redis холболтын алдаа." },
      { status: 500 },
    );
  }
}
