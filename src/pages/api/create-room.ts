import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { RoomNode } from "@/types";
import { corsHeaders, headers } from "@/helpers/headers";
import NextCors from "nextjs-cors";
// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

type ResponseData = {
  rooms?: RoomNode;
  message?: string;
};

if (!process.env.NEXT_PUBLIC_100MS) {
  throw new Error("NEXT_PUBLIC_100MS is not set");
}

const createToken100ms = () => {
  return new Promise((resolve, reject) => {
    const { APP_ACCESS_KEY, APP_SECRET } = process.env;
    const payload = {
      access_key: APP_ACCESS_KEY,
      type: "management",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    jwt.sign(
      payload,
      APP_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "24h",
        jwtid: uuidv4(),
      },
      (err: any, token: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders, ...headers } });
  }
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    const { name, type, email, lang, chat_id, token } = await req.body;
    console.log(req.body, "req.body");
    const { data, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (!data) {
      throw new Error(`User not found: ${email}`);
    }

    const user_id = data[0].user_id;
    console.log(user_id, "user_id");
    const createOrFetchRoom = async () => {
      const roomData = {
        name: `${name}-${uuidv4()}-${lang}`,
        description: name,
        template_id:
          type === "audio-space"
            ? "65e84b5148b3dd31b94ff005"
            : "65efdfab48b3dd31b94ff0dc",
        enabled: true,
      };
      console.log(roomData, "roomData");
      const newToken = await createToken100ms();
      console.log(newToken, "newToken");
      const roomResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "POST",
        body: JSON.stringify({ ...roomData }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_100MS}`,
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
        lang,
        token,
        chat_id,
      };

      delete rooms.id;

      return rooms;
    };

    const rooms = await createOrFetchRoom();

    const { error } = await supabase.from("rooms").insert({
      ...rooms,
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

export async function createCodes(room_id: string, token: string) {
  try {
    const response = await fetch(
      `https://api.100ms.live/v2/room-codes/room/${room_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_100MS}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
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