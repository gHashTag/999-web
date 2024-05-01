async function getAiFeedback(query: string) {
  const AI_APIKEY = process.env.TELEGRAM_BOT_TOKEN ?? "";
  const response = await fetch(
    "https://flowiseai-railway-production-758e.up.railway.app/api/v1/prediction/46937ed0-41df-4c9c-80f9-f3056a1b81c9",
    {
      headers: {
        Authorization: `${AI_APIKEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ question: query }),
    },
  );
  const result = await response.json();
  return result.text;
}

export { getAiFeedback };
