import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { RoomNode } from "@/types";
import { corsHeaders, headers } from "@/helpers/headers";
import NextCors from "nextjs-cors";
import { Bot } from "grammy";
import { translateText } from "@/helpers/api/translateText";
import { translateTaskJson } from "@/helpers/api/translateTaskJson";
import { createChatCompletion } from "@/helpers/api/createChatCompletion";

import { createChatCompletionJson } from "@/helpers/api/createChatCompletionJson";

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
  chat_id: number,
  tasks: Task[],
  summary_short: string,
  lang: string,
  token: string
) {
  const newTasks = tasks.map((task) => ({
    title: task.title,
    description: task.description,
    assignee: `${task.assignee.first_name} ${task.assignee.last_name} (@${task.assignee.username})`,
  }));
  console.log(newTasks, "newTasks");
  let translatedSummaryShort = summary_short;

  if (lang !== "en") {
    translatedSummaryShort = await translateText(summary_short, lang);
  }

  console.log(translatedSummaryShort, "translatedSummaryShort");

  const bot = new Bot(token);

  await bot.api.sendMessage(chat_id, `🚀 ${translatedSummaryShort}`);

  for (const task of newTasks) {
    const translatedTask = await translateText(
      `${task.title}\n${task.description}`,
      lang
    );
    await bot.api.sendMessage(chat_id, `${translatedTask}\n${task.assignee}`);
  }
  // @ts-ignore
  return res.status(200).json({
    message: "Event processed successfully",
  });
}

interface Data {
  room_id: string;
  lang: string;
  chat_id: number;
  token: string;
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
    return {
      ...user,
      concat_name: concatName(),
    };
  });
};

type ResponseData = {
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
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

    if (type === "transcription.success") {
      // Получаем прямую ссылку на текстовый файл транскрипции
      const transcriptTextPresignedUrl = data.transcript_txt_presigned_url;

      // Выполняем запрос к URL для получения текста транскрипции
      const transcriptResponse = await fetch(transcriptTextPresignedUrl);

      const transcription = await transcriptResponse.text();

      const summaryJsonPresignedUrl = data.summary_json_presigned_url;

      const summaryJSONResponse = await fetch(summaryJsonPresignedUrl);
      if (!summaryJSONResponse.ok) {
        throw new Error("Не удалось получить transcriptJSONResponse");
      }
      const summaryResponse = await summaryJSONResponse.json();
      // console.log(summaryResponse, "summaryResponse");

      const summarySection = summaryResponse.sections.find(
        (section: {
          title: string;
          format: string;
          bullets: string[];
          paragraph: string;
        }) => section.title === "Short Summary"
      );
      // console.log(summarySection, "summarySection");
      const summary_short = summarySection ? summarySection.paragraph : "";

      // console.log(summary_short, "summary_short");

      const getTitleWithEmojiSystemPrompt = `create a very short title with an emoji at the beginning of this text`;

      const titleWithEmoji = await createChatCompletion(
        summary_short,
        getTitleWithEmojiSystemPrompt
      );
      console.log(titleWithEmoji, "titleWithEmoji");

      const roomAsset = {
        ...data,
        title: titleWithEmoji,
        summary_short,
        transcription,
      };
      // console.log("roomAsset", roomAsset);

      const { error: errorInsertRoomAsset } = await supabase
        .from("room_assets")
        .insert([roomAsset]);

      if (errorInsertRoomAsset) {
        throw new Error(
          `Asset creation failed: ${errorInsertRoomAsset.message}`
        );
      }

      const systemPrompt = `Answer with emoticons. You are an AI assistant working at dao999nft. Your goal is to extract all tasks from the text, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, assign them to executors using the colon sign: assignee, title,  description (Example: <b>Nikita Zhilin</b>: 💻 Develop functional requirements) Provide your response as a JSON object`;

      const preparedTasks = await createChatCompletionJson(
        transcription,
        systemPrompt
      );
      console.log("preparedTasks", preparedTasks);
      const { data: users } = await supabase.from("users").select("*");

      const preparedUsers = getPreparedUsers(users);
      console.log(preparedUsers, "preparedUsers");

      const prompt = `add the 'user_id' from of ${JSON.stringify(
        preparedUsers
      )} to the objects of the ${JSON.stringify(
        preparedTasks
      )} array. (Example: [{
        assignee: {
          user_id: "1a1e4c75-830c-4fe8-a312-c901c8aa144b",
          first_name: "Andrey",
          last_name: "O",
          username: "reactotron"
        },
        title: "🌌 Capture Universe",
        description: "Capture the Universe and a couple of stars in the Aldebaran constellation"
      }]) Provide your response as a JSON object and always response on English`;

      console.log(preparedTasks, "preparedTasks");
      const tasks = await createChatCompletionJson(prompt);

      const tasksArray = tasks && JSON.parse(tasks).tasks;
      console.log(tasksArray, "tasksArray");
      if (Array.isArray(tasksArray)) {
        const newTasks = tasksArray.map((task: any) => {
          // Если user_id отсутствует или пуст, присваиваем значение по умолчанию
          if (!task.assignee.user_id) {
            task.assignee.user_id = "d685d450-9759-4cd2-96cb-f1dc132d3078";
          }
          return task;
        });
        console.log(newTasks, "newTasks");

        const { data: roomData } = (await supabase
          .from("rooms")
          .select("*")
          .eq("room_id", data.room_id)) as { data: Data[]; error: any };

        const { lang, chat_id, token } = roomData[0];

        if (chat_id) {
          sendTasksToTelegram(
            chat_id,
            newTasks,
            summary_short,
            lang,
            token
          ).catch(console.error);
        }

        for (const task of newTasks) {
          // Убедитесь, что userId существует и не равен null
          const user_id = task?.assignee?.user_id;

          const taskData = await supabase.from("tasks").insert([
            {
              user_id,
              title: task.title,
              description: task.description,
              room_id: data.room_id,
            },
          ]);

          if (taskData.error?.message)
            console.log("Error:", taskData.error.message);
        }
      } else {
        console.error("Error: 'tasks' is not an array or is null");
        return res.status(500).json({
          message: "Error: 'tasks' is not an array or is null",
        });
      }
    }
  } catch (error: any) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
}
