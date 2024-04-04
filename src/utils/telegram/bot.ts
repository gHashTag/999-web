import { Bot, Context } from "grammy";

export const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN ?? "");

// attach your middlewaew, commands and other stuff to your bot
// eg. bot.use(myCommands)
