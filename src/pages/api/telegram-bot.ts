import { supabase } from "@/utils/supabase";

import { Bot, Context, webhookCallback } from "grammy";
import { bot } from "@/utils/telegram/bot";
import { createRoom } from "@/helpers/api/create-room";
import { createUser } from "@/helpers/api/create-user";

import { checkUsername } from "@/hooks/useSupabase";

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
  // Проверяем, является ли сообщение ответом (есть ли reply_to_message)
  if (ctx.message.reply_to_message) {
    // Проверяем, содержит ли текст оригинального сообщения определенный текст
    const originalMessageText = ctx.message.reply_to_message.text;
    // console.log(originalMessageText, "originalMessageText");
    if (
      originalMessageText &&
      originalMessageText.includes("🏰 Добро пожаловать")
    ) {
      console.log(ctx, "ctx");

      // Обрабатываем ответ пользователя
      const inviteCode = ctx.message.text;
      console.log(inviteCode, "inviteCode");
      // Действия с ответом пользователя, например, сохранение токена
      const { isInviterExist, invitation_codes, inviter_user_id } =
        await checkUsername(inviteCode as string);
      console.log(invitation_codes, "invitation_codes");
      console.log(isInviterExist, "isInviterExist");
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

          const { data, error } = await supabase
            .from("users")
            .insert([{ ...newUser }]);
          console.log(data, "data");
          console.log(error, "users error");

          const isPayment = true;

          ctx.reply(
            `🏰 Благоволи войти в волшебные пределы Тридевятого Царства, где сказание оживает, а чудеса само собой рядом ступают. ${ctx.update.message?.from.first_name}!`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Создать комнату",
                      callback_data: "create_room",
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

    if (
      originalMessageText?.includes(
        "🗝️ Для того чтобы связать вашего цифрового двойника с личным нейросетевым ассистентом, пожалуйста, введите специальный токен, выданный BotFather."
      )
    ) {
      // Обрабатываем ответ пользователя
      const inviteCode = ctx.message.text;
      const token = ctx.update.message.text;
      console.log(token, "token");
      // Действия с ответом пользователя, например, сохранение токена

      const newData = {
        name: "Izbuzka",
        type: "meets",
        username: ctx.message.from.username,
        token,
        chat_id: ctx.message.chat.id,
        lang: ctx.message.from.language_code,
      };

      try {
        await createRoom(newData);

        ctx.reply(
          `✨ Построена избушка, дабы отныне могли вы словесный обмен творить и земляков своих ближайших призывать, отправь им словечко проходное.`
        );
        ctx.reply(
          `🌌 Ключ ко вратам Тридевятого Царства, где мечты твои обретут образ, и магия плетётся по воле твоей. Сие словечко проходное отворит двери избушки на курьих ножках, ведущей тебя к тайнам безграничным и чудесам незримым.\n\n🗝️ Словечко: ${ctx.message.from.username}\n🏰 Вход в Тридевятое Царство: @dao999nft_dev_bot`
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

  if (callbackData === "create_room") {
    try {
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
