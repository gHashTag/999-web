import { createUser, getBiggest, getQuestion, getUid, resetProgress, getCorrects, updateProgress, updateResult } from "@/utils/supabase";
import { pathIncrement } from "./path-increment";
import { getAiFeedback } from "./get-ai-feedback";
import { webhookCallback } from "grammy";
import { botMother } from "@utils/telegram/bot-mother";
import { checkSubscription } from "./check-subscription";

botMother.command("start", async (ctx: any) => {
  await ctx.replyWithChatAction("typing");
  createUser(ctx);
  const isSubscription = await checkSubscription(ctx, ctx.from?.id, "-1001988802788")
  if ( isSubscription=== true ) {
  ctx.reply(
    `Hi, ${ctx.update.message?.from.first_name}! 🚀 Давай начнем с тестов – выбери один из них, чтобы проверить свои знания и подготовиться к захватывающему путешествию в мир программирования! 🖥️✨ `,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Начать тест!", callback_data: "start_test" }],
        ],
      },
    },
  );
} else if (isSubscription === false) {
  ctx.reply(
    `Hi, ${ctx.update.message?.from.first_name}! Чтобы пользоваться нашим ботом и проходить тесты, нужно купить подписку📚 \n\n <b>Для покупки подписки обращаться к @koshey999nft</b>💸`, { parse_mode: "HTML" }
  )
}
});

botMother.on("message:text", async (ctx: any) => {
  await ctx.replyWithChatAction("typing");
  const text = ctx.message.text;
  try {
    const feedback = await getAiFeedback(text);
    await ctx.reply(feedback, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Ошибка при получении ответа AI:", error);
  }
});

botMother.on("callback_query:data", async (ctx: any) => {
  await ctx.replyWithChatAction("typing");
  const callbackData = ctx.callbackQuery.data;
  const isHaveAnswer = callbackData.split("_").length === 4;

  if (callbackData === "start_test") {
    try {
      resetProgress(ctx.callbackQuery.from.username || "");
      const questionContext = {
        lesson_number: 1,
        subtopic: 1,
      };

      const questions = await getQuestion(questionContext);
      if (questions.length > 0) {
        const {
          topic,
          image_lesson_url,
        } = questions[0];

        // Формируем сообщение
        const messageText =
          `${topic}\n\n<i><u>Теперь мы предлагаем вам закрепить полученные знания.</u></i>\n\n<b>🎯 Ваш счёт: 0XP </b>`;

        // Формируем кнопки
        const inlineKeyboard = [
          [{
            text: "Перейти к вопросу",
            callback_data: `javascript_01_01`,
          }],
        ];

        // Отправляем сообщение
        await ctx.replyWithPhoto(image_lesson_url, {
          caption: messageText,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
        return;
      } else {
        ctx.reply("Вопросы не найдены.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!isHaveAnswer) {
    try {
      const [language, lesson, subtopic] = callbackData.split("_");
      let questions;
      if (!isNaN(Number(lesson)) && !isNaN(Number(subtopic))) {
        // Значения корректны, вызываем функцию.
        questions = await getQuestion({
          lesson_number: Number(lesson),
          subtopic: Number(subtopic),
        });
      } else {
        // Одно из значений некорректно, обрабатываем ошибку.
        console.error(
          "Одно из значений некорректно(96):",
          lesson,
          subtopic,
          callbackData,
        );
        await ctx.reply(
          "Одно из значений некорректно. Пожалуйста, проверьте данные.",
        );
        return;
      }
      const {
        question,
        variant_0,
        variant_1,
        variant_2,
        id,
      } = questions[0];

      const user_id = await getUid(ctx.callbackQuery.from.username || "");
      if (!user_id) {
        await ctx.reply("Пользователь не найден.");
        return;
      }
      const correctAnswers = await getCorrects(user_id)
      // Формируем сообщение
      const messageText =
        `<b>Вопрос №${id}</b>\n\n${question}\n\n<b>🎯 Ваш счёт: ${correctAnswers}XP </b>`;

      // Формируем кнопки
      const inlineKeyboard = [
        [{
          text: variant_0 || "Вариант 1",
          callback_data: `${callbackData}_0`,
        }],
        [{
          text: variant_1 || "Вариант 2",
          callback_data: `${callbackData}_1`,
        }],
        [{
          text: variant_2 || "Не знаю",
          callback_data: `${callbackData}_2`,
        }],
      ];
      // Отправляем сообщение
      await ctx.editMessageCaption({
        reply_markup: { inline_keyboard: inlineKeyboard },
        caption: messageText,
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (isHaveAnswer) {
    try {
      const [language, lesson_number, subtopic, answer] = callbackData.split(
        "_",
      );
      const questionContext = {
        lesson_number: Number(lesson_number),
        subtopic: Number(subtopic),
      };

      const questions = await getQuestion(questionContext);
      if (questions.length > 0) {
        const {
          correct_option_id,
        } = questions[0];

        const user_id = await getUid(ctx.callbackQuery.from.username || "");
        if (!user_id) {
          await ctx.reply("Пользователь не найден.");
          return;
        }

        const path = `${language}_${lesson_number}_${subtopic}`;
        const biggestSubtopic = await getBiggest(Number(lesson_number));

        let isTrueAnswer = null;
        if (correct_option_id === Number(answer)) {
          isTrueAnswer = true;
          ctx.reply("✅");
        } else {
          isTrueAnswer = false;
          ctx.reply("❌");
        }
        await updateProgress({ user_id, isTrue: isTrueAnswer, path: path });
        const newPath = await pathIncrement({
          path,
          isSubtopic: biggestSubtopic === Number(subtopic) ? false : true,
        });
        const correctAnswers = await getCorrects(user_id)

        if (newPath === "javascript_30_01") {
          const correctProcent = correctAnswers * 0.8;
          if (correctProcent >= 80) {
            await updateResult({
              user_id,
              language: "javascript",
              value: true,
            });
            ctx.reply(
              `<b>🥳 Поздравляем, вы прошли тест! </b>\n\n🎯 Ваш результат: ${correctAnswers}XP из 230XP.`,
              { parse_mode: "HTML" },
            );
          } else {
            await updateResult({
              user_id,
              language: "javascript",
              value: false,
            });
            ctx.reply(
              `<b>🥲 Вы не прошли тест, но это не помешает вам развиваться! </b>\n\n🎯 Ваш результат: ${correctAnswers}XP из 230XP.`,
              { parse_mode: "HTML" },
            );
          }
        }
        const [newLanguage, newLesson, newSubtopic] = newPath.split("_");
        const newQuestions = await getQuestion({
          lesson_number: Number(newLesson),
          subtopic: Number(newSubtopic),
        });
        const { topic, image_lesson_url } = newQuestions[0];
        // Формируем сообщение
        const messageText =
          `${topic}\n\n<i><u>Теперь мы предлагаем вам закрепить полученные знания.</u></i>\n\n<b>🎯 Ваш счёт: ${correctAnswers}XP </b>`;

        // Формируем кнопки
        const inlineKeyboard = [
          [{
            text: "Перейти к вопросу",
            callback_data: newPath,
          }],
        ];
        // Отправляем сообщение
        await ctx.replyWithPhoto(image_lesson_url, {
          caption: messageText,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
        return;
      } else {
        ctx.reply("Вопросы не найдены.");
      }
    } catch (error) {
      console.error(error);
    }
  }
});

botMother.start()

export default async function handler(req: any, res: any) {
  const handleUpdate = webhookCallback(botMother, "std/http");
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