import { headers } from "./headers";
import { __DEV__, SITE_URL } from "@/pages/_appNew";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_FUNCTION_SECRET) {
  throw new Error("NEXT_PUBLIC_FUNCTION_SECRET is not set");
}

async function createRoom(name: string, type: string) {
  const url = `${SITE_URL}/api/create-room`;
  const email = localStorage.getItem("email");

  const newData = {
    name,
    type,
    email,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: JSON.stringify(newData),
    });
    console.log(response, "response");
    if (!response.ok) {
      throw new Error(`Error creating room: ${response.statusText}`);
    }

    const text = await response.text();
    console.log(text, "text");
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
