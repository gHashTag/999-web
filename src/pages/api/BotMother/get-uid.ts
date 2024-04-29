import { supabase } from "../../../utils/supabase";

async function getUid(username: string) {

  // Запрос к таблице users для получения user_id по username
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Ошибка при получении user_id:", error.message);
    throw new Error(error.message);
  }

  if (!data) {
    console.error("Пользователь не найден");
    return null; // или выбросить ошибку, если пользователь должен существовать
  }

  // Возвращаем user_id
  return data.user_id;
}

export { getUid };
