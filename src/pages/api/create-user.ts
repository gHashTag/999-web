import { __DEV__ } from "@/utils/constants";
import { captureExceptionSentry } from "@/utils/sentry";
import type { NextApiRequest, NextApiResponse } from "next";

import {
  checkUsernameCodesByUserId,
  createUser,
  setMyPassport,
  setMyWorkspace,
} from "@/utils/supabase";

import { tokenAiKoshey } from "@/utils/telegram/bots";

import NextCors from "nextjs-cors";
import { createOrFetchRoom } from "@/utils/100ms/helpers";

const headers = {
  "Content-Type": "application/json",
};

export type CreateUserT = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_bot: boolean;
  language_code: string;
  chat_id: number;
  inviter: string;
};

type ResponseData = {
  passport_id?: string;
  workspace_id?: string;
  rooms_id?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  // Check the request method
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...headers } });
  }
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const {
    inviter,
  }: CreateUserT = await req.body;

  try {
    // check if inviter exists
    const { isInviterExist, invitation_codes, inviter_user_id } =
      await checkUsernameCodesByUserId(inviter);

    if (isInviterExist) {
      const newUser = {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        is_bot: req.body.is_bot,
        language_code: req.body.language_code,
        inviter: inviter_user_id,
        invitation_codes,
        telegram_id: req.body.id,
        email: "",
        photo_url: "",
      };

      const { user_id } = await createUser(newUser);
      // create workspace
      const workspace_id = await setMyWorkspace(user_id);

      //Create or get a room
      const rooms = await createOrFetchRoom({
        id: req.body.id,
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        language_code: req.body.language_code,
        user_id,
        chat_id: req.body.chat_id,
        workspace_id,
        token: tokenAiKoshey,
      });

      const passport = {
        user_id,
        workspace_id,
        room_id: rooms.room_id,
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        chat_id: req.body.chat_id,
        type: "room",
      };

      const passport_id = await setMyPassport(passport);

      return res.status(200).json({
        passport_id,
        workspace_id,
        rooms_id: rooms.room_id,
        message: `User created successfully`,
      });
    } else {
      return res.status(500).json({ message: "User not found" });
    }
  } catch (error: any) {
    captureExceptionSentry(error, "create-user");
    return res.status(500).json({ message: error.message });
  }
}
