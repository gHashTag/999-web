import { __DEV__ } from "@apollo/client/utilities/globals";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

const SITE_URL = __DEV__
  ? "http://localhost:3000"
  : process.env.NEXT_PUBLIC_SITE_URL;

const headers = {
  "Content-Type": "application/json",
};

type CreateRoom = {
  name: string;
  type: string;
  username: string | undefined;
  token: string | undefined;
  chat_id: number;
  lang: string | undefined;
};
async function createRoom({
  name,
  type,
  username,
  token,
  chat_id,
  lang,
}: CreateRoom) {
  const url = `${SITE_URL}/api/create-room`;

  const newData = {
    name,
    type,
    username,
    token,
    chat_id,
    lang,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
    },
    body: JSON.stringify(newData),
  });

  const text = await response.text();

  try {
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Error parsing JSON response from server");
  }
}

export { createRoom };
