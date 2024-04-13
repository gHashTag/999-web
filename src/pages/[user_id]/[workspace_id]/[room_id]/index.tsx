"use client";
import React, { useCallback, useEffect, useState } from "react";

import Layout from "@/components/layout";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useRouter } from "next/router";
import { ButtonAnimate } from "@/components/ui/button-animate";

import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/pages/_app";

import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import { useRooms } from "@/hooks/useRooms";
import { setHeaderName } from "@/apollo/reactive-store";

const managementToken = process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN;

if (!managementToken) {
  throw new Error("NEXT_PUBLIC_MANAGEMENT_TOKEN is not set");
}

const RoomPage = () => {
  const router = useRouter();
  const {
    roomsData,
    assetsLoading,
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
  } = useRooms();

  const { username } = useUser();

  useEffect(() => {
    if (!username) {
      router.push("/");
    }
  }, [router]);

  const { tasksData, tasksLoading, columns, tasksError } = useTasks();

  return (
    <>
      <Layout
        loading={
          tasksLoading ||
          roomsLoading ||
          assetsLoading ||
          roomNameLoading ||
          deleteRoomLoading
        }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 40,
            width: "96%",
            alignSelf: "center",
            justifyContent: "center",
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
            width: "92%",
            alignSelf: "center",
          }}
        >
          <HoverEffect items={assetsItems} />
        </div>
        <div>
          {tasksData && <DataTable data={tasksData} columns={columns} />}
        </div>

        <div
          style={{
            justifyContent: "center",
            width: "30%",
            paddingBottom: 100,
            alignSelf: "center",
          }}
        >
          <div style={{ padding: "20px" }} />
          <ButtonAnimate onClick={handlerDeleteRoom}>Delete room</ButtonAnimate>
          <div style={{ padding: "100px" }} />
        </div>
      </Layout>
    </>
  );
};

export default RoomPage;
