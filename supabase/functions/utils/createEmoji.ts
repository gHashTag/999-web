import OpenAI from "https://deno.land/x/openai@v4.28.0/mod.ts";

const apiKey = Deno.env.get("OPENAI_API_KEY");
const openai = new OpenAI({ apiKey });

const systemPrompt =
  `create a very short title with an emoji at the beginning of this text`;

export async function createEmoji(
  prompt: string,
) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{
      role: "user",
      content: prompt,
    }, {
      role: "system",
      content: systemPrompt,
    }],
    model: "gpt-3.5-turbo-1106",
    stream: false,
    temperature: 0.1,
  });

  return chatCompletion.choices[0].message.content;
}
