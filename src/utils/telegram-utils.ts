// /src/utils/telegram-utils.ts
import { redis } from "../lib/redis";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false,
});

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const current = (await redis.get(key)) || 0;
  if (Number(current) >= limit) return false;
  await redis.multi().incr(key).pexpire(key, windowMs).exec();
  return true;
}

export async function sendMessageWithRetry(
  chatId: string,
  message: string,
  retries = 3,
) {
  for (let i = 0; i < retries; i++) {
    try {
      await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
      return;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).response?.statusCode === 429) {
        const waitTime =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).response.body.parameters.retry_after * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else if (i === retries - 1) {
        throw error;
      }
    }
  }
}
