import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function getWorkspaceById(workspace_id: string) {
  const supabaseClient = client();
  const { data, error } = await supabaseClient
    .from("workspaces")
    .select("*")
    .eq("workspace_id", workspace_id);
  console.log(error, "error");
  return data;
}

export const client = () => {
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = Deno.env.get(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  const NEXT_PUBLIC_SUPABASE_URL = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");

  const supabaseClient = createClient(
    NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );
  // console.log("supabaseClient", supabaseClient);
  return supabaseClient;
};
