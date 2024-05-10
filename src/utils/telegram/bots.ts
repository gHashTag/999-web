import { Bot, Context } from "grammy";

if (!process.env.TELEGRAM_BOT_TOKEN_AI_KOSHEY) {
  throw new Error("TELEGRAM_BOT_TOKEN_AI_KOSHEY is not set");
}
if (!process.env.TELEGRAM_BOT_TOKEN_AI_KOSHEY_TEST) {
  throw new Error("TELEGRAM_BOT_TOKEN_AI_KOSHEY_TEST is not set");
}
if (!process.env.TELEGRAM_BOT_JAVASCRIPT_DEV_TOKEN) {
  throw new Error("TELEGRAM_BOT_JAVASCRIPT_DEV_TOKEN is not set");
}

const tokenProd = process.env.TELEGRAM_BOT_TOKEN_AI_KOSHEY;
const tokenTest = process.env.TELEGRAM_BOT_TOKEN_AI_KOSHEY_TEST;

export const tokenAiKoshey = process.env.NODE_ENV === "development"
  ? tokenTest
  : tokenProd;

export const botAiKoshey = new Bot<Context>(tokenAiKoshey ?? "");

export const javaScriptDevBot = new Bot<Context>(
  process.env.TELEGRAM_BOT_JAVASCRIPT_DEV_TOKEN ?? "",
);
// attach your middlewaew, commands and other stuff to your bot
// eg. bot.use(myCommands)
