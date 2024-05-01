import { createUser, supabase } from "@/utils/supabase";

import { webhookCallback } from "grammy";
import { bot } from "@/utils/telegram/bots";
import { create100MsRoom } from "@/helpers/api/create-100ms-room";


import { checkUsernameCodes } from "@/hooks/useSupabase";
import { transliterate } from "@/helpers/api/transliterate";
import { getRooms } from "@/hooks/useSupabase";

bot.command("start", async (ctx) => {
  await ctx.replyWithChatAction("typing");

  const select_izbushka = ctx?.message?.text && ctx.message.text.split(" ")[1];

  if (select_izbushka) {
    const username = ctx.update.message?.from.username;

    const {
      data: updateUserSelectIzbushkaData,
      error: updateUserSelectIzbushkaError,
    } = await supabase
      .from("users")
      .update({ select_izbushka })
      .eq("username", username);

    if (updateUserSelectIzbushkaError) {
      console.log(
        updateUserSelectIzbushkaError,
        "updateUserSelectIzbushkaError"
      );
    }

    console.log(updateUserSelectIzbushkaData, "updateUserSelectIzbushkaData");

    ctx.reply(
      `📺 Что ж, путник дорогой, дабы трансляцию начать, нажми кнопку "Избушка" смелее и веселись, ибо все приготовлено к началу твоего путешествия по цифровым просторам!`
    );
  } else {
    ctx.reply(
      `🏰 Добро пожаловать в Тридевятое Царство, ${ctx.update.message?.from.first_name}! Всемогущая Баба Яга, владычица тайн и чародейница, пред врата неведомого мира тебя привечает. Чтоб изба к тебе передком обернулась, а не задом стояла, не забудь прошептать кабы словечко-проходное.`,
      {
        reply_markup: {
          force_reply: true,
        },
      }
    );
    createUser(ctx);
  }
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
        await checkUsernameCodes(replyText as string);

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

          const { data: createUserData, error: createUserError } =
            await supabase.from("users").insert([{ ...newUser }]);

          const isPayment = true;

          ctx.reply(
            `🏰 Благоволи войти в волшебные пределы Тридевятого Царства, где сказание оживает, а чудеса само собой рядом ступают. ${ctx.update.message?.from.first_name}!`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "🛰 Построить избушку",
                      callback_data: "name_izbushka",
                    },
                    {
                      text: "🏡 Узреть избушки",
                      callback_data: "show_izbushka",
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

      const lastElement = dataRooms && dataRooms[0];

      const translateName = transliterate(lastElement?.name);

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

  const callbackData = ctx.callbackQuery.data;

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
    const select_izbushka = callbackData.split("_")[2];

    if (select_izbushka) {
      const { error: updateUserSelectIzbushkaError } = await supabase
        .from("users")
        .update({ select_izbushka })
        .eq("username", username);

      if (updateUserSelectIzbushkaError) {
        console.log(
          updateUserSelectIzbushkaError,
          "updateUserSelectIzbushkaError"
        );
      }
    }

    ctx.reply(
      `📺 Что ж, путник дорогой, дабы трансляцию начать, нажми кнопку "Избушка" смелее и веселись, ибо все приготовлено к началу твоего путешествия по цифровым просторам!`
    );

    ctx.reply(
      `Приглашение в избушку. Нажми на кнопку чтобы прсоединиться!\n\nhttps://t.me/dao999nft_dev_bot?start=${select_izbushka}`
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
  if (typeof req.json === "function") {
    try {
      handleUpdate(req, res);
      res.status(200).end();
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error("Метод json не найден в объекте req");
  }
}
