import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// @ts-ignore
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import MeetModal from "@/components/modal/meet-modal";
// @ts-ignore
import { useDisclosure } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import { createRoom } from "@/utils/edge-functions";
import { SelectRoom } from "@/components/ui/select-room";

import { useQuery, useReactiveVar } from "@apollo/client";
import { CardRoomT, RoomEdge, RoomT, RoomsCollection } from "@/types";
import CardRoom from "@/components/ui/card-room";
import { Button } from "@/components/ui/moving-border";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "../../_app";

import {
  setHeaderName,
  setLoading,
  setRoomName,
  setWorkspaceId,
} from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import TaskModal from "@/components/modal/TaskModal";
import { useRooms } from "@/hooks/useRooms";

const MeetsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loading = useReactiveVar(setLoading);
  const { username, user_id, lang, workspace_id, workspace_name } = useUser();
  console.log(workspace_id, "workspace_id");
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
  } = useTasks({
    workspace_id,
  });

  const { roomsData, roomsLoading, refetchRooms } = useRooms({ workspace_id });
  const [isVisibleMenu, setIsVisibleMenu] = useState(true);
  const [isVisibleRoom, setIsVisibleRoom] = useState(true);
  const [isVisibleTask, setIsVisibleTask] = useState(false);

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      if (workspace_id === "d696abd8-3b7a-46f2-907f-5342a2b533a0") {
        setIsVisibleMenu(false);
        setIsVisibleTask(true);
      } else {
        setIsVisibleMenu(true);
      }
      if (workspace_id === "54dc9d0e-dd96-43e7-bf72-02c2807f8977") {
        setIsVisibleMenu(false);
        setIsVisibleRoom(true);
        setIsVisibleTask(true);
      } else {
        setIsVisibleRoom(false);
      }
    }

    router.events.on("routeChangeComplete", (url) => {
      refetchRooms();
    });
  }, [workspace_id]);

  const [openModalId, setOpenModalId] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const onCreateMeet = async () => {
    setLoading(true);
    const formData = getValues();

    try {
      if (username && user_id) {
        const response = await createRoom({
          user_id,
          username,
          workspace_id,
          name: formData.name,
          type: openModalId,
          token: formData.token,
          chat_id: formData.chat_id,
          lang,
        });

        if (response) {
          localStorage.setItem("room_name", response.rooms.name);
          setRoomName(response.rooms.name);
          setHeaderName(response.rooms.name);
          router.push(`/${username}/${workspace_id}/${response.rooms.room_id}`);
          setLoading(false);
          toast({
            title: "Success",
            description: `${response.rooms.name} created`,
          });
        }
      } else {
        console.log("Username not a found");
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

  const setOpenModalType = async (type: string) => {
    onOpen();
    setOpenModalId(type);
  };

  return (
    <Layout loading={loading || roomsLoading}>
      <>
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
        {isVisibleMenu && (
          <>
            <SelectRoom setOpenModalType={setOpenModalType} />
          </>
        )}
        {isVisibleRoom && (
          <div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-1"
            style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
          >
            {roomsData?.roomsCollection.edges.map((room: RoomEdge) => (
              <CardRoom
                room={room.node}
                onClick={() => {
                  router.push(
                    `/${username}/${workspace_id}/${room.node.room_id}`
                  );
                  localStorage.setItem("room_id", room.node.room_id);
                  setRoomName(room.node.name);
                  room.node.name && setHeaderName(room.node.name);
                }}
                key={room.node.id}
              />
            ))}
          </div>
        )}

        {!isVisibleTask && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 30,
              paddingRight: "75px",
            }}
          >
            <Button onClick={() => onCreateNewTask(workspace_id)}>
              Create task
            </Button>
          </div>
        )}
      </>
      <div
        style={{
          paddingBottom: 200,
        }}
      >
        {tasksData && <DataTable data={tasksData} columns={columns} />}
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
    </Layout>
  );
};

export default MeetsPage;
