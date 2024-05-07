import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// @ts-ignore
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import MeetModal from "@/components/modal/meet-modal";

import { useToast } from "@/components/ui/use-toast";

import { SelectRoom } from "@/components/ui/select-room";

import { useReactiveVar } from "@apollo/client";
import { Passport, RoomEdge } from "@/types";
import CardRoom from "@/components/ui/card-room";
import { Button } from "@/components/ui/moving-border";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "../../../_app";

import { setLoading, setRoomId } from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import TaskModal from "@/components/modal/TaskModal";
import { useRooms } from "@/hooks/useRooms";
import { BreadcrumbWithCustomSeparator } from "@/components/ui/breadcrumb-with-custom-separator";
import { usePassport } from "@/hooks/usePassport";

type PassportType = {
  user_id?: string;
  workspace_id?: string;
  room_id?: string;
  is_owner: boolean;
  type?: string;
};

const MeetsPage = () => {
  const router = useRouter();
  const loading = useReactiveVar(setLoading);
  const room_id = useReactiveVar(setRoomId);
  const { username, user_id, workspace_id, workspace_name, workspace_type } =
    useUser();

  console.log(workspace_type, "workspace_type");
  const passportObj: PassportType =
    workspace_type === "Water"
      ? {
          user_id,
          is_owner: false,
          type: "room",
        }
      : {
          user_id,
          is_owner: true,
          type: "room",
        };
  console.log(passportObj, "passportObj");
  const { passportData } = usePassport(passportObj);

  const {
    tasksData,
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
    columns,
    openModalTaskId,
    isEditingTask,
  } = useTasks();

  const {
    roomsData,
    roomsLoading,
    refetchRooms,
    isOpenMeet,
    onOpenMeet,
    onOpenChangeRoom,
    setOpenModalRoomId,
    controlRoom,
    handleSubmitRoom,
    getValuesRoom,
    setValueRoom,
    onCreateRoom,
    isEditingRoom,
    openModalRoomId,
    onDeleteRoom,
    onUpdateRoom,
    watchRoom,
  } = useRooms();
  const [isVisibleTask, setIsVisibleTask] = useState(false);
  // const [workspaceType, setWorkspaceType] = useState("Fire");

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      setLoading(false);

      if (workspace_id === "d696abd8-3b7a-46f2-907f-5342a2b533a0") {
        console.log("Earth");
        // "Earth"
        localStorage.setItem("workspace_type", "Earth");
        // setIsVisibleMenu(false);
        setIsVisibleTask(true);
        localStorage.setItem("is_owner", "true");
      } else if (workspace_id === "54dc9d0e-dd96-43e7-bf72-02c2807f8977") {
        // "Water",
        localStorage.setItem("is_owner", "false");
        console.log("Water");
        localStorage.setItem("workspace_type", "Water");
        setIsVisibleTask(false);
      } else {
        // "Fire"
        console.log("Fire");
        localStorage.setItem("workspace_type", "Fire");

        localStorage.setItem("is_owner", "true");
        setIsVisibleTask(true);
        localStorage.setItem("room_name", "");
        localStorage.setItem("room_id", "");
        localStorage.setItem("recording_id", "");
        localStorage.setItem("recording_name", "");
      }
    }

    router.events.on("routeChangeComplete", (url) => {
      refetchRooms();
    });
  }, [workspace_id]);

  const setOpenModalType = async (type: string) => {
    onOpenMeet();
    setOpenModalRoomId(type);
  };

  const goToRoomId = (room: RoomEdge) => {
    console.log("goToRoomId");
    // localStorage.setItem("is_owner", "false");
    router.push(`/${username}/${user_id}/${workspace_id}/${room.node.name}`);
    localStorage.setItem("room_id", room.node.room_id);
    setRoomId(room.node.room_id);
    room.node.name && localStorage.setItem("room_name", room.node.name);
  };

  const goToMeet = ({ node }: Passport) => {
    if (node?.rooms?.codes) {
      const codes = JSON.parse(node.rooms.codes);
      const memberCode = codes.data[0].code;
      localStorage.setItem("workspace_id", workspace_id);
      router.push(
        `/${node.username}/${user_id}/${node.workspace_id}/${node.room_id}/meet/${memberCode}`
      );
    } else {
      console.error("No codes available");
    }
  };

  return (
    <Layout loading={loading || roomsLoading}>
      <div className="flex flex-col items-center justify-between">
        <BreadcrumbWithCustomSeparator
          username={username}
          workspace_id={workspace_id}
        />
      </div>

      {workspace_type === "Fire" && (
        <>
          <SelectRoom setOpenModalType={setOpenModalType} />

          <div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-1"
            style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
          >
            {roomsData?.roomsCollection.edges.map((room: RoomEdge) => (
              <CardRoom
                room={room.node}
                onClick={() => goToRoomId(room)}
                key={room.node.id}
                room_id={room.node.room_id}
                username={room.node.username}
              />
            ))}
          </div>
        </>
      )}

      {workspace_type === "Water" && (
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-1"
          style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
        >
          {passportData &&
            passportData.map((item: Passport, index) => {
              return (
                <CardRoom
                  key={index}
                  room={item.node.rooms}
                  room_id={item.node.room_id}
                  username={item.node.username}
                  onClick={() => goToMeet(item)}
                  is_owner={item.node.is_owner}
                />
              );
            })}
        </div>
      )}

      <div
        style={{
          paddingBottom: 200,
        }}
      >
        {isVisibleTask && tasksData && (
          <DataTable data={tasksData} columns={columns} />
        )}
      </div>
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
      {isOpenMeet && (
        <MeetModal
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
          watchRoom={watchRoom}
        />
      )}
    </Layout>
  );
};

export default MeetsPage;
