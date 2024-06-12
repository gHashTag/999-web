import { __DEV__ } from "@/utils/constants";
import { captureExceptionSentry } from "@/utils/sentry";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { InputMedia, TelegramClient } from "@mtcute/node";
//@ts-ignore
import ffmpeg from "fluent-ffmpeg";
import { botAiKoshey, tokenAiKoshey } from "@/utils/telegram/bots";

import NextCors from "nextjs-cors";
import { createOrFetchRoom } from "@/utils/100ms/helpers";
import { getVideoWithChatId } from "@/supabase/videos";

if (
  !process.env.NEXT_PUBLIC_TELEGRAM_API_ID ||
  !process.env.NEXT_PUBLIC_TELEGRAM_API_HASH
) {
  throw new Error("Telegram API credentials not set");
}

const tg = new TelegramClient({
  apiId: Number(process.env.NEXT_PUBLIC_TELEGRAM_API_ID),
  apiHash: process.env.NEXT_PUBLIC_TELEGRAM_API_HASH,
  // storage: "my-account.session",
});

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

// async function resizeVideo(
//   inputPath: string,
//   width: number,
//   height: number,
// ): Promise<void> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(inputPath)
//       .size(`${width}x${height}`)
//       .on("end", resolve)
//       .on("error", reject)
//       .run();
//   });
// }

async function uploadAndSendVideo(
  filePath: string,
  videoUrl: string,
  chatId: number,
  name: string,
  res: NextApiResponse<ResponseData>,
) {
  try {
    // // Загрузка видеофайла
    const file = await fetch(videoUrl);
    console.log(file, "file");
    // Загрузка видеофайла
    const videoFile = await tg.uploadFile({
      file,
      fileName: `${name}.mp4`,
      fileMime: "video/mp4",
    });
    // console.log(videoFile, "videoFile");

    // Отправляем видеофайл боту
    const video = await tg.sendMedia(
      "@ai_koshey_bot",
      InputMedia.video(videoFile),
      {
        caption: name,
      },
    );
    // // @ts-ignore
    // if (!video?.media?.fileId) throw new Error("Video not sent");
    // // @ts-ignore
    // const fileId = video.media.fileId;
    // console.log("File ID:", fileId);

    // await botAiKoshey.api.sendVideo(chatId, fileId, {
    //   width: 1920,
    //   height: 1080,
    // });
    return res.status(200).json({ message: "Video sent successfully" });
  } catch (error) {
    console.error("Error uploading and sending video:", error);
  }
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
    console.log(chat_id, "chat_id");
    //Скачиваем видео
    const response = await fetch(videoUrl);

    const videoBuffer = new Uint8Array(await response.arrayBuffer());

    const tempDir = path.join(process.cwd(), "temp");
    const filePath = path.join(tempDir, `${video_id}.mp4`);

    // Проверяем и создаем директорию, если она не существует
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    fs.writeFileSync(filePath, videoBuffer);
    console.log("Video saved to", filePath);
    // const video = InputMediaBuilder.video(new InputFile(tempFilePath));
    // console.log(video, "video");

    tg.run({
      botToken: tokenAiKoshey,
    }, async (self) => {
      console.log(`Logged in as ${self.displayName}`);
    });

    // tg.run({
    //   phone: () => tg.input("Phone > "),
    //   code: () => tg.input("Code > "),
    //   password: () => tg.input("Password > "),
    // }, async (self) => {
    //   console.log(`Logged in as ${self.displayName}`);
    // });

    // await uploadAndSendVideo(filePath, videoUrl, chat_id, video_id, res);

    // Загружаем видео и получаем file_id
    // const fileId = await uploadFileAndGetFileId(tempFilePath);
    // console.log(fileId, "fileId");

    // await setVideoUrl(video_id, videoUrl)
    await tg.sendText(chat_id, "test");
  } catch (error: any) {
    captureExceptionSentry(error, "heygen-video");
    return res.status(500).json({ message: JSON.stringify(error) });
  }
}
