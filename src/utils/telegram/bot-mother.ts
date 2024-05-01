import { Bot, Context } from "grammy";

export const botMother = new Bot<Context>(process.env.TELEGRAM_BOT_MOTHER_TOKEN ?? "");

// attach your middlewaew, commands and other stuff to your bot
// eg. bot.use(myCommands)