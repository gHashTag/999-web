import { useEffect, useState } from "react";
import {
  Board,
  BoardData,
  RecordingAsset,
  SupabaseUser,
  TasksArray,
  TUser,
} from "@/types";
import {
  getSupabaseUserByUsername,
  setMyWorkspace,
  supabase,
} from "@/utils/supabase";

import {
  setInviteCode,
  setUserInfo,
  setUserSupabase,
  setVisibleHeader,
} from "@/apollo/reactive-store";
import { useReactiveVar } from "@apollo/client";
import { captureExceptionSentry } from "@/utils/sentry";

export function useSupabase() {
  const userSupabase = useReactiveVar(setUserSupabase);
  const inviter = useReactiveVar(setInviteCode);
  const [tasks, setTasks] = useState<TasksArray>([]);
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [assets, setAssets] = useState<RecordingAsset[]>([]);
  const [userId, setUserId] = useState<string>("");

  const createUserInDatabase = async (
    newUser: SupabaseUser,
  ): Promise<{ user_id: string }> => {
    await supabase.from("users").insert([newUser]);
    const user = await getSupabaseUserByUsername(newUser.username || "");
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
      const userData = await getSupabaseUserByUsername(inviter);

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
    getTaskById,
  };
}
