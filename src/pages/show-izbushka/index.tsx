import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { retrieveLaunchParams } from "@tma.js/sdk";
import { supabase } from "@/utils/supabase";
import dynamic from "next/dynamic";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Spinner } from "@/components/ui/spinner";

import { getSelectIzbushkaId } from "@/helpers/api/get-select-izbushka-id";

import { useSupabase } from "@/hooks/useSupabase";

const HMSPrebuilt = dynamic(
  () =>
    import("@100mslive/roomkit-react").then((mod) => ({
      //@ts-ignore
      default: mod.HMSPrebuilt,
    })),
  {
    ssr: false,
  }
);

const ShowIzbushka = () => {
  const { initData } = retrieveLaunchParams();
  const { getUser, getRooms } = useSupabase();

  const hmsActions = useHMSActions();
  const [token, setToken] = useState<string | undefined>(undefined);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<string | undefined>(undefined);

  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const username = initData?.user?.username;

        const firstName = initData?.user?.firstName;
        const lastName = initData?.user?.lastName;
        const fullName = `${firstName} ${lastName}`;

        setFullName(fullName);
        const data = username && (await getUser(username));

        const user = data && data[0];

        let selectIzbushka = user?.select_izbushka;
        if (!selectIzbushka) {
          const firstRoom = username && (await getRooms(username));
          selectIzbushka = firstRoom && firstRoom[0].id;
        }

        const { selectIzbushkaData, selectIzbushkaError } =
          await getSelectIzbushkaId(selectIzbushka);

        if (selectIzbushkaError) {
          console.log(selectIzbushkaError, "selectIzbushkaError");
        }

        let roomId;
        if (selectIzbushkaData) {
          const selectIzbushka = selectIzbushkaData[0].id;

          const {
            selectIzbushkaData: inviterSelectIzbushkaData,
            selectIzbushkaError: inviterSelectIzbushkaError,
          } = await getSelectIzbushkaId(selectIzbushka);

          if (inviterSelectIzbushkaError) {
            console.log(inviterSelectIzbushkaData, "inviterSelectIzbushkaData");
          }

          const id =
            inviterSelectIzbushkaData &&
            inviterSelectIzbushkaData[0].codes.data.filter(
              (item: any) => item.role === "host"
            )[0].code;

          roomId = id;
        } else {
          const inviter = user?.inviter;
          const data = await getUser(inviter);

          const inviterSelectIzbushka = data && data[1]?.select_izbushka;
          const {
            selectIzbushkaData: inviterSelectIzbushkaData,
            selectIzbushkaError: inviterSelectIzbushkaError,
          } = await getSelectIzbushkaId(inviterSelectIzbushka);
          roomId =
            inviterSelectIzbushkaData &&
            inviterSelectIzbushkaData[0].codes.data[1].code;
          if (inviterSelectIzbushkaError) {
            console.log(
              inviterSelectIzbushkaError,
              "inviterSelectIzbushkaError"
            );
          }
        }

        setRoomId(roomId);

        if (typeof roomId === "string") {
          const authToken = await hmsActions.getAuthTokenByRoomCode({
            roomCode: roomId,
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
  }, [
    hmsActions,
    fullName,
    roomId,
    getRooms,
    getUser,
    initData?.user?.firstName,
    initData?.user?.lastName,
    initData?.user?.username,
  ]);

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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {loading || !roomId || !fullName ? (
        <Spinner size="lg" />
      ) : (
        <HMSPrebuilt
          //@ts-ignore
          authToken={token}
          roomCode={roomId}
          options={{ userName: fullName }}
        />
      )}
    </div>
  );
};

export default ShowIzbushka;
