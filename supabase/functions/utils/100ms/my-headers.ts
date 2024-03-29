if (!Deno.env.get("NEXT_PUBLIC_100MS")) {
  throw new Error("NEXT_PUBLIC_100MS is not set");
}

export const myHeaders = {
  Authorization: `Bearer ${Deno.env.get("NEXT_PUBLIC_100MS")}`,
  "Content-Type": "application/json",
};
