import { __DEV__ } from "@/utils/constants";
import { captureExceptionSentry } from "@/utils/sentry";
import type { NextApiRequest, NextApiResponse } from "next";

import {
  checkUsernameCodesByUserId,
  createUser,
  getSelectIzbushkaId,
  setMyWorkspace,
  setPassport,
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
  select_izbushka: string;
};

type ResponseData = {
  user_id?: string;
  passport_id_owner?: string;
  passport_id_user?: string;
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
    id,
    inviter,
    username,
    first_name,
    last_name,
    is_bot,
    language_code,
    select_izbushka,
    chat_id,
  }: CreateUserT = await req.body;

  try {
    // check if inviter exists
    const { isInviterExist, invitation_codes, inviter_user_id } =
      await checkUsernameCodesByUserId(inviter);

    if (isInviterExist) {
      const newUser = {
        username,
        first_name,
        last_name: last_name || "",
        is_bot,
        language_code,
        inviter: inviter_user_id,
        invitation_codes,
        telegram_id: id,
        select_izbushka,
        email: "",
        photo_url: "",
      };

      const { user_id } = await createUser(newUser);
      console.log(user_id, "user_id");
      // create workspace
      if (user_id) {
        const workspace_id = await setMyWorkspace(user_id);

        //Create or get a room
        const rooms = await createOrFetchRoom({
          username,
          first_name,
          last_name: last_name || "",
          language_code,
          user_id,
          chat_id,
          workspace_id,
          token: tokenAiKoshey,
        });

        const passport = {
          user_id,
          workspace_id,
          room_id: rooms.room_id,
          username,
          first_name,
          last_name: last_name || "",
          chat_id: id,
          type: "room",
          is_owner: true,
        };
        console.log(passport, "passport");

        if (!passport) {
          return res.status(500).json({ message: "Passport not created" });
        }

        try {
          const passport_id_owner = await setPassport(passport);
          const { izbushka } = await getSelectIzbushkaId(select_izbushka);
          console.log(izbushka, "izbushka");
          if (
            !izbushka || !izbushka.workspace_id || !izbushka.room_id ||
            !izbushka.chat_id
          ) {
            return res.status(500).json({ message: "Izbushka not found" });
          }
          const passport_user = {
            user_id,
            workspace_id: izbushka.workspace_id,
            room_id: izbushka.room_id,
            username,
            first_name,
            last_name: last_name || "",
            chat_id: izbushka.chat_id,
            type: "room",
            is_owner: false,
          };
          console.log(passport_user, "passport_user");
          const passport_id_user = await setPassport(passport_user);

          return res.status(200).json({
            user_id,
            passport_id_owner,
            passport_id_user,
            workspace_id,
            rooms_id: rooms.room_id,
            message: `User created successfully`,
          });
        } catch (error) {
          captureExceptionSentry(error, "create-user");
        }
      } else {
        return res.status(500).json({ message: "Workspace not created" });
      }
    } else {
      return res.status(500).json({ message: "User not found" });
    }
  } catch (error: any) {
    captureExceptionSentry(error, "create-user");
    return res.status(500).json({ message: error.message });
  }
}
