// src/app/api/telegram/telegram-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { bot } from "../../telegram/bot";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Telegram webhook data
    console.log("📩 Telegram Webhook received:", body);
    bot.processUpdate(body); // Telegram bot-д хүсэлтийг дамжуулах

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("❌ Telegram Webhook error:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
