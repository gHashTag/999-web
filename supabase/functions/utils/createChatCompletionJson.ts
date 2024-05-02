import OpenAI from "https://deno.land/x/openai@v4.28.0/mod.ts";

const apiKey = Deno.env.get("OPENAI_API_KEY");
const openai = new OpenAI({ apiKey });

export async function createChatCompletionJson(
  prompt: string,
  systemPrompt = "",
) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
      {
        role: "system",
        content: systemPrompt,
      },
    ],
    model: "gpt-4-1106-preview",
    stream: false,
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  return chatCompletion.choices[0].message.content;
}
