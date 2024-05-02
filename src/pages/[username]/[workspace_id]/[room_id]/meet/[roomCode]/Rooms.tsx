"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { usePassport } from "@/hooks/usePassport";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { QueryType } from ".";

export const Rooms = () => {
  const router = useRouter();
  const { user_id, firstName, lastName } = useUser();
  const { workspace_id, room_id, roomCode } = router.query as QueryType;
  console.log(router.query, "router.query");
  console.log(user_id, "user_id");

  console.log(workspace_id, "workspace_id");
  console.log(room_id, "room_id");

  const [token, setToken] = useState<string | undefined>(undefined);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const [loading, setLoading] = useState(false);
  const [isPassport, setIsPassport] = useState(false);
  const hmsActions = useHMSActions();
  const { passportData, passportLoading } = usePassport({
    user_id,
    room_id,
    workspace_id,
  });

  useEffect(() => {
    if (passportData && passportData.length === 0) {
      router.push("/");
    } else {
      setIsPassport(true);
      const fetchToken = async () => {
        try {
          if (typeof roomCode === "string") {
            const authToken = await hmsActions.getAuthTokenByRoomCode({
              roomCode,
            });
            setToken(authToken);
            setLoading(false);
          } else {
            throw new Error("roomCode is not a string");
          }
        } catch (error) {
          console.error("Ошибка при получении токена: ", error);
        }
      };
      fetchToken();
    }
  }, [hmsActions, roomCode, passportData]);

  useEffect(() => {
    const handleUnload = async () => {
      if (isConnected) {
        try {
          await hmsActions.leave();
        } catch (error) {
          console.error("Ошибка при попытке покинуть комнату: ", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [hmsActions, isConnected]);

  const userName = `${firstName} ${lastName || ""}` || "";

  return (
    <Layout loading={loading || passportLoading}>
      <div>
        {/* <h1>{roomCode}</h1> */}
        <h1>{user_id}</h1>
        <h1>{workspace_id}</h1>
        <h1>{room_id}</h1>
      </div>
      {/* {token && (
              <HMSPrebuilt
                authToken={token}
                roomCode={roomCode}
                options={{
                  userName,
                }}
              />
            )} */}
    </Layout>
  );
};
