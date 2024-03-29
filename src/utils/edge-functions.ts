import { corsHeaders } from "@/pages/api/corsHeaders";
import { supabase } from "./supabase";
import { headers } from "./headers";
import { __DEV__, SITE_URL } from "@/pages/_app";

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
console.log(SITE_URL, "SITE_URL");
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

    const text = await response.text(); // Сначала получаем текст
    console.log(text, "text");
    try {
      const data = JSON.parse(text); // Пытаемся разобрать текст как JSON
      console.log(data, "data");
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
