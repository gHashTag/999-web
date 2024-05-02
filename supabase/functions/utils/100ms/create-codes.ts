import { myHeaders } from "./my-headers.ts";

export async function createCodes(room_id: string) {
  try {
    const response = await fetch(
      `https://api.100ms.live/v2/room-codes/room/${room_id}`,
      {
        headers: myHeaders,
        method: "POST",
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error creating codes:", error);
    throw error;
  }
}
