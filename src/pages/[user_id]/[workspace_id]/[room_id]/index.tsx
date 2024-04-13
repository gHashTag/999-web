"use client";
import React, { useCallback, useEffect, useState } from "react";

import Layout from "@/components/layout";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useRouter } from "next/router";
import { ButtonAnimate } from "@/components/ui/button-animate";
import { usePassport } from "@/hooks/usePassport";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/pages/_app";

import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import { useRooms } from "@/hooks/useRooms";
import { setHeaderName } from "@/apollo/reactive-store";
import InviteMemberModal from "@/components/modal/InviteMemberModal";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { AnimatedTooltipCommon } from "@/components/ui/animated-tooltip-common";

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
  const { username, workspace_id, room_id } = useUser();
  const {
    passportData,
    passportLoading,
    passportError,
    isOpenModalPassport,
    onOpenModalPassport,
    onOpenChangeModalPassport,
    onCreatePassport,
    onDeletePassport,
    onUpdatePassport,
    setValuePassport,
    controlPassport,
    handleSubmitPassport,
    getValuesPassport,
    openModalPassportId,
    isEditingPassport,
  } = usePassport({
    room_id,
    workspace_id,
  });

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      setHeaderName(roomsData?.name);
    }
  }, [router, roomsData]);

  const { tasksData, tasksLoading, columns, tasksError } = useTasks({
    workspace_id,
    room_id,
  });

  return (
    <>
      <Layout loading={assetsLoading || passportLoading}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginRight: 20,
            paddingTop: 30,
            flexDirection: "column",
          }}
        >
          <AnimatedTooltipCommon items={passportData} />
        </div>
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
              onOpenModalPassport={onOpenModalPassport}
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
          {isOpenModalPassport && (
            <InviteMemberModal
              isOpen={isOpenModalPassport}
              onOpen={onOpenModalPassport}
              onOpenChange={onOpenChangeModalPassport}
              onCreate={onCreatePassport}
              onDelete={() =>
                openModalPassportId && onDeletePassport(openModalPassportId)
              }
              onUpdate={onUpdatePassport}
              control={controlPassport}
              handleSubmit={handleSubmitPassport}
              getValues={getValuesPassport}
              setValue={setValuePassport}
              isEditing={isEditingPassport}
            />
          )}
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
