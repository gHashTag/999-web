import { supabase } from "../../../utils/supabase";

async function trueCounter(user_id: string): Promise<number> {

  // Запрос к базе данных для получения данных пользователя
  const { data, error } = await supabase
    .from("javascript_progress")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("User not found");
  }

  // Подсчет количества true значений
  const trueCount =
    Object.values(data).filter((value) => value === true).length;

  return trueCount;
}

export { trueCounter };
