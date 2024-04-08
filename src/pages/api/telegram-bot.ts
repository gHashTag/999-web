import { supabase } from "@/utils/supabase";

import { Bot, Context, webhookCallback } from "grammy";
import { bot } from "@/utils/telegram/bot";
import { create100MsRoom } from "@/helpers/api/create-100ms-room";
import { createUser } from "@/helpers/api/create-user";

import { checkUsername } from "@/hooks/useSupabase";
import { transliterate } from "@/helpers/api/transliterate";
import { getUser } from "@/helpers/api/get-user";
import { SupabaseUser } from "@/types";
import { getRooms } from "@/helpers/api/get-rooms";

bot.command("start", async (ctx) => {
  await ctx.replyWithChatAction("typing");

  ctx.reply(
    `🏰 Добро пожаловать в Тридевятое Царство, ${ctx.update.message?.from.first_name}! Всемогущая Баба Яга, владычица тайн и чародейница, пред врата неведомого мира тебя привечает. Чтоб изба к тебе передком обернулась, а не задом стояла, не забудь прошептать кабы словечко-проходное.`,
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );
  createUser(ctx);
});

bot.on("message", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  const username = ctx.message.from.username;
  const replyText = ctx.message.text;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  const user_id = data && data[0]?.user_id;
  // Проверяем, является ли сообщение ответом (есть ли reply_to_message)
  if (ctx.message.reply_to_message) {
    // Проверяем, содержит ли текст оригинального сообщения определенный текст
    const originalMessageText = ctx.message.reply_to_message.text;
    // console.log(originalMessageText, "originalMessageText");
    if (
      originalMessageText &&
      originalMessageText.includes("🏰 Добро пожаловать")
    ) {
      // Обрабатываем ответ пользователя

      // Действия с ответом пользователя, например, сохранение токена
      const { isInviterExist, invitation_codes, inviter_user_id } =
        await checkUsername(replyText as string);

      try {
        if (isInviterExist) {
          const newUser = {
            first_name: ctx.message.from.first_name,
            last_name: ctx.message.from.last_name,
            username: ctx.message.from.username,
            language_code: ctx.message.from.language_code,
            telegram_id: ctx.message.from.id,
            inviter: inviter_user_id,
            invitation_codes,
          };
          console.log(newUser, "newUser");

          const { data: createUserData, error: createUserError } =
            await supabase.from("users").insert([{ ...newUser }]);
          console.log(createUserData, "createUserData");
          console.log(createUserError, "createUserError");
          const isPayment = true;

          ctx.reply(
            `🏰 Благоволи войти в волшебные пределы Тридевятого Царства, где сказание оживает, а чудеса само собой рядом ступают. ${ctx.update.message?.from.first_name}!`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Построить избушку",
                      callback_data: "name_izbushka",
                    },
                  ],
                ],
              },
            }
          );
        } else {
          ctx.reply(
            `🔒 Ох, увы и ах! Словечко, что до меня дошло, чарам тайным не отвечает. Прошу, дай знать иное, что ключом является верным, чтоб путь твой в царство дивное открыть сумели без замедления.`
          );
        }
      } catch (error) {
        ctx.reply(`Что-то пошло не так, попробуйте ещё раз.`);
      }
    }

    if (originalMessageText?.includes("Как назовем избушку?")) {
      try {
        const { error: createRoomError } = await supabase.from("rooms").insert({
          name: replyText,
          user_id,
          username,
          original_name: replyText,
        });
        // console.log(createRoomError, "createRoomError");
        ctx.reply(
          "🗝️ Для того чтобы связать вашего цифрового двойника с личным нейросетевым ассистентом, пожалуйста, введите специальный токен, выданный BotFather.",
          {
            reply_markup: {
              force_reply: true,
            },
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (
      originalMessageText?.includes(
        "🗝️ Для того чтобы связать вашего цифрового двойника с личным нейросетевым ассистентом, пожалуйста, введите специальный токен, выданный BotFather."
      )
    ) {
      const token = ctx.update.message.text;

      const { data: dataRooms, error: errorRooms } = await supabase
        .from("rooms")
        .select("*")
        .eq("user_id", user_id)
        .order("id", { ascending: false });

      console.log(dataRooms, "dataRooms");
      const lastElement = dataRooms && dataRooms[0];
      console.log(lastElement, "lastElement");
      const translateName = transliterate(lastElement?.name);
      console.log(translateName, "translateName");
      const newData = {
        id: lastElement?.id,
        name: translateName,
        original_name: lastElement?.name,
        type: "meets",
        username: ctx.message.from.username,
        token,
        chat_id: ctx.message.chat.id,
        lang: ctx.message.from.language_code,
      };

      try {
        await create100MsRoom(newData);
        ctx.reply(
          `✨ Построена избушка, дабы отныне могли вы словесный обмен творить и земляков своих ближайших призывать, отправь им словечко проходное.`
        );
        ctx.reply(
          `🌌 Ключ ко вратам Тридевятого Царства, где мечты твои обретут образ, и магия плетётся по воле твоей. Сие словечко проходное отворит двери избушки на курьих ножках, ведущей тебя к тайнам безграничным и чудесам незримым.\n\n🗝️ Словечко: ${ctx.message.from.username}\n🏰 Вход в Тридевятое Царство: @dao999nft_dev_bot`
        );

        ctx.reply(
          `🏡 Нажми на кнопку и запусти чудодейственные механизмы сети мировой, ты сможешь мгновенно окинуть взором свои владения, не отходя от домашнего очага.
        `,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "🏡 Узреть избушки",
                    callback_data: "show_izbushka",
                  },
                ],
              ],
            },
          }
        );
      } catch (error) {
        ctx.reply(`Что-то пошло не так, попробуйте ещё раз.`);
      }
    }
  }
});

bot.on("callback_query:data", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  console.log(ctx, "ctx callback_query:data");
  const callbackData = ctx.callbackQuery.data;
  console.log(ctx.update.callback_query, "ctx.update.callback_query");
  const username = ctx.update && ctx.update.callback_query.from.username;

  if (callbackData === "name_izbushka") {
    try {
      ctx.reply("Как назовем избушку?", {
        reply_markup: {
          force_reply: true,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (callbackData === "show_izbushka") {
    const user = username && (await getUser(username));

    const rooms = username && (await getRooms(username));

    try {
      ctx.reply("🏡 Выберите избушку", {
        reply_markup: {
          inline_keyboard: rooms
            ? rooms
                .filter((room: any) => room)
                .map((room: any) => ({
                  text: room.original_name,
                  callback_data: `select_izbushka_${room.id}`,
                }))
                .reduce((acc: any, curr: any, index: number) => {
                  const row = Math.floor(index / 1); // Устанавливаем количество кнопок в одном ряду (здесь 2 кнопки в ряду)
                  acc[row] = acc[row] || [];
                  acc[row].push(curr);
                  return acc;
                }, [])
            : [],
        },
      });
    } catch (error) {
      console.error("error show_izbushka", error);
    }
  }
  if (callbackData.includes("select_izbushka")) {
    const select_izbushka_id = callbackData.split("_")[2];
    console.log(select_izbushka_id, "select_izbushka_id");

    const { data: selectRoomData, error: selectRoomError } = await supabase
      .from("users")
      .update({ select_izbushka: select_izbushka_id })
      .eq("username", username)
      .select("*");

    console.log(selectRoomData, "selectRoomData");
    console.log(selectRoomError, "selectRoomError");

    ctx.reply(
      `📺 Что ж, путник дорогой, дабы трансляцию начать, нажми кнопку "Избушка" смелее и веселись, ибо все приготовлено к началу твоего путешествия по цифровым просторам!`
    );
  }
});

// bot.on("message:text", async (ctx) => {
//   await ctx.replyWithChatAction("typing");
//   const text = ctx.message.text;
//   try {
//     const feedback = await getAiFeedback(text);
//     await ctx.reply(feedback, { parse_mode: "Markdown" });
//   } catch (error) {
//     console.error("Ошибка при получении ответа AI:", error);
//   }
// });

bot.start();

export default async function handler(req: any, res: any) {
  const handleUpdate = webhookCallback(bot, "std/http");

  try {
    handleUpdate(req, res);
    res.status(200).end();
  } catch (err) {
    console.error(err);
  }
}

const checkOrCreateUser = async (req: any) => {
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
