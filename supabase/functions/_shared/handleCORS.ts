import { corsHeaders } from "./cors.ts";

export const handleCORS = (cb: (req: Request) => Promise<Response>) => {
  return async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    const response = await cb(req);
    Object.entries(corsHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });

    return response;
  };
};
