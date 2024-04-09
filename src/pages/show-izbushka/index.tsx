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
import { getUser } from "@/helpers/api/get-user";
import { getSelectIzbushkaId } from "@/helpers/api/get-select-izbushka-id";
// import { useWeb3Auth } from "@/hooks/useWeb3Auth";

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
  const router = useRouter();

  const { initData } = retrieveLaunchParams();
  console.log(initData, "initData");
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
        console.log(fullName, "fullName");

        setFullName(fullName);
        const data = username && (await getUser(username));
        const user = data && data[0];

        const selectIzbushka = user?.select_izbushka;
        const { selectIzbushkaData, selectIzbushkaError } =
          await getSelectIzbushkaId(selectIzbushka);

        console.log(selectIzbushkaError, "selectIzbushkaError");
        console.log(selectIzbushkaData, "selectIzbushkaData");

        let roomId;
        if (selectIzbushkaData) {
          const selectIzbushka = selectIzbushkaData[0].id;
          console.log(selectIzbushka, "selectIzbushka");
          const {
            selectIzbushkaData: inviterSelectIzbushkaData,
            selectIzbushkaError: inviterSelectIzbushkaError,
          } = await getSelectIzbushkaId(selectIzbushka);
          console.log(inviterSelectIzbushkaData, "inviterSelectIzbushkaData");
          const id =
            inviterSelectIzbushkaData &&
            inviterSelectIzbushkaData[0].codes.data.filter(
              (item: any) => item.role === "host"
            )[0].code;

          console.log(id, "id");
          roomId = id;
        } else {
          const inviter = user?.inviter;
          const data = await getUser(inviter);
          console.log(inviter, "inviter");
          const inviterSelectIzbushka = data && data[1]?.select_izbushka;
          const {
            selectIzbushkaData: inviterSelectIzbushkaData,
            selectIzbushkaError: inviterSelectIzbushkaError,
          } = await getSelectIzbushkaId(inviterSelectIzbushka);
          roomId =
            inviterSelectIzbushkaData &&
            inviterSelectIzbushkaData[0].codes.data[1].code;
          console.log(inviterSelectIzbushkaError, "inviterSelectIzbushkaError");
        }
        console.log(roomId, "roomId");

        setRoomId(roomId);

        // if (typeof roomId === "string") {
        //   const authToken = await hmsActions.getAuthTokenByRoomCode({
        //     roomCode: roomId,
        //   });
        //   console.log(authToken, "authToken");
        //   setToken(authToken);
        //   setLoading(false);
        // } else {
        //   throw new Error("roomCode is not a string");
        // }
      } catch (error) {
        console.error("Ошибка при получении токена: ", error);
      }
    };

    fetchToken();
  }, [hmsActions, fullName, roomId]);

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
  console.log(roomId, "roomId");
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {loading || !roomId || !fullName ? (
        <Spinner size="lg" />
      ) : (
        <HMSPrebuilt
          //@ts-ignore
          // authToken={token}
          roomCode={roomId}
          options={{ userName: fullName }}
        />
      )}
    </div>
  );
};

export default ShowIzbushka;
