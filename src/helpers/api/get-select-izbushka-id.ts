import { supabase } from "@/utils/supabase";

const getSelectIzbushkaId = async (selectIzbushka: string) => {
  const { data: selectIzbushkaData, error: selectIzbushkaError } =
    await supabase.from("rooms").select("*").eq("id", selectIzbushka);
  return { selectIzbushkaData, selectIzbushkaError };
};

export { getSelectIzbushkaId };
