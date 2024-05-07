import { __DEV__ } from "@/pages/_app";
import { captureExceptionSentry } from "@/utils/sentry";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

const SITE_URL = __DEV__
  ? process.env.NEXT_PUBLIC_LOCAL_URL
  : process.env.NEXT_PUBLIC_SITE_URL;

const headers = {
  "Content-Type": "application/json",
};

type CreateRoom = {
  id: string;
  name: string;
  type: string;
  username: string | undefined;
  token: string | undefined;
  chat_id: number;
  lang: string | undefined;
};
async function create100MsRoom({
  id,
  name,
  type,
  username,
  token,
  chat_id,
  lang,
}: CreateRoom) {
  const url = `${SITE_URL}/api/create-room-from-tg`;

  const newData = {
    id,
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
    captureExceptionSentry("Error parsing JSON", "create100MsRoom");
    throw new Error("Error parsing JSON response from server");
  }
}

export { create100MsRoom };
