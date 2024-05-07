import { captureExceptionSentry } from "@/utils/sentry";

export async function checkSubscription(
  ctx: any,
  userId: number,
  channelId: string,
): Promise<boolean> {
  try {
    const member = await ctx.api.getChatMember(channelId, userId);
    return member.status !== "left" && member.status !== "kicked";
  } catch (error) {
    captureExceptionSentry("Error checking subscription", "checkSubscription");
    return false;
  }
}
