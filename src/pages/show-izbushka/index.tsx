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
  const slug = router.query.slug;
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
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username);
        setFullName(fullName);

        const user = data && data[0];
        console.log(user, "user");

        const selectIzbushka = user?.select_izbushka;
        const { data: selectIzbushkaData, error: selectIzbushkaError } =
          await supabase.from("rooms").select("*").eq("id", selectIzbushka);
        console.log(selectIzbushka, "selectIzbushka");
        console.log(selectIzbushkaError, "selectIzbushkaError");

        let roomId;
        if (selectIzbushkaData && selectIzbushkaData[0]) {
          roomId = selectIzbushkaData[0].codes[1].code;
        } else {
          roomId = user?.invitation_codes.data[0].code;
        }

        setRoomId(roomId);

        if (typeof roomId === "string") {
          const authToken = await hmsActions.getAuthTokenByRoomCode({
            roomCode: roomId,
          });
          console.log(authToken, "authToken");
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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {loading ? (
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
