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
  UPDATE_ROOM_MUTATION,
} from "@/graphql/query.rooms";

import { useUser } from "./useUser";
import { useToast } from "@/components/ui/use-toast";
// @ts-ignore
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/router";
import { ArrayInviteT, RoomEdge, RoomNode, RoomsData } from "@/types";
import { setLoading, setRoomId } from "@/apollo/reactive-store";
import { useAssets } from "./useAssets";
import {
  Control,
  FieldValues,
  SubmitHandler,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { usePassport } from "./usePassport";

const useRooms = (): UseRoomsReturn => {
  const { createPassport } = usePassport({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset, watch } =
    useForm();
  const [inviteGuestCode, setInviteGuestCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [inviteHostCode, setInviteHostCode] = useState("");
  const [openModalRoomId, setOpenModalRoomId] = useState("");
  const [inviteMemberCode, setInviteMemberCode] = useState("");

  const [deleteRoom, { loading: deleteRoomLoading, error: deleteRoomError }] =
    useMutation(DELETE_ROOM_MUTATION);

  const [updateRoom, { loading: updateRoomLoading, error: updateRoomError }] =
    useMutation(UPDATE_ROOM_MUTATION);

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

  const handlerEditRoom = () => {
    setIsEditing(true);
    onOpen();
  };

  const onCreateRoom = async () => {
    setLoading(true);
    const formData = getValues();

    try {
      if (username && user_id) {
        const response = await createRoom({
          user_id,
          username,
          workspace_id,
          name: formData.name,
          type: openModalRoomId,
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
          router.push(
            `/${username}/${user_id}/${workspace_id}/${response.rooms.room_id}`
          );
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

  const onUpdateRoom = () => {
    const values = getValues();
    updateRoom({
      variables: {
        id: values.id,
        name: values.name,
        chat_id: values.chat_id,
        token: values.token,
      },
      onCompleted: (data) => {
        toast({
          title: "Success! Room updated",
        });

        localStorage.setItem("room_name", values.name);
        refetchRooms();
        assetsRefetch();
        roomNameRefetch();
      },
    });
  };

  const onDeleteRoom = () => {
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
        router.push(`/${username}/${user_id}/${workspace_id}`);
      },
    });
  };

  return {
    roomsItem: roomsData?.roomsCollection?.edges[0]?.node,
    roomsData,
    refetchRooms,
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
    onOpenChangeRoom: onOpenChange,
    openModalRoomId,
    reset,
    setOpenModalRoomId,
    controlRoom: control,
    handleSubmitRoom: handleSubmit,
    getValuesRoom: getValues,
    setValueRoom: setValue,
    onCreateRoom,
    onUpdateRoom,
    onDeleteRoom,
    setIsEditingRoom: setIsEditing,
    isEditingRoom: isEditing,
    watchRoom: watch,
  };
};

type UseRoomsReturn = {
  roomsData: RoomsData;
  roomsItem: RoomNode;
  watchRoom: UseFormWatch<FieldValues>;
  refetchRooms: () => void;

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
  onOpenChangeRoom: () => void;
  controlRoom: Control<FieldValues, any>;
  handleSubmitRoom: FieldValues;
  getValuesRoom: () => FieldValues;
  setValueRoom: (name: string, value: any) => void;
  reset: () => void;
  openModalRoomId: string;
  setOpenModalRoomId: (openModalRoomId: string) => void;
  onCreateRoom: () => void;
  onUpdateRoom: () => void;
  onDeleteRoom: () => void;
  setIsEditingRoom: (isEditing: boolean) => void;
  isEditingRoom: boolean;
};

export { useRooms };
