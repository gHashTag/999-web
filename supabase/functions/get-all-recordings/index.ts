// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-all-recordings/?secret=secret123sInJlZiI6ImRtcm9vcWJt' \
//     --header 'Content-Type: application/json' \
//     --data '{"user_id": "2293774f-3e08-467e-9252-196150f15f6d", "slug":"999", "email": "info@dao999nft.com"}'

// curl -i --location --request POST 'https://dmrooqbmxdhdyblqzswu.supabase.co/functions/v1/get-all-recordings?secret=secret123sInJlZiI6ImRtcm9vcWJt' \
//     --header 'Content-Type: application/json' \
//--data '{"user_id": "2293774f-3e08-467e-9252-196150f15f6d", "slug":"999", "email": "info@dao999nft.com" }'

import { headers } from "../utils/100ms/headers.ts";
import { myHeaders } from "../utils/100ms/my-headers.ts";
import { client } from "../utils/client.ts";
import { corsHeaders } from "../_shared/cors.ts";
// import { handleCORS } from "../_shared/handleCORS.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const supabaseClient = client();

  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response("Not allowed", {
        status: 405,
        headers: { ...headers },
      });
    }

    const { user_id, slug, email } = await req.json();

    const { data, error: errorUser } = await supabaseClient
      .from("workspaces")
      .select("*")
      .eq("user_id", user_id)
      .eq("name", slug)
      .eq("email", email);

    console.log("errorUser", errorUser);

    if (!data || data.length === 0) {
      throw new Error("No data found for the given user.");
    }

    const room_id = data[0].codes.data[0].room_id;

    const recordingsResponse = await fetch(
      `https://api.100ms.live/v2/recordings?room_id=${room_id}`,
      {
        method: "GET",
        headers: { ...myHeaders },
      },
    );

    if (!recordingsResponse.ok) {
      throw new Error(
        `Failed to get recordings: ${recordingsResponse.statusText}`,
      );
    }
    const recordings = await recordingsResponse.json();

    return new Response(JSON.stringify(recordings), {
      status: 200,
      headers: { ...headers, ...corsHeaders },
    });
  } catch (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...headers, ...corsHeaders },
    });
  }
});
