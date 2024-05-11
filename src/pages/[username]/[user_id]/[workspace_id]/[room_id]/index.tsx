"use client";
import React, { useEffect } from "react";

import Layout from "@/components/layout";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useRouter } from "next/router";
import { ButtonAnimate } from "@/components/ui/button-animate";
import { usePassport } from "@/hooks/usePassport";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/utils/constants";
import { Button } from "@/components/ui/moving-border";
import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import { useRooms } from "@/hooks/useRooms";

import InviteMemberModal from "@/components/modal/InviteMemberModal";

import { AnimatedTooltipRooms } from "@/components/ui/animated-tooltip-rooms";

import TaskModal from "@/components/modal/TaskModal";

import { BreadcrumbWithCustomSeparator } from "@/components/ui/breadcrumb-with-custom-separator";
import { useAssets } from "@/hooks/useAssets";
import MeetModal from "@/components/modal/meet-modal";

const managementToken = process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN;

if (!managementToken) {
  throw new Error("NEXT_PUBLIC_MANAGEMENT_TOKEN is not set");
}

const RoomPage = () => {
  const router = useRouter();
  const { username, workspace_id, workspace_type, room_id, room_name } =
    useUser();

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      localStorage.setItem("is_owner", "false");
      localStorage.setItem("recording_id", "");
      localStorage.setItem("recording_name", "");
    }
  }, [router, workspace_type, workspace_id]);

  const { assetsLoading, assetItems } = useAssets();
  const {
    roomsItem,
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
    isOpenMeet,
    onOpenMeet,
    onOpenChangeRoom,
    controlRoom,
    handleSubmitRoom,
    getValuesRoom,
    setValueRoom,
    isEditingRoom,
    onCreateRoom,
    onUpdateRoom,
    onDeleteRoom,
    openModalRoomId,
    watchRoom,
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
  } = useTasks();

  const {
    passportData,
    passportLoading,
    passportError,
    isOpenModalPassport,
    onOpenModalPassport,
    onOpenChangeModalPassport,
    onCreatePassport,
    onDeletePassportRoom,
    onDeletePassportTask,
    onUpdatePassport,
    setValuePassport,
    controlPassport,
    handleSubmitPassport,
    getValuesPassport,
    openModalPassportId,
    isEditingPassport,
  } = usePassport({
    room_id,
    type: "room",
  });

  const handleClickPlus = async () => {
    onOpenModalPassport();
  };

  return (
    <>
      <Layout loading={false}>
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
          <AnimatedTooltipRooms
            assigneeItems={passportData}
            onClick={onDeletePassportRoom}
            handleClickPlus={handleClickPlus}
          />
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
          <EvervaultCard
            key={arrayInvite[0].type}
            text={arrayInvite[0].text}
            type={arrayInvite[0].type}
            inviteToMeet={inviteToMeet}
            inviteGuestCode={inviteGuestCode}
            inviteHostCode={inviteHostCode}
            inviteMemberCode={inviteMemberCode}
            onOpenModalPassport={onOpenModalPassport}
            passportData={passportData}
          />
          <EvervaultCard
            key={arrayInvite[1].type}
            text={arrayInvite[1].text}
            type={arrayInvite[1].type}
            inviteToMeet={inviteToMeet}
            inviteGuestCode={inviteGuestCode}
            inviteHostCode={inviteHostCode}
            inviteMemberCode={inviteMemberCode}
            onOpenModalPassport={onOpenModalPassport}
            passportData={passportData}
          />
          {passportData && passportData.length > 0 && (
            <EvervaultCard
              key={arrayInvite[2].type}
              text={arrayInvite[2].text}
              type={arrayInvite[2].type}
              inviteToMeet={inviteToMeet}
              inviteGuestCode={inviteGuestCode}
              inviteHostCode={inviteHostCode}
              inviteMemberCode={inviteMemberCode}
              onOpenModalPassport={onOpenModalPassport}
              passportData={passportData}
            />
          )}
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
          <ButtonAnimate onClick={handlerEditRoom}>Edit room</ButtonAnimate>
          <div style={{ padding: "10px" }} />
        </div>
        {isOpenModalPassport && (
          <InviteMemberModal
            isOpen={isOpenModalPassport}
            onOpen={onOpenModalPassport}
            onOpenChange={onOpenChangeModalPassport}
            onCreate={onCreatePassport}
            onDelete={() =>
              openModalPassportId && onDeletePassportRoom(openModalPassportId)
            }
            onUpdate={onUpdatePassport}
            control={controlPassport}
            handleSubmit={handleSubmitPassport}
            getValues={getValuesPassport}
            setValue={setValuePassport}
            isEditing={isEditingPassport}
            type="room"
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
          />
        )}
        {isOpenMeet && (
          <MeetModal
            watchRoom={watchRoom}
            isOpen={isOpenMeet}
            onOpen={onOpenMeet}
            onOpenChange={onOpenChangeRoom}
            control={controlRoom}
            handleSubmit={handleSubmitRoom}
            getValues={getValuesRoom}
            setValue={setValueRoom}
            isEditing={isEditingRoom}
            onCreate={onCreateRoom}
            onDelete={onDeleteRoom}
            onUpdate={onUpdateRoom}
            roomsItem={roomsItem}
          />
        )}
      </Layout>
    </>
  );
};

export default RoomPage;
