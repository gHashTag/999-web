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

async function createRoom(name: string, type: string, room_id: string) {
  const url =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-room?secret=${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_SECRET}`;
  const email = localStorage.getItem("email");
  const newData = {
    name,
    type,
    email,
    room_id,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export async function getAllRecordings(room_id: string, slug: string) {
  try {
    const { data } = await supabase
      .from("room_assets")
      .select("*")
      .eq("room_id", room_id)
      .eq("room_name", slug);

    return data;
  } catch (error) {
    console.error("Error get getAllRecordings", error);
    throw error;
  }
}

export { createRoom };
