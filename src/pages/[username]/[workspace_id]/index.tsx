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
import { CardRoomT, RoomEdge, RoomNode, RoomsCollection } from "@/types";
import CardRoom from "@/components/ui/card-room";
import { Button } from "@/components/ui/moving-border";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "../../_app";

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
};

const MeetsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loading = useReactiveVar(setLoading);
  const room_id = useReactiveVar(setRoomId);
  const { username, user_id, lang, workspace_id, workspace_name } = useUser();

  const passportObj: PassportType =
    workspace_name === "Вода" || "Water"
      ? {
          user_id,
          is_owner: false,
        }
      : {
          user_id,
          workspace_id,
          room_id,
          is_owner: true,
        };

  const { passportData, createPassport } = usePassport(passportObj);

  const commonRooms =
    passportData &&
    passportData.map((item) =>
      item.node.workspaces.roomsCollection.edges.map((edge) => edge.node)
    )[0];

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

  const { roomsData, roomsLoading, refetchRooms } = useRooms();
  const [isVisibleTask, setIsVisibleTask] = useState(false);
  const [type, setType] = useState("Fire");

  useEffect(() => {
    console.log(type, "type");
    console.log(workspace_id, "workspace_id");
    if (!username) {
      router.push("/");
    } else {
      setLoading(false);

      if (workspace_id === "d696abd8-3b7a-46f2-907f-5342a2b533a0") {
        console.log("Earth");
        // "Earth"
        setType("Earth");
        // setIsVisibleMenu(false);
        setIsVisibleTask(true);
      } else if (workspace_id === "54dc9d0e-dd96-43e7-bf72-02c2807f8977") {
        // "Water",
        console.log("Water");
        setType("Water");
        setIsVisibleTask(true);
      } else {
        // "Fire"
        console.log("Fire");
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
          const room_id = response.rooms.room_id;

          setRoomId(room_id);
          localStorage.setItem("room_id", room_id);

          createPassport(workspace_id, room_id, true);
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

  const goToRoomId = (room: RoomEdge) => {
    router.push(`/${username}/${workspace_id}/${room.node.name}`);
    localStorage.setItem("room_id", room.node.room_id);
    setRoomId(room.node.room_id);
    room.node.name && localStorage.setItem("room_name", room.node.name);
  };

  const goToMeet = (room: RoomNode) => {
    if (room.codes) {
      const codes = JSON.parse(room.codes);
      const memberCode = codes.data[0].code;

      localStorage.setItem("workspace_id", workspace_id);
      router.push(
        `/${room.username}/${room.workspace_id}/${room.room_id}/meet/${memberCode}`
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
      {type === "Fire" && (
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
              />
            ))}
          </div>
        </>
      )}

      {type === "Water" && (
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-1"
          style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
        >
          {commonRooms &&
            commonRooms.map((room, index) => {
              return (
                <CardRoom
                  key={index}
                  room={room}
                  onClick={() => goToMeet(room)}
                />
              );
            })}
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

      <div
        style={{
          paddingBottom: 200,
        }}
      >
        {!isVisibleTask && tasksData && (
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
    </Layout>
  );
};

export default MeetsPage;
