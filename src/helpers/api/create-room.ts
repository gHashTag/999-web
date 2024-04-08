import { supabase } from "@/utils/supabase";

const createRoom = async (username: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("username", username);

  return data;
};

export { createRoom };
