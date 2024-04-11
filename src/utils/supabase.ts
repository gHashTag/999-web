"use client";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getWorkspaceById(workspace_id: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("workspace_id", workspace_id);
  console.log(error, "error");
  return data;
}

export async function getWorkspaceByName(name: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("name", name);
  console.log(error, "error");
  return data;
}
export { supabase };
