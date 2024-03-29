import { createCodes } from "../utils/100ms/create-codes.ts";
import { headers } from "../utils/100ms/headers.ts";
import { client } from "../utils/client.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { myHeaders } from "../utils/100ms/my-headers.ts";
// import { handleCORS } from "../_shared/handleCORS.ts";
// import {
//   create,
//   getNumericDate,
//   Header,
//   Payload,
// } from "https://deno.land/x/djwt/mod.ts";

// const access_key = Deno.env.get("APP_ACCESS_KEY");
// const app_secret = Deno.env.get("APP_SECRET");

// const payload: Payload = {
//   access_key: access_key,
//   type: "management",
//   version: 2,
//   iat: getNumericDate(Math.floor(Date.now() / 1000)),
//   nbf: getNumericDate(Math.floor(Date.now() / 1000)),
//   exp: getNumericDate(60 * 60 * 24), // 24 hours from now
// };

// const header: Header = {
//   alg: "HS256",
//   typ: "JWT",
// };

// // Преобразование app_secret в CryptoKey
// const cryptoKey = await crypto.subtle.importKey(
//   "raw",
//   new TextEncoder().encode(app_secret),
//   { name: "HMAC", hash: { name: "SHA-256" } },
//   false,
//   ["sign"],
// );

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  // let token;
  // try {
  //   if (!app_secret) {
  //     throw new Error("Secret not found");
  //   }
  //   token = await create(header, payload, cryptoKey);
  // } catch (err) {
  //   console.error("Токен недействителен:", err);
  // }

  const supabaseClient = client();

  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response("Not allowed", {
        status: 405,
        headers: { ...headers },
      });
    }

    const { name, type, email } = await req.json();

    const { data } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email);

    if (!data) {
      throw new Error(`User not found: ${email}`);
    }

    const user_id = data[0].user_id;

    const createOrFetchRoom = async () => {
      const roomData = {
        name,
        description: user_id,
        template_id: "65efdfab48b3dd31b94ff0dc",
        enabled: true,
      };

      const roomResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "POST",
        body: JSON.stringify({ ...roomData }),
        headers: { ...myHeaders },
      });
      if (!roomResponse.ok) {
        throw new Error(`Failed to create room: ${roomResponse.statusText}`);
      }
      const newRoom = await roomResponse.json();
      const id = newRoom.id;
      const codesResponse = await createCodes(id);

      if (!codesResponse?.ok) {
        throw new Error(`Failed to create codes: ${codesResponse.statusText}`);
      }
      const codes = await codesResponse.json();

      const rooms = {
        codes,
        type,
        name,
        updated_at: new Date(),
        user_id,
        room_id: id,
      };

      return rooms;
    };

    const rooms = await createOrFetchRoom();
    const { error } = await supabaseClient.from("rooms").insert({
      ...rooms,
      id: undefined,
    });
    if (error) {
      throw new Error(`Error saving to Supabase: ${error.message}`);
    }

    return new Response(JSON.stringify(rooms), {
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
