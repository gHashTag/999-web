import { useCallback, useEffect, useState } from "react";

import {
  ApolloError,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { createRoom } from "@/utils/edge-functions";
import {
  DELETE_ROOM_MUTATION,
  GET_ROOMS_COLLECTIONS_BY_USER_ID_QUERY,
  GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY,
  GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY,
  ROOMS_BY_ID_COLLECTION_QUERY,
  ROOM_NAME_COLLECTION_QUERY,
} from "@/graphql/query.rooms";

import { useUser } from "./useUser";
import { useToast } from "@/components/ui/use-toast";
// @ts-ignore
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/router";
import { ArrayInviteT, RoomEdge, RoomsData } from "@/types";
import { setLoading, setRoomId } from "@/apollo/reactive-store";
import { useAssets } from "./useAssets";
import { Control, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { usePassport } from "./usePassport";

const useRooms = (): UseRoomsReturn => {
  const { createPassport } = usePassport({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const [inviteGuestCode, setInviteGuestCode] = useState("");

  const [inviteHostCode, setInviteHostCode] = useState("");
  const [openModalId, setOpenModalId] = useState("");
  const [inviteMemberCode, setInviteMemberCode] = useState("");

  const [deleteRoom, { loading: deleteRoomLoading, error: deleteRoomError }] =
    useMutation(DELETE_ROOM_MUTATION);

  if (deleteRoomError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(deleteRoomError, "deleteRoomError");
  }

  const router = useRouter();
  const { toast } = useToast();

  const { username, user_id, workspace_id, room_id, recording_id, lang } =
    useUser();
  // console.log("username", username);
  // console.log("user_id", user_id);
  // console.log("workspace_id", workspace_id);
  // console.log("room_id", room_id);
  // console.log("recording_id", recording_id);

  let queryVariables;
  // console.log(queryVariables, "queryVariables");
  let passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY;

  if (!room_id && !recording_id && !workspace_id) {
    // console.log("rooms :::1");
    passportQuery = ROOMS_BY_ID_COLLECTION_QUERY;
    queryVariables = {
      user_id,
    };
  }

  if (!room_id && !recording_id && workspace_id) {
    // console.log("rooms :::2");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY;
    queryVariables = {
      user_id,
      workspace_id,
    };
  }

  if (recording_id && !room_id && !workspace_id) {
    // console.log("rooms :::3");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_USER_ID_QUERY;
    queryVariables = {
      user_id,
    };
  }

  if (!recording_id && room_id && workspace_id) {
    // console.log("rooms :::4");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
    };
  }

  if (recording_id && room_id && workspace_id) {
    // console.log("rooms :::5");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
    };
  }

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch: refetchRooms,
    // @ts-ignore
  } = useQuery(passportQuery, {
    fetchPolicy: "network-only",
    variables: queryVariables,
  });

  const roomId = useReactiveVar(setRoomId);

  const {
    data: roomNameData,
    loading: roomNameLoading,
    error: roomNameError,
    refetch: roomNameRefetch,
  } = useQuery(ROOM_NAME_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      room_id: roomId,
    },
  });

  if (roomNameError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(roomNameError.message);
  }

  const { assetsRefetch } = useAssets();

  const inviteToMeet = useCallback(
    async (type: string) => {
      const codesData = await roomNameData?.roomsCollection?.edges[0]?.node
        ?.codes;

      if (typeof codesData === "string") {
        const parsedCodesData = JSON.parse(codesData);
        if (parsedCodesData) {
          const codeObj = parsedCodesData.data.find(
            (codeObj: { role: string; code: string }) => {
              return codeObj.role === type;
            }
          );

          if (codeObj) {
            if (type === "guest") {
              setInviteGuestCode(codeObj.code);
            } else if (type === "member") {
              setInviteMemberCode(codeObj.code);
            } else if (type === "host") {
              setInviteHostCode(codeObj.code);
            }
          } else {
            console.log("No code found for type:", type);
          }
        } else {
          console.error("codesData is not an array");
        }
      }
    },
    [roomNameData]
  );

  useEffect(() => {
    inviteToMeet("host");
    inviteToMeet("member");
    inviteToMeet("guest");
  }, [roomNameData, inviteToMeet]);

  const arrayInvite = [
    {
      text: "Start Meet",
      type: "host",
    },
    {
      text: "Invite Member",
      type: "member",
    },
    {
      text: "Invite Link",
      type: "guest",
    },
  ];

  const handlerDeleteRoom = () => {
    deleteRoom({
      variables: {
        room_id,
      },
      onCompleted: (data) => {
        toast({
          title: "Success! Room deleted",
        });
        refetchRooms();
        assetsRefetch();
        roomNameRefetch();
        router.push(`/${username}`);
      },
    });
  };

  const handlerEditRoom = () => {
    console.log("handlerEditRoom");
  };

  const onCreateMeet = async () => {
    setLoading(true);
    const formData = getValues();

    try {
      if (username && user_id) {
        const response = await createRoom({
          user_id,
          username,
          workspace_id,
          name: formData.name,
          type: openModalId,
          token: formData.token,
          chat_id: formData.chat_id,
          lang,
        });

        if (response) {
          localStorage.setItem("room_name", response.rooms.name);
          const room_id = response.rooms.room_id;

          setRoomId(room_id);
          localStorage.setItem("room_id", room_id);

          createPassport(workspace_id, room_id, true);
          router.push(`/${username}/${workspace_id}/${response.rooms.room_id}`);
          setLoading(false);
          toast({
            title: "Success",
            description: `${response.rooms.name} created`,
          });
        }
      } else {
        console.log("Username not a found");
      }
    } catch (error) {
      if (error) {
        toast({
          title: "Error creating room",
          variant: "destructive",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        reset({
          title: "",
        });
      }
    }
  };

  return {
    roomsItem: roomsData?.roomsCollection?.edges[0]?.node,
    roomsData,
    refetchRooms,
    handlerDeleteRoom,
    handlerEditRoom,
    deleteRoomLoading,
    arrayInvite,
    roomsLoading,
    roomNameLoading,
    inviteToMeet,
    inviteGuestCode,
    inviteHostCode,
    inviteMemberCode,
    isOpenMeet: isOpen,
    onOpenMeet: onOpen,
    onOpenChangeMeet: onOpenChange,

    reset,
    setOpenModalId,
    controlRoom: control,
    handleSubmitRoom: handleSubmit,
    getValuesRoom: getValues,
    setValueRoom: setValue,
    onCreateMeet,
  };
};

type UseRoomsReturn = {
  roomsData: RoomsData;
  roomsItem: RoomEdge[];

  refetchRooms: () => void;
  handlerDeleteRoom: () => void;
  handlerEditRoom: () => void;
  deleteRoomLoading: boolean;
  arrayInvite: ArrayInviteT[];

  roomsLoading: boolean;
  roomNameLoading: boolean;
  inviteToMeet: (type: string) => void;
  inviteGuestCode: string;
  inviteHostCode: string;
  inviteMemberCode: string;
  isOpenMeet: boolean;
  onOpenMeet: () => void;
  onOpenChangeMeet: () => void;
  controlRoom: Control<FieldValues, any>;
  handleSubmitRoom: FieldValues;
  getValuesRoom: () => FieldValues;
  setValueRoom: (name: string, value: any) => void;
  reset: () => void;
  setOpenModalId: (openModalId: string) => void;
  onCreateMeet: () => void;
};

export { useRooms };
