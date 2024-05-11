"use client";
import { SupabaseUser, Task } from "@/types";

import { createClient } from "@supabase/supabase-js";
import { captureExceptionSentry } from "./sentry";

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
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
  ]).select();

  if (error) console.log(error, "setMyWorkspace error:::");
  const workspace_id = data && data[0].workspace_id;
  return workspace_id;
}

export async function setRoom(user_id: string) {
  const { data: dataRooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", user_id)
    .order("id", { ascending: false });

  const lastElement = dataRooms && dataRooms[0];
  if (error) {
    console.error(error, "setRoom error:::");
  }
  return lastElement;
}

export async function setMyPassport(passport: any) {
  const { data, error } = await supabase.from("user_passport").insert([
    passport,
  ]).select();

  if (error) console.log(error, "setMyPassport error:::");
  const passport_id = data && data[0].passport_id;
  return passport_id;
}

type CreateUserReturn = {
  userData: SupabaseUser[];
  user_id: string;
  isUserExist: boolean;
  error: any;
};

type InviteT = {
  username: string;
  first_name: string;
  last_name: string;
  is_bot: boolean;
  language_code: string;
  inviter: string;
  invitation_codes: string;
  telegram_id: number;
  email?: string;
  photo_url?: string;
};

export async function createUser(
  usersData: InviteT,
): Promise<CreateUserReturn> {
  const {
    telegram_id,
  } = usersData;

  // We check whether a user with the same telegram_id already exists
  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegram_id)
    .maybeSingle();

  if (error) {
    console.error("Error checking user existence:", error);
    return {
      userData: [],
      user_id: "",
      isUserExist: false,
      error: error,
    };
  }

  if (existingUser) {
    console.log("User already exists", existingUser);
    return {
      userData: [existingUser],
      user_id: existingUser.user_id,
      isUserExist: true,
      error: null,
    };
  }

  const { data, error: insertError } = await supabase
    .from("users")
    .insert([usersData])
    .select();

  if (insertError) {
    console.error("Error creating user:", insertError);
    return {
      userData: [],
      user_id: "",
      isUserExist: false,
      error: insertError,
    };
  }

  if (!data || data.length === 0) {
    console.error("User data was not returned after insertion");
    return {
      userData: [],
      user_id: "",
      isUserExist: false,
      error: "User data was not returned after insertion",
    };
  }

  return {
    userData: data,
    user_id: data[0].user_id,
    isUserExist: data.length > 0,
    error: insertError,
  };
}

export async function createRoom(username: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("username", username);

  return data;
}

export const getSelectIzbushkaId = async (selectIzbushka: string) => {
  const { data: selectIzbushkaData, error: selectIzbushkaError } =
    await supabase.from("rooms").select("*").eq("id", selectIzbushka);
  return { selectIzbushkaData, selectIzbushkaError };
};

export async function getBiggest(
  lesson_number: number,
): Promise<number | null> {
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
  console.log(ctx);
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
    console.log(error, "error supabase getQuestion");
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
  const correctAnswers = data.javascript;

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
      .update({
        javascript: isTrue
          ? progressData[0].javascript + 1
          : progressData[0].javascript,
      })
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

export async function getAssignedTasks(user_id: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .neq("user_id", user_id)
    .neq("assigned_to", null)
    .contains(
      "assigned_to",
      JSON.stringify([{ user_id }]),
    );

  if (error) {
    console.error("Ошибка при получении getAssignedTasks:", error.message);
    throw new Error(error.message);
  }

  const nodeArray = data.map((value) => {
    return {
      "__typename": "tasks",
      node: {
        ...value,
        assigned_to: JSON.stringify(value.assigned_to),
      },
    };
  });

  return nodeArray;
}

export const checkUsernameCodesByUserId = async (
  user_id: string,
): Promise<{
  isInviterExist: boolean;
  invitation_codes: string;
  inviter_user_id: string;
  error?: boolean;
}> => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id);

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("*")
      .eq("user_id", user_id);

    if (roomsError) {
      console.error(roomsError, "roomsError");
    }
    const invitation_codes = rooms && rooms[0]?.codes;

    if (userError) {
      return {
        isInviterExist: false,
        invitation_codes: "",
        error: true,
        inviter_user_id: "",
      };
    }

    return {
      isInviterExist: userData.length > 0 ? true : false,
      invitation_codes,
      inviter_user_id: userData[0].user_id,
    };
  } catch (error) {
    console.error(error, "error checkUsernameCodes");
    return {
      isInviterExist: false,
      invitation_codes: "",
      error: true,
      inviter_user_id: "",
    };
  }
};

export const checkUsernameCodesByUserName = async (
  username: string,
): Promise<{
  isInviterExist: boolean;
  invitation_codes: string;
  inviter_user_id: string;
  error?: boolean;
}> => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("*")
      .eq("username", username);

    if (roomsError) {
      console.error(roomsError, "roomsError");
    }
    const invitation_codes = rooms && rooms[0]?.codes;

    if (userError) {
      return {
        isInviterExist: false,
        invitation_codes: "",
        error: true,
        inviter_user_id: "",
      };
    }

    return {
      isInviterExist: userData.length > 0 ? true : false,
      invitation_codes,
      inviter_user_id: userData[0].user_id,
    };
  } catch (error) {
    console.error(error, "error checkUsernameCodes");
    return {
      isInviterExist: false,
      invitation_codes: "",
      error: true,
      inviter_user_id: "",
    };
  }
};

export const getRooms = async (username: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("username", username);

  return data;
};

export const getUser = async (username: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  return data;
};

export const checkUsername = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);
  if (error) {
    console.log(error, "error checkUsername");
    return false;
  }
  return data ? data.length > 0 : false;
};

export const checkUsernameAndReturnUser = async (
  username: string,
): Promise<{
  isUserExist: boolean;
  user: SupabaseUser;
}> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (error) {
    console.log(error, "error checkUsername");
    return {
      isUserExist: false,
      user: {} as SupabaseUser,
    };
  }
  return {
    isUserExist: data ? data.length > 0 : false,
    user: data[0],
  };
};

export const checkAndReturnUser = async (
  username: string,
): Promise<{
  isUserExist: boolean;
  user: SupabaseUser;
}> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (error) {
    console.log(error, "error checkUsername");
    return {
      isUserExist: false,
      user: {} as SupabaseUser,
    };
  }
  return {
    isUserExist: data ? data.length > 0 : false,
    user: data[0],
  };
};

export const getSupabaseUserByUsername = async (username: string) => {
  try {
    const response = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (response.error && response.error.code === "PGRST116") {
      console.error("getSupabaseUser: Пользователь не найден");
      return null;
    }

    if (response.error) {
      console.error(
        "Ошибка при получении информации о пользователе:",
        response.error,
      );
      return null;
    }

    return response.data;
  } catch (error) {
    // console.error("Ошибка при получении информации о пользователе:", error);
    captureExceptionSentry("Error getting user info", "useSupabase");
    return null;
  }
};

const createUserInDatabase = async (
  newUser: SupabaseUser,
): Promise<{ user_id: string }> => {
  await supabase.from("users").insert([newUser]);
  const user = await getSupabaseUserByUsername(newUser.username || "");

  return user;
};

export const updateUserInfoByUsername = async (user: {
  username: string;
  email?: string;
  photo_url?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(user)
      .eq("username", user.username)
      .select();

    return data && data[0];
  } catch (error) {
    captureExceptionSentry(
      "Error getting updateUserInfoByUsername",
      "useSupabase",
    );
    return null;
  }
};

export { supabase };
