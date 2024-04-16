import { useCallback, useEffect, useState } from "react";

import { ApolloError, useMutation, useQuery } from "@apollo/client";

import {
  DELETE_ROOM_MUTATION,
  ROOMS_ASSETS_COLLECTION_QUERY,
  ROOMS_BY_ID_COLLECTION_QUERY,
  ROOM_NAME_COLLECTION_QUERY,
} from "@/graphql/query";

import { useUser } from "./useUser";
import { useToast } from "@/components/ui/use-toast";

import { useRouter } from "next/router";
import { ArrayInviteT, RoomEdge, RoomsCollection, RoomsData } from "@/types";

type UseRoomsProps = {
  workspace_id: string;
  room_id?: string;
};

const useRooms = ({ workspace_id, room_id }: UseRoomsProps): UseRoomsReturn => {
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

  const { username } = useUser();

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch: refetchRooms,
  } = useQuery(ROOMS_BY_ID_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      room_id,
    },
  });

  const {
    data: assetsData,
    loading: assetsLoading,
    error: assetsError,
    refetch: assetsRefetch,
  } = useQuery(ROOMS_ASSETS_COLLECTION_QUERY, {
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
      // console.log(codesData, "codesData");
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
      } else {
        console.error("codesData is undefined or not a string");
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
      },
    });

    router.push(`/${username}/${workspace_id}`);
  };

  const room_name = roomNameData?.roomsCollection?.edges[0]?.node?.name;
  localStorage.setItem("room_name", room_name);

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
