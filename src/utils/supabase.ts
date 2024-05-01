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
    .from("progress")
    .select("user_id")
    .eq("user_id", userId);

  if (progressError) throw new Error(progressError.message);

  if (progressData && progressData.length === 0) {
    // Если записи нет, создаем новую
    const { error: insertError } = await supabase
      .from("progress")
      .insert([{ user_id: userId }]);

    if (insertError) throw new Error(insertError.message);
  } else {
    // Если запись существует, очищаем все поля, кроме user_id и created_at
    const { error: updateError } = await supabase
      .from("progress")
      .update({
        javascript: 0,
      })
      .eq("user_id", userId);

    if (updateError) throw new Error(updateError.message);
  }
}

export async function getCorrects(user_id: string): Promise<number> {

  // Запрос к базе данных для получения данных пользователя
  const { data, error } = await supabase
    .from("progress")
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
  const correctAnswers = data.javascript

  return correctAnswers;
}

export async function updateProgress(
  { user_id, isTrue }: updateProgressContext,
): Promise<void> {
  const { data: progressData, error: progressError } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user_id);

  if (progressError) throw new Error(progressError.message);

  if (progressData && progressData.length === 0) {
    const { error: insertError } = await supabase
      .from("progress")
      .insert([{ user_id: user_id }]);

    if (insertError) throw new Error(insertError.message);
  } else {
    const { error: updateError } = await supabase
      .from("progress")
      .update({ javascript: isTrue ? progressData[0].javascript++ : progressData[0].javascript})
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

export async function getUid(username: string) {

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

export { supabase };
