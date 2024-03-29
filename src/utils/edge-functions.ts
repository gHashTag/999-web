import { corsHeaders } from "@/pages/api/corsHeaders";
import { supabase } from "./supabase";

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

async function createRoom(name: string, type: string) {
  const url =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-room?secret=${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_SECRET}`;
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
        ...corsHeaders,
      },
      body: JSON.stringify(newData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export { createRoom };
