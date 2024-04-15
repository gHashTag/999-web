import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// @ts-ignore
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import MeetModal from "@/components/ui/meet-modal";
// @ts-ignore
import { useDisclosure } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import { createRoom } from "@/utils/edge-functions";
import { SelectRoom } from "@/components/ui/select-room";
import { ROOMS_COLLECTION_QUERY } from "@/graphql/query";
import { useQuery, useReactiveVar } from "@apollo/client";
import { CardRoomT } from "@/types";
import CardRoom from "@/components/ui/card-room";
import { Button } from "@/components/ui/moving-border";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "../../_app";

import {
  setHeaderName,
  setLoading,
  setRoomName,
} from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import TaskModal from "@/components/modal/TaskModal";

const MeetsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loading = useReactiveVar(setLoading);
  const { username, user_id, lang, workspace_name } = useUser();

  const workspace_id = router.query.workspace_id as string;
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

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch,
  } = useQuery(ROOMS_COLLECTION_QUERY, {
    variables: {
      workspace_id,
    },
  });

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      workspace_name && setHeaderName(workspace_name);
    }
  }, [refetch, router, username, workspace_name]);

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
        <SelectRoom setOpenModalType={setOpenModalType} />
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-1"
          style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
        >
          {roomsData?.roomsCollection.edges.map((room: CardRoomT) => (
            <CardRoom
              node={{
                id: room.node.id,
                title: room.node.name,
                description: room.node.type,
              }}
              onClick={() => {
                router.push(
                  `/${username}/${workspace_id}/${room.node.room_id}`
                );
                localStorage.setItem("room_id", room.node.room_id);
              }}
              key={room.node.id}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            top: 20,
            paddingRight: "70px",
          }}
        >
          <Button onClick={() => onCreateNewTask(workspace_id)}>
            Create task
          </Button>
        </div>
      </>
      <div
        style={{
          paddingTop: 50,
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
