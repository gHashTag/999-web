import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { RoomNode } from "@/types";
import { headers } from "@/helpers/headers";
import NextCors from "nextjs-cors";
// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { __DEV__ } from "@/utils/constants";
import { transliterate } from "@/helpers/api/transliterate";

type ResponseData = {
  rooms?: RoomNode;
  message?: string;
};

if (!process.env.NEXT_PUBLIC_100MS) {
  throw new Error("NEXT_PUBLIC_100MS is not set");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...headers } });
  }
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    const { id, name, type, username, user_id, language_code, chat_id, token } =
      await req.body;

    const { data: dataRooms, error: errorRooms } = await supabase
      .from("rooms")
      .select("*")
      .eq("username", username)
      .order("id", { ascending: false });

    const lastElement = dataRooms && dataRooms[0];

    const translateName = transliterate(lastElement?.name);

    const { data, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    // console.log(data, "data");
    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (!data) {
      throw new Error(`User not found: ${username}`);
    }

    const createOrFetchRoom = async () => {
      const roomData = {
        name: `${name}:${uuidv4()}:${language_code}`,
        description: name,
        template_id: type === "audio-space"
          ? "65e84b5148b3dd31b94ff005"
          : "65efdfab48b3dd31b94ff0dc",
        enabled: true,
      };

      const newToken = process.env.NEXT_PUBLIC_100MS;

      const roomResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "POST",
        body: JSON.stringify({ ...roomData }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (!roomResponse.ok) {
        throw new Error(`Failed to create room: ${roomResponse.statusText}`);
      }
      const newRoom = await roomResponse.json();

      const id = newRoom.id;
      const codesResponse = await createCodes(id, newToken as string);

      if (!codesResponse?.ok) {
        throw new Error(`Failed to create codes: ${codesResponse.statusText}`);
      }
      const codes = await codesResponse.json();

      const rooms = {
        ...newRoom,
        codes,
        type,
        name,
        updated_at: new Date(),
        user_id,
        room_id: id,
        language_code,
        token,
        chat_id,
        username,
        workspace_id: lastElement?.workspace_id,
      };

      delete rooms.id;

      return rooms;
    };

    const rooms = await createOrFetchRoom();

    const { error } = await supabase
      .from("rooms")
      .update({
        ...rooms,
      })
      .eq("id", id);
    if (error) {
      throw new Error(`Error saving to Supabase: ${error.message}`);
    }
    // @ts-ignore
    return res.status(200).json({ rooms });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createCodes(room_id: string, token: string) {
  try {
    const response = await fetch(
      `https://api.100ms.live/v2/room-codes/room/${room_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
