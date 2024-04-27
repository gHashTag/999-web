import { useCallback, useEffect, useState } from "react";

import { ApolloError, useMutation, useQuery } from "@apollo/client";

import {
  DELETE_ROOM_MUTATION,
  GET_ROOMS_COLLECTIONS_BY_USER_ID_QUERY,
  GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY,
  GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY,
  ROOMS_ASSETS_COLLECTION_QUERY,
  ROOMS_BY_ID_COLLECTION_QUERY,
  ROOM_NAME_COLLECTION_QUERY,
  GET_RECORDING_ID_TASKS_QUERY,
  GET_TASKS_BY_ID_QUERY,
  GET_ALL_TASKS_QUERY,
  GET_RECORDING_TASKS_QUERY,
  GET_ROOM_TASKS_QUERY,
} from "@/graphql/query";

import { useUser } from "./useUser";
import { useToast } from "@/components/ui/use-toast";

import { useRouter } from "next/router";
import { ArrayInviteT, RoomEdge, RoomsCollection, RoomsData } from "@/types";

const useRooms = (): UseRoomsReturn => {
  const [inviteGuestCode, setInviteGuestCode] = useState("");
  const [inviteHostCode, setInviteHostCode] = useState("");
  const [inviteMemberCode, setInviteMemberCode] = useState("");
  const [deleteRoom, { loading: deleteRoomLoading, error: deleteRoomError }] =
    useMutation(DELETE_ROOM_MUTATION);

  if (deleteRoomError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(deleteRoomError, "deleteRoomError");
  }

  const router = useRouter();
  const { toast } = useToast();

  const { username, user_id, workspace_id, room_id, recording_id } = useUser();

  let queryVariables;

  let passportQuery;

  if (!room_id && !recording_id && !workspace_id) {
    console.log("rooms :::1");
    passportQuery = ROOMS_BY_ID_COLLECTION_QUERY;
    queryVariables = {
      user_id,
    };
  }

  if (!room_id && !recording_id && workspace_id) {
    console.log("rooms :::2");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY;
    queryVariables = {
      user_id,
      workspace_id,
    };
  }

  if (recording_id && !room_id && !workspace_id) {
    console.log("rooms :::3");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_USER_ID_QUERY;
    queryVariables = {
      user_id,
    };
  }

  if (!recording_id && room_id && workspace_id) {
    console.log("rooms :::4");
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
    };
  }

  if (recording_id && room_id && workspace_id) {
    console.log("rooms :::5");
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
    //@ts-ignore
  } = useQuery(passportQuery, {
    fetchPolicy: "network-only",
    variables: queryVariables,
  });

  const {
    data: assetsData,
    loading: assetsLoading,
    error: assetsError,
    refetch: assetsRefetch,
  } = useQuery(ROOMS_ASSETS_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      room_id,
    },
  });
  if (assetsError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(assetsError, "assetsError");
  }

  const {
    data: roomNameData,
    loading: roomNameLoading,
    error: roomNameError,
    refetch: roomNameRefetch,
  } = useQuery(ROOM_NAME_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      room_id,
    },
  });

  if (roomNameError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(roomNameError.message);
  }

  const assetsItems = assetsData?.room_assetsCollection?.edges;

  const inviteToMeet = useCallback(
    async (type: string) => {
      // Убедитесь, что codesData действительно указывает на массив
      // console.log(roomNameData, "roomNameData");
      const codesData = await roomNameData?.roomsCollection?.edges[0]?.node
        ?.codes;

      if (typeof codesData === "string") {
        const parsedCodesData = JSON.parse(codesData);
        if (parsedCodesData) {
          // Проверка, что codesData действительно массив
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
      text: "Invite Guest",
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

  const room_name = roomNameData?.roomsCollection?.edges[0]?.node?.name;

  return {
    roomsItem: roomsData?.roomsCollection?.edges[0]?.node,
    roomsData,
    assetsLoading,
    refetchRooms,
    handlerDeleteRoom,
    deleteRoomLoading,
    arrayInvite,
    assetsItems,
    roomsLoading,
    roomNameLoading,
    inviteToMeet,
    inviteGuestCode,
    inviteHostCode,
    inviteMemberCode,
  };
};

type UseRoomsReturn = {
  roomsData: RoomsData;
  roomsItem: RoomEdge[];
  assetsLoading: boolean;
  refetchRooms: () => void;
  handlerDeleteRoom: () => void;
  deleteRoomLoading: boolean;
  arrayInvite: ArrayInviteT[];
  assetsItems: any;
  roomsLoading: boolean;
  roomNameLoading: boolean;
  inviteToMeet: (type: string) => void;
  inviteGuestCode: string;
  inviteHostCode: string;
  inviteMemberCode: string;
};

export { useRooms };
