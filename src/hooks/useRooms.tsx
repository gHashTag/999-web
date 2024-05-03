import { useCallback, useEffect, useState } from "react";

import {
  ApolloError,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";

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

import { useRouter } from "next/router";
import { ArrayInviteT, RoomEdge, RoomsData } from "@/types";
import { setRoomId } from "@/apollo/reactive-store";
import { useAssets } from "./useAssets";

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

  let passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY;

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
      console.log(codesData, "codesData");
      if (typeof codesData === "string") {
        const parsedCodesData = JSON.parse(codesData);
        if (parsedCodesData) {
          const codeObj = parsedCodesData.data.find(
            (codeObj: { role: string; code: string }) => {
              return codeObj.role === type;
            }
          );
          console.log(codeObj, "codeObj");
          if (codeObj) {
            if (type === "guest") {
              console.log(codeObj.code, "codeObj.code");
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

  return {
    roomsItem: roomsData?.roomsCollection?.edges[0]?.node,
    roomsData,
    refetchRooms,
    handlerDeleteRoom,
    deleteRoomLoading,
    arrayInvite,
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

  refetchRooms: () => void;
  handlerDeleteRoom: () => void;
  deleteRoomLoading: boolean;
  arrayInvite: ArrayInviteT[];

  roomsLoading: boolean;
  roomNameLoading: boolean;
  inviteToMeet: (type: string) => void;
  inviteGuestCode: string;
  inviteHostCode: string;
  inviteMemberCode: string;
};

export { useRooms };
