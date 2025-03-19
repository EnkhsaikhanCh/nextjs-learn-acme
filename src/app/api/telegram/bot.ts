import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// Орчныг тодорхойлох
const env = process.env.VERCEL_ENV || "development";
const isDev = env === "development";
const isStaging = env === "preview"; // Vercel preview орчин
const isProd = env === "production";

// Bot token унших (орчин бүрт Vercel-ээс ирнэ)
const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  throw new Error(
    `❌ TELEGRAM_BOT_TOKEN (${env} орчинд) тохируулагдаагүй байна.`,
  );
}

// Bot instance үүсгэх
let botInstance: TelegramBot | null = null;

export const getBot = (): TelegramBot => {
  if (!botInstance) {
    // Dev болон Staging дээр polling, Production дээр webhook
    botInstance = new TelegramBot(botToken, {
      polling: isDev || isStaging, // Dev эсвэл Staging бол polling
    });
    setupBot(botInstance);
  }
  return botInstance;
};

async function setupBot(bot: TelegramBot) {
  if (isDev || isStaging) {
    await initializePolling(bot);
  } else if (isProd) {
    await initializeWebhook(bot);
  }

  bot.on("polling_error", (err) =>
    console.error(`[${env}] Polling error:`, err),
  );
  bot.on("webhook_error", (err) =>
    console.error(`[${env}] Webhook error:`, err),
  );
}

async function initializePolling(bot: TelegramBot) {
  try {
    await bot.getMe();
    console.log(`[${env}] Stopping any existing polling...`);
    await bot.stopPolling(); // Хуучин polling-г зогсоо
    console.log(`[${env}] Starting new polling...`);
    await bot.startPolling({ restart: true }); // Шинээр эхлүүл
    console.log(`[${env}] ✅ Polling started successfully`);
  } catch (err) {
    console.error(`[${env}] ❌ Polling эхлүүлэхэд алдаа:`, err);
  }
}

async function initializeWebhook(bot: TelegramBot) {
  const baseUrl = process.env.PRODUCTION_URL; // Production-д тогтмол URL
  const webhookUrl = `${baseUrl}/api/telegram/telegram-webhook`;

  try {
    await bot.deleteWebHook();
    await bot.setWebHook(webhookUrl);
    console.log(`[${env}] 🚀 Telegram webhook set to: ${webhookUrl}`);
  } catch (err) {
    console.error(`[${env}] ❌ Webhook тохируулах үед алдаа:`, err);
  }
}

const bot = getBot();
export { bot };
