// hooks/useSupabase.ts
import { useEffect, useState } from "react";
import {
  Board,
  BoardData,
  RecordingAsset,
  SupabaseUser,
  TasksArray,
  TUser,
} from "@/types";
import { setMyWorkspace, supabase } from "@/utils/supabase";

import {
  setInviteCode,
  setUserInfo,
  setUserSupabase,
  setVisibleHeader,
} from "@/apollo/reactive-store";
import { useReactiveVar } from "@apollo/client";
import { captureExceptionSentry } from "@/utils/sentry";

export const checkUsernameCodes = async (
  username: string,
): Promise<{
  isInviterExist: boolean;
  invitation_codes: string;
  inviter_user_id: string;
  error?: boolean;
}> => {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("*")
    .eq("username", username);

  const invitation_codes = rooms && rooms[0].codes;

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

export function useSupabase() {
  const userSupabase = useReactiveVar(setUserSupabase);
  const inviter = useReactiveVar(setInviteCode);
  const [tasks, setTasks] = useState<TasksArray>([]);
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [assets, setAssets] = useState<RecordingAsset[]>([]);
  const [userId, setUserId] = useState<string>("");

  const getSupabaseUser = async (username: string) => {
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
    const user = await getSupabaseUser(newUser.username || "");
    console.log(user, "user");
    return user;
  };

  const updateUserLocalStorage = (
    user_id: string,
    username: string,
    first_name: string,
    last_name: string,
    photo_url: string,
  ) => {
    setUserId(user_id);
    localStorage.setItem("username", username);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("first_name", first_name || "");
    localStorage.setItem("last_name", last_name || "");
    localStorage.setItem("photo_url", photo_url || "");
  };

  const createSupabaseUser = async (
    user: TUser,
  ): Promise<{ user_id: string; username: string } | undefined> => {
    try {
      if (!user.username) {
        console.error("Username not founded");
        return {
          user_id: "",
          username: "",
        };
      }

      const { username, first_name, last_name, photo_url } = user;
      const userData = await getSupabaseUser(inviter);

      if (userData) {
        const newUser = {
          username,
          first_name,
          last_name,
          inviter: userData.user_id,
          photo_url,
          is_bot: false,
        };

        const user = await createUserInDatabase(newUser);

        await setMyWorkspace(user.user_id);

        const user_id = user.user_id;

        setUserId(user_id);

        updateUserLocalStorage(
          user_id,
          username,
          first_name,
          last_name || "",
          photo_url || "",
        );
        return {
          user_id: userData.user_id,
          username,
        };
      }
    } catch (error) {
      captureExceptionSentry("Error creating user", "useSupabase");
      return {
        user_id: "",
        username: "",
      };
    }
  };

  const getAllAssets = async () => {
    try {
      let { data, error } = await supabase.from("room_assets").select("*");
      if (error) console.error("Error fetching assets:", error);

      data && setAssets(data);
    } catch (error) {
      captureExceptionSentry("Error fetching assets", "useSupabase");
    }
  };

  const getAssetById = async (recording_id: string) => {
    try {
      let { data, error } = await supabase
        .from("room_assets")
        .select("*")
        .eq("recording_id", recording_id);

      if (error) console.error("Error fetching assets:", error);
      return data;
    } catch (error) {
      captureExceptionSentry("Error fetching assets", "useSupabase");
    }
  };

  const getTaskById = async (id: number) => {
    try {
      let { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching assets:", error);
      return data;
    } catch (error) {
      captureExceptionSentry("Error fetching task", "useSupabase");
    }
  };

  // useEffect(() => {
  //   const channels = supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "tasks" },
  //       (payload) => {
  //         fetchBoardData();
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     channels.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    let isMounted = true;
    getAllAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user_id: userId,
    getUser,
    getRooms,
    checkUsername,
    getSupabaseUser,
    getAssetById,
    assets,
    tasks,
    setTasks,
    boardData,
    setBoardData,
    getAllAssets,
    createSupabaseUser,
    userSupabase,
    setUserSupabase,
    setUserInfo,
    checkUsernameCodes,
    getTaskById,
  };
}
