// hooks/useSupabase.ts
import { useEffect, useState } from "react";
import {
  Board,
  BoardData,
  RecordingAsset,
  SupabaseUser,
  TasksArray,
} from "@/types";
import { supabase } from "@/utils/supabase";
import { web3auth } from "@/utils/web3Auth";
import {
  setInviteCode,
  setUserInfo,
  setUserSupabase,
  setVisibleHeader,
} from "@/apollo/reactive-store";
import { useReactiveVar } from "@apollo/client";
import { TUser } from "react-telegram-auth";

export const checkUsernameCodes = async (
  username: string
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
    console.log(userError, "error checkUsername");
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

export function useSupabase() {
  const userSupabase = useReactiveVar(setUserSupabase);
  const inviter = useReactiveVar(setInviteCode);
  const [tasks, setTasks] = useState<TasksArray>([]);
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [assets, setAssets] = useState<RecordingAsset[]>([]);
  const userInfo = useReactiveVar(setUserInfo);

  const getSupabaseUser = async (username: string) => {
    try {
      const response = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();
      console.log(response, "response");
      if (response.error && response.error.code === "PGRST116") {
        console.error("getSupabaseUser: Пользователь не найден");
        return null;
      }

      if (response.error) {
        console.error(
          "Ошибка при получении информации о пользователе:",
          response.error
        );
        return null;
      }

      return response.data;
    } catch (error) {
      // console.error("Ошибка при получении информации о пользователе:", error);
      return null;
    }
  };

  const createSupabaseUser = async (user: TUser): Promise<boolean> => {
    try {
      if (!user.username) {
        console.error("Email пользователя не найден");
        return false;
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

        localStorage.setItem("username", username);

        const { error } = await supabase.from("users").insert([{ ...newUser }]);
        setVisibleHeader(true);
        setTimeout(() => {
          const getUserId = async () => {
            const userData = await getSupabaseUser(username);
            const user_id = userData.user_id;
            localStorage.setItem("user_id", user_id);
            console.log(first_name, "first_name");
            console.log(last_name, "last_name");
            localStorage.setItem("first_name", first_name || "");
            localStorage.setItem("last_name", last_name || "");
          };
          getUserId();
        }, 2000);
        if (error && error.code === "23505") {
          console.log("Значение ключа уже существует в базе данных");
          return true;
        } else {
          return true;
        }
      } else {
        console.log("Доступ запрешен, так как инвайтер не найден");
        return false;
      }
    } catch (error) {
      console.error("Ошибка при получении информации о пользователе:", error);
      return false;
    }
    return false;
  };

  const getAllAssets = async () => {
    try {
      let { data, error } = await supabase.from("room_assets").select("*");
      if (error) console.error("Error fetching assets:", error);

      data && setAssets(data);
    } catch (error) {
      // console.log("error", error);
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
      // console.log("error", error);
    }
  };

  const getTaskById = async (id: string) => {
    try {
      let { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching assets:", error);
      return data;
    } catch (error) {
      // console.log("error", error);
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
    userInfo,
    setUserInfo,
    checkUsernameCodes,
    getTaskById,
  };
}
