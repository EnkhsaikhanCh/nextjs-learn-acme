import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN байхгүй байна. .env файлдаа нэмнэ үү.");
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Таны Chat ID: ${chatId}`);
});

console.log("Бот ажиллаж эхэллээ. Бот руу мессеж илгээгээрэй!");
