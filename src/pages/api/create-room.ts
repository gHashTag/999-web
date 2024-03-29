import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { RoomNode } from "@/types";
export const headers = {
  "Content-Type": "application/json",
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

if (!process.env.NEXT_PUBLIC_100MS) {
  throw new Error("NEXT_PUBLIC_100MS is not set");
}

export const myHeaders = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_100MS}`,
  "Content-Type": "application/json",
};

type ResponseData = {
  rooms?: RoomNode;
  message?: string;
};

export async function createCodes(room_id: string) {
  try {
    const response = await fetch(
      `https://api.100ms.live/v2/room-codes/room/${room_id}`,
      {
        headers: myHeaders,
        method: "POST",
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error creating codes:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders, ...headers } });
  }
  // let token;
  // try {
  //   if (!app_secret) {
  //     throw new Error("Secret not found");
  //   }
  //   token = await create(header, payload, cryptoKey);
  // } catch (err) {
  //   console.error("Токен недействителен:", err);
  // }

  try {
    // const url = new URL(req.url);
    // if (
    //   url.searchParams.get("secret") !==
    //     Deno.env.get("NEXT_PUBLIC_FUNCTION_SECRET")
    // ) {
    //   return new Response("Not allowed", {
    //     status: 405,
    //     headers: { ...headers, ...corsHeaders },
    //   });
    // }

    const { name, type, email } = await req.body;

    const { data, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (!data) {
      throw new Error(`User not found: ${email}`);
    }

    const user_id = data[0].user_id;

    const createOrFetchRoom = async () => {
      const roomData = {
        name,
        description: user_id,
        template_id: "65efdfab48b3dd31b94ff0dc",
        enabled: true,
      };

      const roomResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "POST",
        body: JSON.stringify({ ...roomData }),
        headers: { ...myHeaders },
      });
      // console.log(roomResponse, "roomResponse");
      if (!roomResponse.ok) {
        throw new Error(`Failed to create room: ${roomResponse.statusText}`);
      }
      const newRoom = await roomResponse.json();
      // console.log(newRoom, "newRoom");
      const id = newRoom.id;
      const codesResponse = await createCodes(id);
      // console.log(codesResponse, "codesResponse");

      if (!codesResponse?.ok) {
        throw new Error(`Failed to create codes: ${codesResponse.statusText}`);
      }
      const codes = await codesResponse.json();
      // console.log(codes, "codes");
      const rooms = {
        codes,
        type,
        name,
        updated_at: new Date(),
        user_id,
        room_id: id,
      };

      return rooms;
    };

    const rooms = await createOrFetchRoom();
    // console.log(rooms, "rooms");
    const { error } = await supabase.from("rooms").insert({
      ...rooms,
      id: undefined,
    });
    if (error) {
      throw new Error(`Error saving to Supabase: ${error.message}`);
    }
    // @ts-ignore
    return res.status(200).json({ rooms });
  } catch (error: any) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
}
