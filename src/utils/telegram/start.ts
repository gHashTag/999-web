import { bot } from "./bot";
import { logger } from "@/logger";

const WEBAPP_URL = "https://dao999nft.com";

const handleGracefulShutdown = async () => {
  logger.info("shutdown");

  await bot.stop();

  process.exit();
};

if (process.env.NODE_ENV === "development") {
  // Graceful shutdown handlers
  process.once("SIGTERM", handleGracefulShutdown);
  process.once("SIGINT", handleGracefulShutdown);
}

export const startTelegramBotInDev = async () => {
  if (!bot.isInited()) {
    bot
      .start({
        onStart: ({ username }) => {
          logger.info({
            msg: "bot running...",
            username,
            at: new Date(),
          });
        },
      })
      .catch((err) => logger.error(err));
  }
};

export const startTelegramBotInProduction = async () => {
  try {
    const webhookUrl = `${WEBAPP_URL}/api/telegram-bot?token=${process.env.TELEGRAM_BOT_TOKEN}`;

    logger.info("fetching  webhook info");
    const webhookInfo = await bot.api.getWebhookInfo();
    logger.info(`existing webhook info fetched: ${webhookInfo.url}`);

    if (webhookInfo.url === webhookUrl) {
      logger.info("Sorry, same url, i don't wanna waste my time here.");
    } else {
      logger.info("deleting existing webhook");
      await bot.api.deleteWebhook();
      console.info("existing webhook deleted");

      logger.info(`setting new webhook to: ${webhookUrl}`);
      await bot.api.setWebhook(webhookUrl);
      console.info(`bot webhook set to: ${webhookUrl}`);
    }
  } catch (err) {
    console.error("failed to delete/set webhook url", err);
  }
};
