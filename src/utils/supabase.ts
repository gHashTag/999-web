"use client";
import { createClient } from "@supabase/supabase-js";

interface QuestionContext {
  lesson_number?: number;
  subtopic?: number;
}

interface updateProgressContext {
  user_id: string;
  isTrue: boolean;
  path: string;
}

interface UpdateResultParams {
  user_id: string;
  language: string;
  value: boolean;
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getWorkspaceById(workspace_id: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("workspace_id", workspace_id);
  console.log(error, "error");
  return data;
}

export async function getWorkspaceByName(name: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("name", name);
  console.log(error, "error");
  return data;
}

export async function setMyWorkspace(user_id: string) {
  const { data, error } = await supabase.from("workspaces").insert([
    {
      title: "Fire",
      user_id: user_id,
    },
  ]);
  console.log(error, "setMyWorkspace error:::");
  return data;
}

export async function createUser(ctx: any) {
  const { first_name, last_name, username, is_bot, language_code, id } =
    ctx.update.message.from;

  // Проверяем, существует ли уже пользователь с таким telegram_id
  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", id)
    .maybeSingle();

  if (error && error.message !== "No rows found") {
    console.error("Ошибка при проверке существования пользователя:", error);
    return;
  }

  // Если пользователя нет, создаем нового
  const usersData = {
    first_name,
    last_name,
    username,
    is_bot,
    language_code,
    telegram_id: id,
    email: "",
    photo_url: "",
  };

  const { data, error: insertError } = await supabase
    .from("users")
    .insert([usersData]);

  if (insertError) {
    console.error("Ошибка при создании пользователя:", insertError);
    return;
  }

  return data;
}

export async function createRoom (username: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("username", username);

  return data;
};

export const getSelectIzbushkaId = async (selectIzbushka: string) => {
  const { data: selectIzbushkaData, error: selectIzbushkaError } =
    await supabase.from("rooms").select("*").eq("id", selectIzbushka);
  return { selectIzbushkaData, selectIzbushkaError };
};

export async function getBiggest(lesson_number: number): Promise<number | null> {

  const { data, error } = await supabase
    .from("javascript")
    .select("subtopic")
    .eq("lesson_number", lesson_number)
    .order("subtopic", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const result = data.length > 0 ? data[0].subtopic : null;
  return result;
}

export async function getQuestion(ctx: QuestionContext) {
  console.log(ctx)
  // Проверяем, предоставлены ли lesson_number и subtopic
  if (ctx.lesson_number == null || ctx.subtopic == null) {
    console.error("getQuestion требует lesson_number и subtopic");
    return []; // Возвращаем пустой массив или выбрасываем ошибку
  }

  const { lesson_number, subtopic } = ctx;

  const { data, error } = await supabase
    .from("javascript")
    .select("*")
    .eq("lesson_number", lesson_number)
    .eq("subtopic", subtopic);

  if (error) {
    console.log(error, "error supabase getQuestion")
    throw new Error(error.message);
  }

  return data;
}

export async function resetProgress(
  username: string,
): Promise<void> {
  // Получаем user_id по username из таблицы users
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .single();

  if (userError || !userData) {
    throw new Error(userError?.message || "User not found");
  }

  const userId = userData.user_id;

  // Проверяем, существует ли запись в таблице javascript_progress для данного user_id
  const { data: progressData, error: progressError } = await supabase
    .from("javascript_progress")
    .select("user_id")
    .eq("user_id", userId);

  if (progressError) throw new Error(progressError.message);

  if (progressData && progressData.length === 0) {
    // Если записи нет, создаем новую
    const { error: insertError } = await supabase
      .from("javascript_progress")
      .insert([{ user_id: userId }]);

    if (insertError) throw new Error(insertError.message);
  } else {
    // Если запись существует, очищаем все поля, кроме user_id и created_at
    const { error: updateError } = await supabase
      .from("javascript_progress")
      .update({
        javascript_01_01: null,
        javascript_01_02: null,
        javascript_01_03: null,
        javascript_01_04: null,
        javascript_01_05: null,
        javascript_02_01: null,
        javascript_02_02: null,
        javascript_02_03: null,
        javascript_02_04: null,
        javascript_02_05: null,
        javascript_02_06: null,
        javascript_02_07: null,
        javascript_02_08: null,
        javascript_03_01: null,
        javascript_03_02: null,
        javascript_03_03: null,
        javascript_03_04: null,
        javascript_03_05: null,
        javascript_03_06: null,
        javascript_03_07: null,
        javascript_03_08: null,
        javascript_03_09: null,
        javascript_03_10: null,
        javascript_03_11: null,
        javascript_03_12: null,
        javascript_03_13: null,
        javascript_03_14: null,
        javascript_04_01: null,
        javascript_04_02: null,
        javascript_04_03: null,
        javascript_04_04: null,
        javascript_04_05: null,
        javascript_04_06: null,
        javascript_04_07: null,
        javascript_04_08: null,
        javascript_04_09: null,
        javascript_04_10: null,
        javascript_04_11: null,
        javascript_04_12: null,
        javascript_04_13: null,
        javascript_04_14: null,
        javascript_04_15: null,
        javascript_04_16: null,
        javascript_04_17: null,
        javascript_04_18: null,
        javascript_04_19: null,
        javascript_05_01: null,
        javascript_05_02: null,
        javascript_05_03: null,
        javascript_05_04: null,
        javascript_05_05: null,
        javascript_05_06: null,
        javascript_06_01: null,
        javascript_06_02: null,
        javascript_06_03: null,
        javascript_06_04: null,
        javascript_06_05: null,
        javascript_06_06: null,
        javascript_06_07: null,
        javascript_06_08: null,
        javascript_06_09: null,
        javascript_06_10: null,
        javascript_06_11: null,
        javascript_07_01: null,
        javascript_07_02: null,
        javascript_07_03: null,
        javascript_07_04: null,
        javascript_07_05: null,
        javascript_07_06: null,
        javascript_07_07: null,
        javascript_07_08: null,
        javascript_07_09: null,
        javascript_07_10: null,
        javascript_07_11: null,
        javascript_07_12: null,
        javascript_07_13: null,
        javascript_08_01: null,
        javascript_08_02: null,
        javascript_08_03: null,
        javascript_08_04: null,
        javascript_08_05: null,
        javascript_08_06: null,
        javascript_08_07: null,
        javascript_08_09: null,
        javascript_08_10: null,
        javascript_08_11: null,
        javascript_08_12: null,
        javascript_08_13: null,
        javascript_08_14: null,
        javascript_08_15: null,
        javascript_08_16: null,
        javascript_08_17: null,
        javascript_08_18: null,
        javascript_08_19: null,
        javascript_08_20: null,
        javascript_08_21: null,
        javascript_08_22: null,
        javascript_08_23: null,
        javascript_08_24: null,
        javascript_08_25: null,
        javascript_08_26: null,
        javascript_08_27: null,
        javascript_08_28: null,
        javascript_08_29: null,
        javascript_08_30: null,
        javascript_09_01: null,
        javascript_09_02: null,
        javascript_09_03: null,
        javascript_09_04: null,
        javascript_09_05: null,
        javascript_09_06: null,
        javascript_09_07: null,
        javascript_09_08: null,
        javascript_09_09: null,
        javascript_09_10: null,
        javascript_09_11: null,
        javascript_09_12: null,
        javascript_09_13: null,
        javascript_09_14: null,
        javascript_09_15: null,
        javascript_09_16: null,
        javascript_09_17: null,
        javascript_09_18: null,
        javascript_09_19: null,
        javascript_09_20: null,
        javascript_09_21: null,
        javascript_09_22: null,
        javascript_09_23: null,
        javascript_09_24: null,
        javascript_09_25: null,
        javascript_10_01: null,
        javascript_10_02: null,
        javascript_10_03: null,
        javascript_10_04: null,
        javascript_10_05: null,
        javascript_10_06: null,
        javascript_10_07: null,
        javascript_10_08: null,
        javascript_10_09: null,
        javascript_10_10: null,
        javascript_10_11: null,
        javascript_11_01: null,
        javascript_11_02: null,
        javascript_11_03: null,
        javascript_11_04: null,
        javascript_11_05: null,
        javascript_12_01: null,
        javascript_12_02: null,
        javascript_12_03: null,
        javascript_12_04: null,
        javascript_12_05: null,
        javascript_13_01: null,
        javascript_13_02: null,
        javascript_13_03: null,
        javascript_14_01: null,
        javascript_14_02: null,
        javascript_14_03: null,
        javascript_14_04: null,
        javascript_15_01: null,
        javascript_15_02: null,
        javascript_15_03: null,
        javascript_15_04: null,
        javascript_16_01: null,
        javascript_16_02: null,
        javascript_16_03: null,
        javascript_16_04: null,
        javascript_16_05: null,
        javascript_16_06: null,
        javascript_16_07: null,
        javascript_17_01: null,
        javascript_17_02: null,
        javascript_17_03: null,
        javascript_17_04: null,
        javascript_17_05: null,
        javascript_17_06: null,
        javascript_17_07: null,
        javascript_17_08: null,
        javascript_17_09: null,
        javascript_17_10: null,
        javascript_17_11: null,
        javascript_17_12: null,
        javascript_17_13: null,
        javascript_18_01: null,
        javascript_18_02: null,
        javascript_18_03: null,
        javascript_18_04: null,
        javascript_18_05: null,
        javascript_18_06: null,
        javascript_19_01: null,
        javascript_19_02: null,
        javascript_19_03: null,
        javascript_19_04: null,
        javascript_19_05: null,
        javascript_19_06: null,
        javascript_19_07: null,
        javascript_19_08: null,
        javascript_19_09: null,
        javascript_19_10: null,
        javascript_20_01: null,
        javascript_20_02: null,
        javascript_20_03: null,
        javascript_20_04: null,
        javascript_21_01: null,
        javascript_21_02: null,
        javascript_21_03: null,
        javascript_22_01: null,
        javascript_22_02: null,
        javascript_22_03: null,
        javascript_22_04: null,
        javascript_23_01: null,
        javascript_23_02: null,
        javascript_23_03: null,
        javascript_24_01: null,
        javascript_24_02: null,
        javascript_24_03: null,
        javascript_25_01: null,
        javascript_25_02: null,
        javascript_25_03: null,
        javascript_26_01: null,
        javascript_26_02: null,
        javascript_26_03: null,
        javascript_26_04: null,
        javascript_27_01: null,
        javascript_27_02: null,
        javascript_27_03: null,
        javascript_27_04: null,
        javascript_28_01: null,
        javascript_28_02: null,
        javascript_28_03: null,
        javascript_28_04: null,
        javascript_29_01: null,
        javascript_29_02: null,
        javascript_30_01: null,
      })
      .eq("user_id", userId);

    if (updateError) throw new Error(updateError.message);
  }
}

export async function trueCounter(user_id: string): Promise<number> {

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

export async function updateProgress(
  { user_id, isTrue, path }: updateProgressContext,
): Promise<void> {
  const { data: progressData, error: progressError } = await supabase
    .from("javascript_progress")
    .select("user_id")
    .eq("user_id", user_id);

  if (progressError) throw new Error(progressError.message);

  if (progressData && progressData.length === 0) {
    const { error: insertError } = await supabase
      .from("javascript_progress")
      .insert([{ user_id: user_id }]);

    if (insertError) throw new Error(insertError.message);
  } else {
    const { error: updateError } = await supabase
      .from("javascript_progress")
      .update({ [path]: isTrue })
      .eq("user_id", user_id);

    if (updateError) throw new Error(updateError.message);
  }
}

export async function updateResult(
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


export { supabase };
