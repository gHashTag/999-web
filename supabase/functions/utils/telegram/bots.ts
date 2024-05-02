import { Bot } from "https://deno.land/x/grammy@v1.8.3/mod.ts";

export const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN") || "");
