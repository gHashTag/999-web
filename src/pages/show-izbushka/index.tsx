import { useEffect, useState } from "react";

import { retrieveLaunchParams, MiniApp, postEvent } from "@tma.js/sdk";
import dynamic from "next/dynamic";
import {
  HMSRoomProvider,
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";

import {
  getRooms,
  getSelectIzbushkaId,
  getUser,
  setUserPhotoUrl,
} from "@/utils/supabase";
import { captureExceptionSentry } from "@/utils/sentry";
import { Spinner } from "@/components/ui/spinner";

// const miniApp = new MiniApp({
//   headerColor: "#00ae13",
//   backgroundColor: "#00ae13",
//   version: "6.4",
//   botInline: false,
//   createRequestId: () => "1234567890",
// });
// console.log(miniApp, "miniApp");

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
  const { initData, platform } = retrieveLaunchParams();

  const hmsActions = useHMSActions();

  const isConnected = useHMSStore(selectIsConnectedToRoom);
 
  const [fullName, setFullName] = useState<string | undefined>(undefined);

  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  useEffect(() => {
    hmsActions.setLocalAudioEnabled(true);
    hmsActions.setLocalVideoEnabled(false);
    const initRoom = async () => {
      try {
        const username = initData?.user?.username;

        const firstName = initData?.user?.firstName;
        const lastName = initData?.user?.lastName;
        const fullName = `${firstName} ${lastName}`;
        const photo_url = initData?.user?.photoUrl;

        if (username && photo_url) {
          await setUserPhotoUrl({
            username,
            photo_url,
          });
        }

        setFullName(fullName);
        const data = username && (await getUser(username));

        const user = data && data[0];

        let selectIzbushka = user?.select_izbushka;
        if (!selectIzbushka) {
          const firstRoom = username && (await getRooms(username));
          selectIzbushka = firstRoom && firstRoom[0].id;
        }

        const { dataIzbushka, selectIzbushkaError } = await getSelectIzbushkaId(
          selectIzbushka
        );

        if (selectIzbushkaError) {
          console.log(selectIzbushkaError, "selectIzbushkaError");
        }

        let roomId;
        if (dataIzbushka) {
          const selectIzbushka = dataIzbushka[0].id;

          const {
            dataIzbushka: inviterSelectIzbushkaData,
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
            dataIzbushka: inviterSelectIzbushkaData,
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

       
      } catch (error) {
        captureExceptionSentry("Error getting token", "ShowIzbushka");
      }
    };

    initRoom();
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
          captureExceptionSentry("Error leaving the room", "ShowIzbushka");
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [hmsActions, isConnected]);

  return (
    <HMSRoomProvider>
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--main-background)",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: platform === "ios" ? "100vh" : "90vh",
        }}
      >
        {!roomId || !fullName ? (
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
      </div>
      </HMSRoomProvider>
  );
};

export default ShowIzbushka;
