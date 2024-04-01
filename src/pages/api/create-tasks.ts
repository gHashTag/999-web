import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { RoomNode } from "@/types";
import { corsHeaders, headers } from "@/helpers/headers";
import NextCors from "nextjs-cors";
import { Bot } from "grammy";
import { translateText } from "@/helpers/api/translateText";
import { createChatCompletion } from "@/helpers/api/createChatCompletion";
import { da } from "@faker-js/faker";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "");

const targetLanguage = "ru";

type Task = {
  assignee: {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
  };
  title: string;
  description: string;
};

async function sendTasksToTelegram(
  chatId: number,
  tasks: Task[],
  summary_short: string,
) {
  const messageText = tasks.map((task) =>
    `Task: ${task.title}\nDescription: ${task.description}\n🧑🏻Assignee: ${task.assignee.first_name} ${task.assignee.last_name} (@${task.assignee.username})`
  ).join("\n\n");

  const translatedSummaryShort = await translateText(
    summary_short,
    targetLanguage,
  );

  const translatedMessageText = await translateText(
    messageText,
    targetLanguage,
  );

  // Отправляем переведенный текст в Telegram
  await bot.api.sendMessage(
    chatId,
    `🚀 ${translatedSummaryShort}\n\n${translatedMessageText})
    `,
  );
}

const getPreparedUsers = (usersFromSupabase: any) => {
  return usersFromSupabase.map((user: any) => {
    const concatName = () => {
      if (!!user.first_name && !user.last_name) {
        return user?.first_name;
      }
      if (!user.first_name && !!user.last_name) {
        return user.last_name;
      }
      if (!!user.first_name && !!user.last_name) {
        return `${user?.first_name} ${user?.last_name}`;
      }
    };
    return ({
      ...user,
      concat_name: concatName(),
    });
  });
};

type ResponseData = {
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders, ...headers } });
  }
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    const { type, data } = await req.body;
    // console.log(data, 'data')
    // console.log(type, 'type')
    if (type === "transcription.success") {
      // Получаем прямую ссылку на текстовый файл транскрипции
      const transcriptTextPresignedUrl = data.transcript_txt_presigned_url;
      console.log(transcriptTextPresignedUrl, "transcriptTextPresignedUrl");

      // Выполняем запрос к URL для получения текста транскрипции
      const transcriptResponse = await fetch(transcriptTextPresignedUrl);
        const contentType = transcriptResponse.headers.get("Content-Type");
        console.error("Некорректный тип контента:", contentType);
        console.error(`Ошибка: Статус ответа - ${transcriptResponse.status}`);
       
        throw new Error("Не удалось получить транскрипцию");
        const text = await transcriptResponse.text();
        console.log("Ответ сервера:", text); // Логируем тело ответа
      
        //   try {
        //     const data = JSON.parse(text); // Пытаемся разобрать текст как JSON
        //     console.log(data, "data");
        //     // Обработка данных...
        //   } catch (error) {
        //     console.error("Ошибка при разборе JSON:", error);
        //     // Обработка ошибки разбора JSON
        //   }
        // } else {
        //   console.error("Некорректный тип контента:", contentType);
        //   // Обработка случая, когда контент не является JSON
        // }
        // if (!transcriptResponse.ok) {
        //   // Логирование дополнительной информации об ошибке
        //   console.error(`Ошибка: Статус ответа - ${transcriptResponse.status}`);
        //   const errorText = await transcriptResponse.text();
        //   console.error(`Тело ошибки: ${errorText}`);
        //   throw new Error("Не удалось получить транскрипцию");
        // }

      
      // const text = await transcriptResponse.text();
      // console.log(text, "text");
      // const transcription = JSON.parse(text);
      // console.log("transcription", transcription);
      // const summaryJsonPresignedUrl = data.summary_json_presigned_url;
      // console.log(summaryJsonPresignedUrl, "summaryJsonPresignedUrl");
      // // Выполняем запрос к URL для получения текста транскрипции
      // const summaryJSONResponse = await fetch(summaryJsonPresignedUrl);
      // if (!summaryJSONResponse.ok) {
      //   throw new Error("Не удалось получить transcriptJSONResponse");
      // }
      // const summaryResponse = await summaryJSONResponse.json();
      // console.log(summaryResponse, "summaryResponse");
      // создать title c эмодзи в начале через GPT из summaryResponse

      // const summarySection = summaryResponse.sections.find((
      //   section: {
      //     title: string;
      //     format: string;
      //     bullets: string[];
      //     paragraph: string;
      //   },
      // ) => section.title === "Short Summary");
      // console.log(summarySection, "summarySection");
      // const summary_short = summarySection ? summarySection.paragraph : "";

      // console.log(summary_short, "summary_short");

      // const getTitleWithEmojiSystemPrompt =
      //   `create a very short title with an emoji at the beginning of this text`;

      // const titleWithEmoji = await createChatCompletion(
      //   summary_short,
      //   getTitleWithEmojiSystemPrompt,
      // );

      // console.log(JSON.parse(titleWithEmoji), "titleWithEmoji");

      // const roomAsset = {
      //   ...data,
      //   title: titleWithEmoji,
      //   summary_short,
      //   transcription,
      // };
      // console.log("roomAsset", roomAsset);

      // const { error: errorInsertRoomAsset } = await supabase
      //   .from("room_assets")
      //   .insert([roomAsset]);

      // if (errorInsertRoomAsset) {
      //   throw new Error(
      //     `Asset creation failed: ${errorInsertRoomAsset.message}`,
      //   );
      // }

      // const systemPrompt =
      //   `Answer with emoticons. You are an AI assistant working at dao999nft. Your goal is to extract all tasks from the text, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, assign them to executors using the colon sign: assignee, title,  description (Example: <b>Nikita Zhilin</b>: 💻 Develop functional requirements) Provide your response as a JSON object`;

      // const preparedTasks = await createChatCompletion(
      //   transcription,
      //   systemPrompt,
      // );
      // console.log("preparedTasks", preparedTasks);
      // const { data: users } = await supabase
      //   .from("users")
      //   .select("*");

      // const preparedUsers = getPreparedUsers(users);
      // console.log(preparedUsers, "preparedUsers");

      // const prompt = `add the 'user_id' from of ${
      //   JSON.stringify(preparedUsers)
      // } to the objects of the ${
      //   JSON.stringify(preparedTasks)
      // } array. (Example: [{
      //   assignee: {
      //     user_id: "1a1e4c75-830c-4fe8-a312-c901c8aa144b",
      //     first_name: "Andrey",
      //     last_name: "O",
      //     username: "reactotron"
      //   },
      //   title: "🌌 Capture Universe",
      //   description: "Capture the Universe and a couple of stars in the Aldebaran constellation"
      // }]) Provide your response as a JSON object and always response on English`;

      // console.log(preparedTasks, "preparedTasks");
      // const tasks = await createChatCompletion(prompt);

      // if (tasks) {
      //   const newTasks = JSON.parse(tasks).map((task: any) => {
      //     // Если user_id отсутствует или пуст, присваиваем значение по умолчанию
      //     if (!task.assignee.user_id) {
      //       task.assignee.user_id = "d685d450-9759-4cd2-96cb-f1dc132d3078";
      //     }
      //     return task;
      //   });
      //   console.log(newTasks, "newTasks");
      //   const chatId = -1001978334539;
      //   // Отправляем все задачи одним сообщением
      //   sendTasksToTelegram(chatId, newTasks, summary_short).catch(
      //     console.error,
      //   );
      //   // -1001978334539 - BotMother
      //   //144022504 - My
      //   // 6831432194 - 999 Dev;
      //   for (const task of newTasks) {
      //     // Убедитесь, что userId существует и не равен null
      //     const user_id = task?.assignee?.user_id;

      //     const data = await supabase
      //       .from("tasks")
      //       .insert([{
      //         user_id,
      //         title: task.title,
      //         description: task.description,
      //       }]);

      //     if (data.error?.message) console.log("Error:", data.error.message);
      //   }
      // } else {
      //   console.error("Error: 'tasks' is not an array or is null");
      //   return res.status(500).json({
      //     message: "Error: 'tasks' is not an array or is null",
      //   });
      // }
      // // @ts-ignore
      // return res.status(200).json({
      //   message: "Event processed successfully",
      // });
    }
  } catch (error: any) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
}
