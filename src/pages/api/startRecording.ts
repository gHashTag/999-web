// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Recorder } from '@huddle01/server-sdk/recorder';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;

  if (!process.env.NEXT_PUBLIC_PROJECT_ID && !process.env.API_KEY) {
    return res
      .status(400)
      .json({ error: 'NEXT_PUBLIC_PROJECT_ID and API_KEY are required' });
  }

  const recorder = new Recorder(
    process.env.NEXT_PUBLIC_PROJECT_ID!,
    process.env.API_KEY!
  );

  const token = new AccessToken({
    apiKey: process.env.API_KEY!,
    roomId: roomId as string,
    role: Role.BOT,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const accessToken = await token.toJwt();

  const recording = await recorder.startRecording({
    roomId: roomId as string,
    token: accessToken,
  });

  console.log('recording', recording);

  return res.status(200).json({ recording });
}
