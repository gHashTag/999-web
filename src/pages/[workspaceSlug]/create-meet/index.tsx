"use client";
import React, { useEffect, useState } from "react";

import Layout from "@/components/layout";
import { useCopyToClipboard } from "usehooks-ts";
import { ApolloError, gql, useQuery, useReactiveVar } from "@apollo/client";
import { Button } from "@/components/ui/moving-border";
import { useDisclosure } from "@nextui-org/react";
import MeetModal from "@/components/ui/meet-modal";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { createRoom } from "@/utils/edge-functions";

import { SelectBox } from "@/components/ui/select-box";

import { Spinner } from "@/components/ui/spinner";
import { SelectRoom } from "@/components/ui/select-room";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useRouter } from "next/router";
import { setAssetInfo } from "@/apollo/reactive-store";

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteHostCode, setInviteHostCode] = useState("");
  const [inviteMemberCode, setInviteMemberCode] = useState("");
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
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
  // useEffect(() => {
  //   const firstRoom = roomsData?.roomsCollection?.edges[0]?.node;
  //   if (firstRoom) {
  //     setAssetInfo({
  //       value: firstRoom?.room_id,
  //       label: firstRoom?.name,
  //     });
  //   }
  // }, [roomsData]);

  const setOpenModalType = async (type: string) => {
    onOpen();
    setOpenModalId(type);
  };

  const managementToken = process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN;

  if (!managementToken) {
    throw new Error("NEXT_PUBLIC_MANAGEMENT_TOKEN is not set");
  }

  const items = data?.room_assetsCollection?.edges;

  const onCreateMeet = async () => {
    setLoading(true);
    const formData = getValues();
    try {
      const response = await createRoom(
        formData.name,
        openModalId,
        room_id || ""
      );
      console.log("🚀 ~ onCreateMeet ~ response:", response);
      if (response) {
        localStorage.setItem("name", response.name);
        localStorage.setItem("room_id", response.room_id);
        refetch();
        toast({
          title: "Success",
          description: `${response.name} created`,
        });
        setLoading(false);
        setIsRoomCreated(false);
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

  const onCreateRoom = () => {
    setOpenModalId("meets");
    setIsRoomCreated(true);
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
      <Layout>
        {isOpen && (
          <MeetModal
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            onCreate={onCreateMeet}
            control={control}
            handleSubmit={handleSubmit}
            getValues={getValues}
            setValue={setValue}
          />
        )}
        <div style={{ position: "absolute", top: 75, right: 20 }}>
          {!isRoomCreated && (
            <Button onClick={onCreateRoom}>Create room</Button>
          )}
        </div>
        <div className="flex justify-center items-center">
          {roomsData && !isRoomCreated && <SelectBox roomsData={roomsData} />}
        </div>
        {loading || assetsLoading || roomsLoading || roomNameLoading ? (
          <Spinner />
        ) : (
          <>
            {isRoomCreated ? (
              <>
                <SelectRoom setOpenModalType={setOpenModalType} />
              </>
            ) : (
              <>
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
              </>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default CreateMeet;
