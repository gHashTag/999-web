import type { NextApiRequest, NextApiResponse } from "next";
import { getWorkspaceById, supabase } from "@/utils/supabase";
import { headers } from "@/helpers/headers";
import NextCors from "nextjs-cors";
import { Bot } from "grammy";
import { translateText } from "@/helpers/api/translateText";
import { createChatCompletion } from "@/helpers/api/createChatCompletion";

import { createChatCompletionJson } from "@/helpers/api/createChatCompletionJson";
import { ResponseData } from "@/types";

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
  language_code: string,
  token: string,
) {
  const newTasks = tasks.map((task) => {
    const assignee = task.assignee.username === null
      ? ""
      : `${task.assignee.first_name} ${task.assignee.last_name} (@${task.assignee.username})`;

    return {
      title: task.title,
      description: task.description,
      assignee,
    };
  });

  let translatedSummaryShort = summary_short;

  if (language_code !== "en") {
    translatedSummaryShort = await translateText(summary_short, language_code);
  }

  const bot = new Bot(token);

  await bot.api.sendMessage(chat_id, `🚀 ${translatedSummaryShort}`);

  for (const task of newTasks) {
    const translatedTask = await translateText(
      `${task.title}\n${task.description}`,
      language_code,
    );
    await bot.api.sendMessage(chat_id, `${translatedTask}\n${task.assignee}`);
  }
}

interface Data {
  room_id: string;
  language_code: string;
  chat_id: number;
  token: string;
  description: string;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...headers } });
  }
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    const { type, data } = await req.body;
    console.log(type, "type");

    if (type === undefined) {
      return res.status(200).json({
        message: "type is undefined",
      });
    }

    if (type === "transcription.success") {
      console.log(data, "data");
      if (!data.room_id) {
        return res.status(200).json({
          message: `check init data ${JSON.stringify(data)}`,
        });
      } else {
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
          }) => section.title === "Short Summary",
        );
        // console.log(summarySection, "summarySection");
        const summary_short = summarySection ? summarySection.paragraph : "";

        // console.log(summary_short, "summary_short");

        const getTitleWithEmojiSystemPrompt =
          `create a very short title with an emoji at the beginning of this text`;

        const titleWithEmoji = await createChatCompletion(
          summary_short,
          getTitleWithEmojiSystemPrompt,
        );
        // console.log(titleWithEmoji, "titleWithEmoji");

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
            `Asset creation failed: ${errorInsertRoomAsset.message}`,
          );
        }

        const systemPrompt =
          `Answer with emoticons. You are an AI assistant working at dao999nft. Your goal is to extract all tasks from the text, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, assign them to executors using the colon sign: assignee, title,  description (Example: <b>Nikita Zhilin</b>: 💻 Develop functional requirements) If no tasks are detected, add one task indicating that no tasks were found. Provide your response as a JSON object`;

        const preparedTasks = await createChatCompletionJson(
          transcription,
          systemPrompt,
        );
        // console.log("preparedTasks", preparedTasks);

        const { data: users } = await supabase.from("users").select("*");

        const preparedUsers = getPreparedUsers(users);
        // console.log(preparedUsers, "preparedUsers");
        const prompt = `add the 'user_id' from of ${
          JSON.stringify(
            preparedUsers,
          )
        } to the objects of the ${
          JSON.stringify(
            preparedTasks,
          )
        } array. (Example: [{
          assignee: {
            user_id: "1a1e4c75-830c-4fe8-a312-c901c8aa144b",
            first_name: "Andrey",
            last_name: "O",
            username: "reactotron"
          },
          title: "🌌 Capture Universe",
          description: "Capture the Universe and a couple of stars in the Aldebaran constellation"
        }]) Provide your response as a JSON object and always response on English`;

        // console.log(preparedTasks, "preparedTasks");
        const tasks = await createChatCompletionJson(prompt);
        const tasksArray = tasks && JSON.parse(tasks).tasks;

        if (Array.isArray(tasksArray)) {
          const newTasks = tasksArray.map((task: any) => {
            // Если user_id отсутствует или пуст, присваиваем значение по умолчанию
            if (!task.assignee.user_id) {
              task.assignee.user_id = "d685d450-9759-4cd2-96cb-f1dc132d3078";
            }
            return task;
          });

          const { data: roomData } = (await supabase
            .from("rooms")
            .select("*")
            .eq("room_id", data.room_id)) as { data: Data[]; error: any };

          const { language_code, chat_id, token, description } = roomData[0];

          const workspace_id = description;

          const workspace = await getWorkspaceById(workspace_id);

          let workspace_name;
          if (workspace) {
            workspace_name = workspace[0].title;
          } else {
            // Обработка случая, когда объект равен null или пустой
            console.log("workspace_name is null");
          }

          if (workspace_name) {
            for (const task of newTasks) {
              // Убедитесь, что userId существует и не равен null
              const user_id = task?.assignee?.user_id;
              // console.log(data.room_id, "data.room_id");
              const taskData = await supabase.from("tasks").insert([
                {
                  user_id,
                  room_id: data.room_id,
                  workspace_id,
                  recording_id: data.recording_id,
                  title: task.title,
                  description: task.description,
                  workspace_name,
                },
              ]);
              // console.log(taskData, "taskData");

              if (taskData.error?.message) {
                console.log("Error:", taskData.error.message);
              }
            }

            if (chat_id) {
              sendTasksToTelegram(
                chat_id,
                newTasks,
                summary_short,
                language_code,
                token,
              ).catch(console.error);
            }
          }
        } else {
          return res.status(500).json({
            message: "Error: 'tasks' is not an array or is null",
          });
        }
        // @ts-ignore
        return res.status(200).json({
          message: "Event processed successfully",
        });
      }
    } else {
      return res.status(200).json({
        message: "type is not equal to transcription.success",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
