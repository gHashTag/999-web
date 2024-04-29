import { supabase } from "../../../utils/supabase";

interface UpdateResultParams {
  user_id: string;
  language: string;
  value: boolean;
}

async function updateResult(
  { user_id, language, value }: UpdateResultParams,
): Promise<void> {
  const { data, error } = await supabase
    .from("result")
    .upsert({ user_id, [language]: value }, { onConflict: "user_id" });

  if (error) {
    console.error("Ошибка при обновлении результата:", error);
    throw error;
  }

  console.log("Результат успешно обновлен или вставлен:", data);
}

export { updateResult };
