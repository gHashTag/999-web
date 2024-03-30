export const headers = {
  "Content-Type": "application/json",
};

// export const corsHeaders = {
//   "Access-Control-Allow-Origin": "https://dao999nft.com",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
// };

if (!process.env.NEXT_PUBLIC_100MS) {
  throw new Error("NEXT_PUBLIC_100MS is not set");
}
