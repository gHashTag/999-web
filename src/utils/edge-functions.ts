import { corsHeaders } from "@/pages/api/corsHeaders";
import { supabase } from "./supabase";
import { headers } from "./headers";

// const getUserFromSupabase = async () => {
//   const userSupabase = useReactiveVar(setUserSupabase);

//   try {
//     if (userSupabase) {
//       const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .eq("email", userSupabase.email);

//       if (error) {
//         console.error("error", error);
//         throw error;
//       }

//       return data;
//     }
//   } catch (error: any) {
//     throw error.response?.data ?? error;
//   }
// };
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_FUNCTION_SECRET) {
  throw new Error("NEXT_PUBLIC_FUNCTION_SECRET is not set");
}

async function createRoom(name: string, type: string) {
  const url =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-room?secret=${process.env.NEXT_PUBLIC_FUNCTION_SECRET}`;
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

    if (!response.ok) {
      throw new Error(`Error creating room: ${response.statusText}`);
    }

    // Проверяем, есть ли содержимое для чтения
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }

    const text = await response.text(); // Сначала получаем текст
    try {
      const data = JSON.parse(text); // Пытаемся разобрать текст как JSON
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
