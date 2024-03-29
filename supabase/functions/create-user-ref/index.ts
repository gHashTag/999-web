import { client } from "../utils/client.ts";

Deno.serve(async (req) => {
  const supabaseClient = client();
  const {
    username,
  } = await req.json();

  const data = await supabaseClient
    .from("users")
    .insert([{ ...usersData }]);

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  );
});
