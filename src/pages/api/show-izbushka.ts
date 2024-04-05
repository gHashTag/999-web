import { ResponseData } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveLaunchParams } from "@tma.js/sdk";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { initData } = retrieveLaunchParams();
  console.log(initData, "initData");

  const username = initData?.user?.username;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  console.log(error, "error");
  const user = data && data[0];

  const code = user?.invitation_codes.data[0].code;

  res.redirect(
    302,
    `https://dao999nft.com/workspaceSlug/create-meet/meet/${code}`
  );
}
