import { headers } from "./headers";
import { __DEV__, SITE_URL } from "@/pages/_app";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_FUNCTION_SECRET) {
  throw new Error("NEXT_PUBLIC_FUNCTION_SECRET is not set");
}

type CreateRoomProps = {
  user_id: string;
  username: string;
  name: string;
  type: string;
  token: string;
  chat_id: string;
  lang: string;
};

async function createRoom({
  user_id,
  username,
  name,
  type,
  token,
  chat_id,
  lang,
}: CreateRoomProps) {
  const url = `${SITE_URL}/api/create-room`;

  const newData = {
    user_id,
    username,
    name,
    type,
    token,
    chat_id,
    lang,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error(`Error creating room: ${response.statusText}`);
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Error parsing JSON response from server");
    }
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export { createRoom };
