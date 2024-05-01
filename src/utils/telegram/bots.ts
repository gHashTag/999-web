import { Bot, Context } from "grammy";

export const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN ?? "");

export const javaScriptDevBot = new Bot<Context>(process.env.TELEGRAM_BOT_JAVASCRIPT_DEV_TOKEN ?? "");
// attach your middlewaew, commands and other stuff to your bot
// eg. bot.use(myCommands)
