import { supabase } from "@/utils/supabase";

const getUser = async (username: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  return data;
};

export { getUser };
