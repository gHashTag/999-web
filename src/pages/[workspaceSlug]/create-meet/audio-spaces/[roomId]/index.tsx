import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useSupabase } from "@/hooks/useSupabase";

const HMSPrebuilt = dynamic(
  () =>
    import("@100mslive/roomkit-react").then((mod) => ({
      default: mod.HMSPrebuilt,
    })),
  {
    ssr: false,
  }
);

const Rooms = () => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };
  const { userSupabase } = useSupabase();
  const [token, setToken] = useState<string | undefined>(undefined);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (typeof roomId === "string") {
          const authToken = await hmsActions.getAuthTokenByRoomCode({
            roomCode: roomId,
          });
          setToken(authToken);
        } else {
          throw new Error("roomCode is not a string");
        }
      } catch (error) {
        // console.error("Ошибка при получении токена: ", error);
      }
    };

    fetchToken();
  }, [hmsActions, roomId]);

  useEffect(() => {
    const handleUnload = async () => {
      if (isConnected) {
        try {
          await hmsActions.leave();
        } catch (error) {
          // console.error("Ошибка при попытке покинуть комнату: ", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [hmsActions, isConnected]);

  return (
    <Layout>
      {token && (
        <HMSPrebuilt
          authToken={token}
          roomCode={roomId}
          options={{
            userName:
              `${userSupabase?.first_name} ${userSupabase?.last_name || ""}` ||
              "",
          }}
        />
      )}
    </Layout>
  );
};

export default Rooms;
