// /src/workers/telegram-worker.ts
import { redis } from "../lib/redis";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false,
});
const QUEUE_KEY = "telegram_payment_queue";

export async function enqueuePaymentNotification(paymentData: any) {
  const dailyRequests = (await redis.get("daily_request_count")) || 0;
  if (Number(dailyRequests) > 50000) return; // Лимит
  await redis.lpush(QUEUE_KEY, JSON.stringify(paymentData));
  await redis.incr("daily_request_count");
  await redis.expire("daily_request_count", 86400);
}

export async function processQueue() {
  while (true) {
    const queueLength = await redis.llen(QUEUE_KEY);
    if (queueLength > 0) {
      const batchSize = Math.min(queueLength, 10);
      const messages = await redis.lrange(QUEUE_KEY, 0, batchSize - 1);
      await redis.ltrim(QUEUE_KEY, batchSize, -1);
      for (const paymentData of messages) {
        const data = JSON.parse(paymentData);
        await bot.sendMessage(data.chatId, data.message, {
          parse_mode: "Markdown",
        });
        await new Promise((resolve) => setTimeout(resolve, 34));
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

if (require.main === module) {
  processQueue().catch(console.error);
}
