import { bot } from "@/app/api/telegram/bot";

console.log("🚀 Telegram Bot Polling горимоор ажиллаж эхэллээ...");

bot.on("message", async (msg) => {
  console.log(`📩 New message from ${msg.chat.id}: ${msg.text}`);
  await bot.sendMessage(msg.chat.id, "👋 Сайн байна уу? Энэ бол тест bot!");
});
