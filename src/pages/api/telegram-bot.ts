import { supabase } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Bot, Context, webhookCallback } from "grammy";
import { bot } from "@/utils/telegram/bot";
import { startTelegramBotInDev } from "@/utils/telegram/start";

type ResponseData = {
  message?: string;
};

const handleUpdate = webhookCallback(bot, "std/http");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await startTelegramBotInDev();
  try {
    // const buttons = [
    //   [{ text: "Кнопка 1" }],
    //   [{ text: "Кнопка 2" }],
    //   [{ text: "Кнопка 3" }],
    // ];

    // const replyMarkup = {
    //   resize: true,
    //   single_use: true,
    //   selective: false,
    //   rows: buttons,
    // };

    // // Присоединяем replyMarkup к исходящему сообщению
    // const message = {
    //   text: "Привет, выбери одну из кнопок:",
    //   reply_markup: replyMarkup,
    // };

    bot.command("start", (ctx) => {
      ctx.reply(JSON.stringify("Hello!!!!!"));
      checkOrCreateUser(req);
    });

    bot.command("ping", (ctx) =>
      ctx.reply(`Pong! ${new Date()} ${Date.now()}`)
    );

    bot.start();

    handleUpdate(req, res);
    res.status(200).end();
  } catch (err) {
    console.error(err);
  }
}

const checkOrCreateUser = async (req: NextApiRequest) => {
  console.log(req, "req");
  if (req.body.message.from) {
    const { first_name, last_name, username, is_bot, language_code, id } =
      req.body.message.from;
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
  } else {
    console.log("Пользователь уже существует");
  }
};
