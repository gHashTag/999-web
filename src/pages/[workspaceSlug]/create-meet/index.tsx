"use client";
import React, { useEffect, useState } from "react";

import Layout from "@/components/layout";
import { ApolloError, gql, useQuery, useReactiveVar } from "@apollo/client";
import { Button } from "@/components/ui/moving-border";
import { SelectBox } from "@/components/ui/select-box";
import { Spinner } from "@/components/ui/spinner";
import { SelectRoom } from "@/components/ui/select-room";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useRouter } from "next/router";
import { setAssetInfo } from "@/apollo/reactive-store";

const managementToken = process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN;

if (!managementToken) {
  throw new Error("NEXT_PUBLIC_MANAGEMENT_TOKEN is not set");
}

const ROOMS_COLLECTION_QUERY = gql`
  query RoomsCollectionByName($user_id: String!) {
    roomsCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id
          user_id
          name
          description
          updated_at
          created_at
          type
          enabled
          description
          codes
          room_id
        }
      }
    }
  }
`;
const ROOM_NAME_COLLECTION_QUERY = gql`
  query RoomsCollectionByName(
    $room_id: String!
    $name: String!
    $user_id: String!
  ) {
    roomsCollection(
      filter: {
        room_id: { eq: $room_id }
        name: { eq: $name }
        user_id: { eq: $user_id }
      }
    ) {
      edges {
        node {
          id
          user_id
          name
          description
          updated_at
          created_at
          type
          enabled
          description
          codes
          room_id
        }
      }
    }
  }
`;

const ROOMS_ASSETS_COLLECTION_QUERY = gql`
  query RoomAssetsCollection($room_id: String!, $name: String!) {
    room_assetsCollection(
      filter: { room_id: { eq: $room_id }, room_name: { eq: $name } }
    ) {
      edges {
        node {
          id
          title
          summary_short
          recording_id
          transcription
          room_id
        }
      }
    }
  }
`;

const CreateMeet = () => {
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteHostCode, setInviteHostCode] = useState("");
  const [inviteMemberCode, setInviteMemberCode] = useState("");

  const [openModalId, setOpenModalId] = useState<string>("");
  const assetInfo = useReactiveVar(setAssetInfo);

  const router = useRouter();

  const user_id = localStorage.getItem("user_id");
  const room_id = localStorage.getItem("room_id");
  const name = localStorage.getItem("name");

  useEffect(() => {
    if (!user_id) {
      router.push("/");
    }
  }, [router]);

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch,
  } = useQuery(ROOMS_COLLECTION_QUERY, {
    variables: {
      user_id,
    },
  });

  const {
    data,
    loading: assetsLoading,
    error: assetsError,
  } = useQuery(ROOMS_ASSETS_COLLECTION_QUERY, {
    variables: {
      room_id,
      name,
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
      room_id,
      name,
      user_id,
    },
  });

  if (roomNameError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(roomNameError.message);
  }

  useEffect(() => {
    const roomsEdges = roomNameData?.roomsCollection?.edges;
    if (roomsEdges?.length === 0) {
      setIsRoomCreated(true);
    }
  }, [roomNameData]);

  const items = data?.room_assetsCollection?.edges;

  const onCreateRoom = () => {
    setIsRoomCreated(true);
    const workspaceSlug = router.query.workspaceSlug;
    router.push(`/${workspaceSlug}/create-meet/create-room`);
  };

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
        // console.log(codeObj, "codeObj");
        if (codeObj) {
          // console.log("code", codeObj.code);

          if (type === "host") {
            setInviteHostCode(codeObj.code);
          } else if (type === "member") {
            setInviteMemberCode(codeObj.code);
          } else {
            setInviteCode(codeObj.code);
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

  return (
    <>
      <Layout loading={roomsLoading || assetsLoading || roomNameLoading}>
        <div style={{ position: "absolute", top: 75, right: 20 }}>
          <Button onClick={onCreateRoom}>Create room</Button>
        </div>
        <div className="flex justify-center items-center">
          {roomsData && <SelectBox roomsData={roomsData} />}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 60,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {arrayInvite.map((item) => (
            <EvervaultCard
              key={item.type}
              text={item.text}
              type={item.type}
              inviteCode={inviteCode}
              inviteToMeet={inviteToMeet}
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
      </Layout>
    </>
  );
};

export default CreateMeet;
