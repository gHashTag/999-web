if (!process.env.NEXT_PUBLIC_LOCAL_URL) {
  throw new Error("NEXT_PUBLIC_LOCAL_URL is not set");
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}

export var __DEV__ = process.env.NODE_ENV !== "production";

export const SITE_URL = __DEV__
  ? process.env.NEXT_PUBLIC_LOCAL_URL
  : process.env.NEXT_PUBLIC_SITE_URL;

export const headers = {
  "Content-Type": "application/json",
};

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  throw new Error("NEXT_PUBLIC_SENTRY_DSN is not set");
}

if (!process.env.NEXT_PUBLIC_DEV) {
  throw new Error("NEXT_PUBLIC_DEV is not set");
}

export const botName = __DEV__ ? "dao999nft_dev_bot" : "ai_koshey_bot";

console.log(botName, "botName");
