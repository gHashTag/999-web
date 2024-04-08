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
  setInviterUserId,
  setUserInfo,
  setUserSupabase,
} from "@/apollo/reactive-store";
import { useReactiveVar } from "@apollo/client";

export const checkUsername = async (
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

export function useSupabase() {
  const inviter = useReactiveVar(setInviterUserId);
  const userSupabase = useReactiveVar(setUserSupabase);
  const [tasks, setTasks] = useState<TasksArray>([]);
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [assets, setAssets] = useState<RecordingAsset[]>([]);
  const userInfo = useReactiveVar(setUserInfo);

  const getSupabaseUser = async (email: string) => {
    try {
      const response = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (response.error && response.error.code === "PGRST116") {
        console.error("Пользователь не найден");
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

  const createSupabaseUser = async () => {
    try {
      const user = await web3auth.getUserInfo();
      if (!user.email) {
        // console.error("Email пользователя не найден");
        return { workspaceSlug: "" };
      }
      const userData = await getSupabaseUser(user.email);
      if (!userData) {
        // console.log("Создание нового пользователя, так как текущий не найден");
        // Логика создания пользователя
        // Пользователя с таким email нет в базе, создаем нового
        //@ts-ignore
        const parts = user.name.split(" ");
        const newUser = {
          // user_id: "5619bcb3-0b78-4270-bd56-0f1069d9e8a1",
          email: user.email,
          first_name: parts[0],
          last_name: parts.slice(1).join(" "),
          aggregateverifier: user.aggregateVerifier,
          verifier: user.verifier,
          avatar: user.profileImage,
          typeoflogin: user.typeOfLogin,
          inviter,
        };

        const { error } = await supabase.from("users").insert([{ ...newUser }]);

        if (!error) {
          setUserInfo({ ...userData } as SupabaseUser);
          return {
            workspaceSlug: userData.user_id,
          };
        } else {
          // console.log(error, "Ошибка создания пользователя");
          return { workspaceSlug: "" };
        }
      } else {
        // console.log(userData, "userData");
        setUserInfo(userData as SupabaseUser);
      }
    } catch (error) {
      // console.error("Ошибка при получении информации о пользователе:", error);
    }
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
    checkUsername,
    getTaskById,
  };
}
