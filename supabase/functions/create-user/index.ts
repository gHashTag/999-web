import { corsHeaders } from "../_shared/cors.ts";
import { client } from "../utils/client.ts";

Deno.serve(async (req) => {
  const supabaseClient = client();

  const {
    first_name,
    last_name,
    username,
    is_bot,
    language_code,
    telegram_id,
    email,
    profileimage,
  } = await req.json();
  const usersData = {
    first_name,
    last_name,
    username,
    is_bot,
    language_code,
    telegram_id,
    email,
    profileimage,
  };
  console.log("🚀 ~ Deno.serve ~ usersData:", usersData);

  const data = await supabaseClient
    .from("users")
    .insert([{ ...usersData }]);

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders } },
  );
});
