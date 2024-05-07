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
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";

const HMSPrebuilt = dynamic(
  () =>
    import("@100mslive/roomkit-react").then((mod) => ({
      default: mod.HMSPrebuilt,
    })),
  {
    ssr: false,
  }
);

type QueryType = {
  roomCode: string;
  username: string;
  workspace_id: string;
  room_id: string;
};

const Rooms = () => {
  const router = useRouter();
  const { user_id, firstName, lastName } = useUser();
  const { workspace_id, room_id, roomCode } = router.query as QueryType;

  const [token, setToken] = useState<string | undefined>(undefined);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const [loading, setLoading] = useState(false);
  const [isPassport, setIsPassport] = useState(false);
  const hmsActions = useHMSActions();
  const { passportData, passportLoading } = usePassport({
    user_id,
    room_id,
  });

  useEffect(() => {
    if (passportData && passportData.length === 0) {
      router.push("/");
    } else {
      localStorage.setItem("room_id", room_id);
      localStorage.setItem("workspace_id", workspace_id);
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
          console.error("Error receiving token: ", error);
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
          console.error("Error leaving the room: ", error);
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
      {token && isPassport && (
        <HMSPrebuilt
          authToken={token}
          roomCode={roomCode}
          options={{
            userName,
          }}
        />
      )}
    </Layout>
  );
};

export default Rooms;
