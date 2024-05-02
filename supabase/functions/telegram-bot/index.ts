// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { client } from "../utils/client.ts";
import { bot } from "../utils/telegram/bots.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.8.3/mod.ts";

console.log("Hello from Functions!");

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
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

    bot.command(
      "ping",
      (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`),
    );

    bot.start();

    handleUpdate(req, res);
    return new Response(JSON.stringify({ message: "Successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

const checkOrCreateUser = async (req) => {
  console.log(req, "req");
  if (req.body.message.from) {
    const {
      first_name,
      last_name,
      username,
      is_bot,
      language_code,
      telegram_id,
      email,
      profileimage,
    } = await req.json();

    const supabase = client();
    // Проверяем, существует ли уже пользователь с таким telegram_id
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegram_id)
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/telegram-bot' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
