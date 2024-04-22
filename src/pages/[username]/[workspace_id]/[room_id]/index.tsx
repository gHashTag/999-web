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
import { Button } from "@/components/ui/moving-border";
import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import { useRooms } from "@/hooks/useRooms";
import { setHeaderName, setRoomId } from "@/apollo/reactive-store";
import InviteMemberModal from "@/components/modal/InviteMemberModal";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { AnimatedTooltipCommon } from "@/components/ui/animated-tooltip-common";
import { useReactiveVar } from "@apollo/client";
import TaskModal from "@/components/modal/TaskModal";
import { ArrayInviteT } from "@/types";
import { BreadcrumbWithCustomSeparator } from "@/components/ui/breadcrumb-with-custom-separator";
import { useAssets } from "@/hooks/useAssets";

const managementToken = process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN;

if (!managementToken) {
  throw new Error("NEXT_PUBLIC_MANAGEMENT_TOKEN is not set");
}

const RoomPage = () => {
  const router = useRouter();
  const { username, workspace_id, room_id, room_name } = useUser();
  const { assetsLoading, assetItems } = useAssets();
  const {
    roomsData,
    handlerDeleteRoom,
    deleteRoomLoading,
    arrayInvite,
    roomsLoading,
    roomNameLoading,
    inviteToMeet,
    inviteGuestCode,
    inviteHostCode,
    inviteMemberCode,
  } = useRooms();

  const {
    tasksData,
    tasksLoading,
    tasksError,
    refetchTasks,
    isOpenModalTask,
    onOpenModalTask,
    onOpenChangeModalTask,
    onCreateTask,
    onDeleteTask,
    onUpdateTask,
    setValueTask,
    controlTask,
    handleSubmitTask,
    getValuesTask,
    onCreateNewTask,
    columns,
    openModalTaskId,
    setOpenModalTaskId,
    isEditingTask,
  } = useTasks();

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
    localStorage.setItem("room_id_crutch", room_id);
  }, []);

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      localStorage.setItem("room_id", "");
      localStorage.setItem("recording_id", "");
    }
  }, [router, roomsData, tasksData, passportData]);

  return (
    <>
      <Layout
        loading={
          assetsLoading ||
          passportLoading ||
          deleteRoomLoading ||
          roomNameLoading ||
          tasksLoading ||
          roomsLoading
        }
      >
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
          <BreadcrumbWithCustomSeparator
            username={username}
            workspace_id={workspace_id}
            room_id={room_id}
            room_name={room_name}
          />
          <div style={{ padding: 15 }} />
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
          {arrayInvite.map((item: ArrayInviteT) => (
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
          <HoverEffect items={assetItems} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "70px",
          }}
        >
          <Button onClick={() => onCreateNewTask(workspace_id, room_id)}>
            Create task
          </Button>
        </div>

        {tasksData && <DataTable data={tasksData} columns={columns} />}

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
        {isOpenModalTask && (
          <TaskModal
            isOpen={isOpenModalTask}
            onOpen={onOpenModalTask}
            onOpenChange={onOpenChangeModalTask}
            onCreate={onCreateTask}
            onDelete={() => openModalTaskId && onDeleteTask(openModalTaskId)}
            onUpdate={() => openModalTaskId && onUpdateTask(openModalTaskId)}
            control={controlTask}
            handleSubmit={handleSubmitTask}
            getValues={getValuesTask}
            setValue={setValueTask}
            isEditing={isEditingTask}
          />
        )}
      </Layout>
    </>
  );
};

export default RoomPage;
