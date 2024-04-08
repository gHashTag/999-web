import { supabase } from "@/utils/supabase";

const getRooms = async (username: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("username", username);

  return data;
};

export { getRooms };
