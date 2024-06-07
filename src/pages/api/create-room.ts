import type { NextApiRequest, NextApiResponse } from "next";
import { getWorkspaceById, supabase } from "@/utils/supabase";
import { RoomNode } from "@/types";
import { headers } from "@/helpers/headers";
import NextCors from "nextjs-cors";
// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { __DEV__ } from "@/utils/constants";
import { transliterate } from "@/helpers/api/transliterate";
import { createCodes } from "./create-room-from-tg";

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
      },
    );
  });
};

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
    const {
      user_id,
      name,
      type,
      workspace_id,
      username,
      language_code,
      chat_id,
      token,
    } = await req.body;

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

    const transliterateName = transliterate(name);

    const createOrFetchRoom = async () => {
      const roomData = {
        name: `${transliterateName}:${String(uuidv4())}`,
        description: workspace_id,
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
      // console.log(codesResponse, "codesResponse");

      if (!codesResponse?.ok) {
        throw new Error(`Failed to create codes: ${codesResponse.statusText}`);
      }
      const codes = await codesResponse.json();

      const rooms = {
        ...newRoom,
        codes,
        type,
        name,
        workspace_id,
        updated_at: new Date(),
        user_id,
        room_id: id,
        language_code,
        token,
        chat_id,
        username,
        original_name: name,
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
