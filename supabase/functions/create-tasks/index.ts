// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { client } from "../utils/client.ts";
import { createChatCompletion } from "../utils/createChatCompletion.ts";
import { Bot } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { translateText } from "../utils/translateText.ts";
// import { headers } from "../utils/100ms/headers.ts";
import { corsHeaders } from "../_shared/cors.ts";
const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN") || "");

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

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
    return new Response("not allowed", { status: 405 });
  }

  try {
    const supabaseClient = client();
    const { type, data } = await req.json();

    if (type === "transcription.success") {
      console.log(data, "data");
      // Получаем прямую ссылку на текстовый файл транскрипции
      const transcriptTextPresignedUrl = data.transcript_txt_presigned_url;
      // Выполняем запрос к URL для получения текста транскрипции
      const transcriptResponse = await fetch(transcriptTextPresignedUrl);
      if (!transcriptResponse.ok) {
        throw new Error("Не удалось получить транскрипцию");
      }
      const transcription = await transcriptResponse.text();

      const summaryJsonPresignedUrl = data.summary_json_presigned_url;
      // Выполняем запрос к URL для получения текста транскрипции
      const summaryJSONResponse = await fetch(summaryJsonPresignedUrl);
      if (!summaryJSONResponse.ok) {
        throw new Error("Не удалось получить transcriptJSONResponse");
      }
      const summaryResponse = await summaryJSONResponse.json();

      // создать title c эмодзи в начале через GPT из summaryResponse

      const summarySection = summaryResponse.sections.find((
        section: {
          title: string;
          format: string;
          bullets: string[];
          paragraph: string;
        },
      ) => section.title === "Short Summary");
      console.log(summarySection, "summarySection");
      const summary_short = summarySection ? summarySection.paragraph : "";

      console.log(summary_short, "summary_short");

      const getTitleWithEmojiSystemPrompt =
        `create a very short title with an emoji at the beginning of this text`;

      const titleWithEmoji = await createChatCompletion(
        summary_short,
        getTitleWithEmojiSystemPrompt,
      );
      console.log(titleWithEmoji, "titleWithEmoji");

      const roomAsset = {
        ...data,
        title: "titleWithEmoji",
        summary_short,
        transcription,
      };
      console.log("roomAsset", roomAsset);

      const { error: errorInsertRoomAsset } = await supabaseClient
        .from("room_assets")
        .insert([roomAsset]);

      if (errorInsertRoomAsset) {
        throw new Error(
          `Asset creation failed: ${errorInsertRoomAsset.message}`,
        );
      }

      const systemPrompt =
        `Answer with emoticons. You are an AI assistant working at dao999nft. Your goal is to extract all tasks from the text, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, the maximum number of tasks, assign them to executors using the colon sign: assignee, title,  description (Example: <b>Nikita Zhilin</b>: 💻 Develop functional requirements) Provide your response as a JSON object`;

      const preparedTasks = await createChatCompletion(
        transcription,
        systemPrompt,
      );
      console.log("preparedTasks", preparedTasks);
      const { data: users } = await supabaseClient
        .from("users")
        .select("*");

      const preparedUsers = getPreparedUsers(users);
      console.log(preparedUsers, "preparedUsers");

      const prompt = `add the 'user_id' from of ${
        JSON.stringify(preparedUsers)
      } to the objects of the ${
        JSON.stringify(preparedTasks)
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

      console.log(preparedTasks, "preparedTasks");
      const tasks = await createChatCompletion(prompt);

      if (tasks) {
        const newTasks = JSON.parse(tasks).map((task: any) => {
          // Если user_id отсутствует или пуст, присваиваем значение по умолчанию
          if (!task.assignee.user_id) {
            task.assignee.user_id = "d685d450-9759-4cd2-96cb-f1dc132d3078";
          }
          return task;
        });
        console.log(newTasks, "newTasks");
        const chatId = -1001978334539;
        // Отправляем все задачи одним сообщением
        sendTasksToTelegram(chatId, newTasks, summary_short).catch(
          console.error,
        );
        // -1001978334539 - BotMother
        //144022504 - My
        // 6831432194 - 999 Dev;
        for (const task of newTasks) {
          // Убедитесь, что userId существует и не равен null
          const user_id = task?.assignee?.user_id;

          const data = await supabaseClient
            .from("tasks")
            .insert([{
              user_id,
              title: task.title,
              description: task.description,
            }]);

          if (data.error?.message) console.log("Error:", data.error.message);
        }
      } else {
        console.error("Error: 'tasks' is not an array or is null");
        return new Response(
          JSON.stringify({ message: "Event type not supported" }),
          {
            status: 400,
            headers: { ...corsHeaders },
          },
        );
      }

      return new Response(
        JSON.stringify({ message: "Event processed successfully" }),
        {
          status: 200,
          headers: { ...corsHeaders },
        },
      );
    }
  } catch (err) {
    console.error(err);
  }

  return new Response(
    JSON.stringify({ message: "Event processed successfully" }),
    {
      status: 200,
      headers: { ...corsHeaders },
    },
  );
});

// const transcriptionText =
//   `Dmitrii Vasilev: Thats it. Let's go. So, the first task is to create bots that go to the Moon. The second task is to create bots that go to Mars. The third task is to create bots that go to Venus and colonize them by building a lunar base there. What do you add, Andrey?

// Andrey O: Yes, one more task. After we colonize the lunar base, we will need to capture the Universe and the last task in the Aldebaran constellation will also need to capture a couple of stars in this colony.

// Dmitrii Vasilev: So, we need to understand who will solve this problem through us. Who will not be delegated?

// Andrey O: I think that the last task can be delegated to the head of the transport department.

// Dmitrii Vasilev: Andrey O. `;
