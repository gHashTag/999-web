import { __DEV__ } from "@/utils/constants";
import { captureExceptionSentry } from "@/utils/sentry";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { InputFile } from "grammy";
//@ts-ignore
import ffmpeg from "fluent-ffmpeg";
import { botAiKoshey } from "@/utils/telegram/bots";

import NextCors from "nextjs-cors";

import { getVideoWithChatId } from "@/supabase/videos";

if (
  !process.env.NEXT_PUBLIC_TELEGRAM_API_ID ||
  !process.env.NEXT_PUBLIC_TELEGRAM_API_HASH
) {
  throw new Error("Telegram API credentials not set");
}

const headers = {
  "Content-Type": "application/json",
};

export type CreateVideoT = {
  event_type: string;
  event_data: {
    video_id: string;
    url: string;
  };
};

type ResponseData = {
  message?: string;
};

async function cropSquareAroundHead(
  inputPath: string,
  outputPath: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const yOffset = 300;
    const size = 1080;
    const outputSize = 480;
    ffmpeg(inputPath)
      .videoFilters([
        `crop=${size}:${size}:in_w/2-${size}/2:in_h/2-${size}/2-${yOffset}`,
        `scale=${outputSize}:${outputSize}`,
      ])
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
}

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
    event_type,
    event_data,
  }: CreateVideoT = await req.body;

  try {
    const videoUrl = event_data.url;

    const video_id = event_data.video_id;

    const videoData = await getVideoWithChatId(video_id);

    if (!videoData) throw new Error("Video not found");
    const { chat_id } = videoData;

    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const videoBuffer = new Uint8Array(await response.arrayBuffer());
    const tempDir = path.join(process.cwd(), "temp");
    const inputFilePath = path.join(tempDir, `${video_id}.mp4`);
    const outputFilePath = path.join(tempDir, `${video_id}_circular.mp4`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    fs.writeFileSync(inputFilePath, videoBuffer);
    console.log("Video saved to", inputFilePath);

    const croppedVideoPath = await cropSquareAroundHead(
      inputFilePath,
      outputFilePath,
    );

    const fileBuffer = fs.readFileSync(croppedVideoPath);
    const inputFile = new InputFile(
      fileBuffer,
      path.basename(croppedVideoPath),
    );

    await botAiKoshey.api.sendVideoNote(chat_id, inputFile);
    return res.status(200).json({ message: "ok" });
  } catch (error: any) {
    captureExceptionSentry(error, "heygen-video");
    return res.status(500).json({ message: JSON.stringify(error) });
  }
}
