"use client";
import React, { useEffect, useState } from "react";

import Layout from "@/components/layout";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useRouter } from "next/router";
import { ButtonAnimate } from "@/components/ui/button-animate";
import { useToast } from "@/components/ui/use-toast";
import {
  // CURRENT_USER,
  DELETE_ROOM_MUTATION,
  ROOMS_ASSETS_COLLECTION_QUERY,
  ROOMS_COLLECTION_QUERY,
  ROOM_NAME_COLLECTION_QUERY,
} from "@/graphql/query";

const managementToken = process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN;

if (!managementToken) {
  throw new Error("NEXT_PUBLIC_MANAGEMENT_TOKEN is not set");
}

const RoomPage = () => {
  const [inviteGuestCode, setInviteGuestCode] = useState("");
  const [inviteHostCode, setInviteHostCode] = useState("");
  const [inviteMemberCode, setInviteMemberCode] = useState("");
  const [deleteRoom, { loading: deleteRoomLoading, error: deleteRoomError }] =
    useMutation(DELETE_ROOM_MUTATION);

  const { toast } = useToast();
  const router = useRouter();

  // const { data: userInfo } = useQuery(CURRENT_USER);

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch,
  } = useQuery(ROOMS_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      username: localStorage.getItem("username"),
      room_id: router.query.room_id,
    },
  });

  const {
    data,
    loading: assetsLoading,
    error: assetsError,
  } = useQuery(ROOMS_ASSETS_COLLECTION_QUERY, {
    variables: {
      room_id: router.query.room_id,
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
  } = useQuery(ROOM_NAME_COLLECTION_QUERY, {
    variables: {
      room_id: router.query.room_id,
    },
  });

  if (roomNameError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(roomNameError.message);
  }

  const items = data?.room_assetsCollection?.edges;

  const inviteToMeet = async (type: string) => {
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
          (codeObj: { role: string; code: string }) => codeObj.role === type
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
  };

  useEffect(() => {
    inviteToMeet("host");
    inviteToMeet("member");
    inviteToMeet("guest");
  }, [roomNameData]);

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
        room_id: router.query.room_id,
      },
      onCompleted: (data) => {
        refetch();
        toast({
          title: "Success! Room deleted",
        });
      },
    });
    router.push("/workspaceSlug/create-meet");
  };

  const title = roomsData?.roomsCollection?.edges[0]?.node?.name;
  return (
    <>
      <Layout
        loading={
          roomsLoading || assetsLoading || roomNameLoading || deleteRoomLoading
        }
      >
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-10 w-44  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20 text-center">
              {title}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 20,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {arrayInvite.map((item) => (
            <EvervaultCard
              key={item.type}
              text={item.text}
              type={item.type}
              inviteToMeet={inviteToMeet}
              inviteGuestCode={inviteGuestCode}
              inviteHostCode={inviteHostCode}
              inviteMemberCode={inviteMemberCode}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <HoverEffect items={items} />
        </div>
        <div
          style={{
            justifyContent: "center",
            width: "30%",
            paddingBottom: 100,
            alignSelf: "center",
          }}
        >
          <ButtonAnimate onClick={handlerDeleteRoom}>Delete room</ButtonAnimate>
        </div>
      </Layout>
    </>
  );
};

export default RoomPage;
