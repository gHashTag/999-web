// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { client, getWorkspaceById } from "../utils/client.ts";
import { Bot } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { translateText } from "../utils/translateText.ts";

import { createChatCompletionJson } from "../utils/createChatCompletionJson.ts";
import { corsHeaders } from "../_shared/corsHeaders.ts";
import { headers } from "../_shared/headers.ts";
import { createEmoji } from "../utils/createEmoji.ts";

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

  if (lang !== "en") {
    translatedSummaryShort = await translateText(summary_short, lang);
  }

  const bot = new Bot(token);

  await bot.api.sendMessage(chat_id, `🚀 ${translatedSummaryShort}`);

  for (const task of newTasks) {
    const translatedTask = await translateText(
      `${task.title}\n${task.description}`,
      lang,
    );
    await bot.api.sendMessage(chat_id, `${translatedTask}\n${task.assignee}`);
  }
}

interface Data {
  room_id: string;
  lang: string;
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders, ...headers } });
  }
  const url = new URL(req.url);

  if (
    url.searchParams.get("secret") !==
      Deno.env.get("NEXT_PUBLIC_FUNCTION_SECRET")
  ) {
    return new Response("not allowed", { status: 405 });
  }

  const { type, data } = await req.json();
  console.log(type, "type");

  try {
    const supabaseClient = client();

    if (type === undefined) {
      return new Response(
        JSON.stringify({
          message: "type is undefined",
        }),
        {
          status: 200,
          headers: { ...corsHeaders },
        },
      );
    }

    if (type === "transcription.success") {
      if (!data.room_id) {
        return new Response(
          JSON.stringify({
            message: `check init data ${JSON.stringify(data)}`,
          }),
          {
            status: 200,
            headers: { ...corsHeaders },
          },
        );
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

        const summary_short = summarySection ? summarySection.paragraph : "";

        const titleWithEmoji = await createEmoji(
          summary_short,
        );
        console.log(titleWithEmoji, "titleWithEmoji");

        const roomAsset = {
          ...data,
          title: titleWithEmoji,
          summary_short,
          transcription,
        };

        const { error: errorInsertRoomAsset } = await supabaseClient
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
        console.log("preparedTasks", preparedTasks);

        const { data: users } = await supabaseClient.from("users").select("*");

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
              task.assignee.user_id = "28772cec-eba4-4375-a5a1-090bba2909fa";
            }
            return task;
          });

          const { data: roomData } = (await supabaseClient
            .from("rooms")
            .select("*")
            .eq("room_id", data.room_id)) as { data: Data[]; error: any };
          console.log(roomData, "roomData");
          const { lang, chat_id, token, description } = roomData[0];

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
              const taskData = await supabaseClient.from("tasks").insert([
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
              console.log(taskData, "taskData");

              if (taskData.error?.message) {
                console.log("Error:", taskData.error.message);
              }
            }

            if (chat_id) {
              sendTasksToTelegram(
                chat_id,
                newTasks,
                summary_short,
                lang,
                token,
              ).catch(console.error);
            }
          }
        } else {
          return new Response(
            JSON.stringify({
              message: "workspace_name is null",
            }),
            {
              status: 200,
              headers: { ...corsHeaders },
            },
          );
        }

        return new Response(
          JSON.stringify({
            message: "Event processed successfully",
          }),
          {
            status: 200,
            headers: { ...corsHeaders },
          },
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          message: "type is not equal to transcription.success",
        }),
        {
          status: 200,
          headers: { ...corsHeaders },
        },
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Error: " + err }),
      {
        status: 500,
        headers: { ...corsHeaders },
      },
    );
  }
});

// const transcriptionText =
//   `Dmitrii Vasilev: Thats it. Let's go. So, the first task is to create bots that go to the Moon. The second task is to create bots that go to Mars. The third task is to create bots that go to Venus and colonize them by building a lunar base there. What do you add, Andrey?

// Andrey O: Yes, one more task. After we colonize the lunar base, we will need to capture the Universe and the last task in the Aldebaran constellation will also need to capture a couple of stars in this colony.

// Dmitrii Vasilev: So, we need to understand who will solve this problem through us. Who will not be delegated?

// Andrey O: I think that the last task can be delegated to the head of the transport department.

// Dmitrii Vasilev: Andrey O. `;
