import { supabase } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Bot, Context, webhookCallback } from "grammy";
import { bot } from "@/utils/telegram/bot";

type ResponseData = {
  message?: string;
};

// const WEBAPP_URL = "https://dao999nft.com";

const handleUpdate = webhookCallback(bot, "std/http");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    console.log(req.body, "req.body");
    const { first_name, last_name, username, is_bot, language_code, id } =
      req.body.message.from;
    bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

    bot.command("ping", (ctx) =>
      ctx.reply(`Pong! ${new Date()} ${Date.now()}`)
    );

    bot.start();

    // Проверяем, существует ли уже пользователь с таким telegram_id
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", id)
      .maybeSingle();

    if (error && error.message !== "No rows found") {
      console.error("Ошибка при проверке существования пользователя:", error);
      return;
    }

    // Если пользователь существует, прекращаем выполнение функции
    if (existingUser) {
      console.log("Пользователь уже существует:", existingUser);
      return;
    }

    // Если пользователя нет, создаем нового
    const usersData = {
      first_name,
      last_name,
      username,
      is_bot,
      language_code,
      telegram_id: id,
      email: "",
      avatar: "",
    };

    const { data, error: insertError } = await supabase
      .from("users")
      .insert([usersData]);

    if (insertError) {
      console.error("Ошибка при создании пользователя:", insertError);
      return;
    }
    handleUpdate(req, res);
    res.status(200).end();
  } catch (err) {
    console.error(err);
  }
}
