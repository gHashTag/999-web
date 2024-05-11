export const DEV = process.env.DEV === "true" ? true : false;

if (!process.env.LOCAL_URL) {
  throw new Error("LOCAL_URL is not set");
}

if (!process.env.PRODUCTION_URL) {
  throw new Error("PRODUCTION_URL is not set");
}

if (!process.env.DEV) {
  throw new Error("DEV is not set");
}

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not set");
}

export const SITE_URL = DEV
  ? process.env.LOCAL_URL
  : process.env.PRODUCTION_URL;

export const PRODUCTION_URL = process.env.PRODUCTION_URL;

export const headers = {
  "Content-Type": "application/json",
};
