import { __DEV__, SITE_URL } from "@/utils/constants";
import { captureExceptionSentry } from "@/utils/sentry";

const headers = {
  "Content-Type": "application/json",
};

type CreateRoom = {
  id: string;
  name: string;
  original_name: string;
  type: string;
  username: string;
  user_id: string;
  token: string;
  chat_id: number;
  language_code: string;
};

async function create100MsRoom({
  id,
  name,
  original_name,
  type,
  username,
  user_id,
  token,
  chat_id,
  language_code,
}: CreateRoom) {
  const url = `${SITE_URL}/api/create-room-from-tg`;

  const newData = {
    id,
    name,
    type,
    username,
    token,
    chat_id,
    language_code,
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
