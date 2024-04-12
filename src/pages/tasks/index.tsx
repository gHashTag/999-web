"use client";

import Layout from "@/components/layout";
import { Metadata } from "next";
import { DataTable } from "../../components/table/data-table";
// @ts-ignore
import { useForm } from "react-hook-form";

import { TASKS_COLLECTION_QUERY } from "@/graphql/query";

import { Button } from "@/components/ui/moving-border";
import TaskModal from "@/components/modal/TaskModal";

import { useTable } from "@/hooks/useTable";
import { __DEV__ } from "@/pages/_app";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default function Tasks() {
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");

  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const workspace_id = localStorage.getItem("workspace_id");
  const room_id = localStorage.getItem("room_id");
  const recording_id = localStorage.getItem("recording_id");
  const userName = __DEV__ ? "koshey999nft" : username;
  const userId = __DEV__ ? "ec0c948a-2b96-4ccd-942f-0a991d78a94f" : user_id;
  const workspaceId = __DEV__
    ? "54dc9d0e-dd96-43e7-bf72-02c2807f8977"
    : workspace_id;
  const roomId = __DEV__ ? "6601894fe4bed726368e290b" : room_id;
  const recordingId = __DEV__ ? "660d30d5a71969a17ddc027e" : recording_id;

  const {
    loading,
    data,
    openModalId,
    isEditing,
    columns,
    isOpen,
    onOpen,
    onOpenChange,
    onCreateNewTask,
    onCreate,
    onUpdate,
    onDelete,
  } = useTable({
    username: userName || "",
    user_id: userId || "",
    workspace_id: workspaceId || "",
    room_id: roomId || "",
    recording_id: recordingId || "",
  });

  // FIX ME
  // const { data: taskById, error: taskByIdError } = useQuery(TASK_BY_ID_QUERY, {
  //   variables: { id: openModalId },
  //   client: apolloClient,
  // });
  // if (taskByIdError instanceof ApolloError) {
  //   // Обработка ошибки ApolloError
  //   console.log(taskByIdError.message);
  // }

  return (
    <Layout loading={loading}>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div style={{ position: "absolute", top: 60, right: 30 }}>
            <Button onClick={onCreateNewTask}>Create task</Button>
          </div>
          {isOpen && (
            <TaskModal
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
              onCreate={onCreate}
              onDelete={() => openModalId && onDelete(openModalId)}
              onUpdate={onUpdate}
              control={control}
              handleSubmit={handleSubmit}
              getValues={getValues}
              setValue={setValue}
              isEditing={isEditing}
            />
          )}
        </div>
        {data && (
          <DataTable data={data.tasksCollection.edges} columns={columns} />
        )}
      </div>
    </Layout>
  );
}
