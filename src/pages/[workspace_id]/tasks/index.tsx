"use client";
import { useEffect, useMemo, useState } from "react";
import { UserNav } from "../../../components/table/user-nav";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { Metadata } from "next";

import { DataTable } from "../../../components/table/data-table";
import { useToast } from "@/components/ui/use-toast";
import {
  gql,
  useQuery,
  useReactiveVar,
  useMutation,
  ApolloError,
} from "@apollo/client";
// @ts-ignore
import { useForm } from "react-hook-form";
// @ts-ignore
import { useDisclosure } from "@nextui-org/react";
import {
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  MUTATION_TASK_UPDATE,
  TASKS_COLLECTION_QUERY,
} from "@/graphql/query";
import { DataTableColumnHeader } from "../../../components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/moving-border";
import TaskModal from "@/components/modal/TaskModal";
import { useSupabase } from "@/hooks/useSupabase";

import { useTable } from "@/hooks/useTable";
import { __DEV__ } from "@/pages/_app";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default function Tasks() {
  const { toast } = useToast();

  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");

  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const { getTaskById, getSupabaseUser } = useSupabase();
  const workspace_id = localStorage.getItem("workspace_id");
  const onDelete = (id: string) => {
    deleteTask({
      variables: {
        filter: {
          id: {
            eq: Number(id),
          },
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
    closeModal();
  };

  const [isEditing, setIsEditing] = useState(false);
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const openModal = async (cardId: string) => {
    setOpenModalId(cardId);
    const card = await getTaskById(cardId);
    setValue("title", card?.title);
    setValue("description", card?.description);
    setValue("label", card?.label);
    onOpen();
    setIsEditing(true);
  };

  const { isOpen, onOpen, columns, onOpenChange, onClose } = useTable({
    openModal,
    onDelete,
    setIsEditing,
    setOpenModalId,
  });

  const userId = __DEV__ ? "ec0c948a-2b96-4ccd-942f-0a991d78a94f" : user_id;
  const workspaceId = __DEV__
    ? "54dc9d0e-dd96-43e7-bf72-02c2807f8977"
    : workspace_id;
  const room_id = "6601894fe4bed726368e290b";
  const recording_id = "660d30d5a71969a17ddc027e";

  const {
    loading,
    error: tasksError,
    data: tasksData,
    refetch,
  } = useQuery(TASKS_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      user_id: userId,
      room_id,
      recording_id,
      workspace_id: workspaceId,
    },
  });
  console.log(tasksError, "tasksError");
  console.log(tasksData, "tasksData");
  // FIX ME
  // const { data: taskById, error: taskByIdError } = useQuery(TASK_BY_ID_QUERY, {
  //   variables: { id: openModalId },
  //   client: apolloClient,
  // });
  // if (taskByIdError instanceof ApolloError) {
  //   // Обработка ошибки ApolloError
  //   console.log(taskByIdError.message);
  // }

  const [mutateUpdateTaskStatus, { error: mutateUpdateTaskStatusError }] =
    useMutation(MUTATION_TASK_UPDATE, {
      variables: {
        username,
      },
    });

  if (mutateUpdateTaskStatusError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateUpdateTaskStatusError.message);
  }

  const [mutateCreateTask, { error: mutateCreateTaskError }] =
    useMutation(CREATE_TASK_MUTATION);
  if (mutateCreateTaskError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log("mutateCreateTaskError", mutateCreateTaskError.message);
  }

  const [deleteTask, { error: deleteTaskError }] =
    useMutation(DELETE_TASK_MUTATION);

  const onCreateNewTask = () => {
    setValue("title", "");
    setValue("description", "");
    setValue("label", "");
    onOpen();
    setIsEditing(false);
  };

  const onCreate = async () => {
    try {
      const formData = getValues();

      if (username) {
        const formDataWithUserId = {
          ...formData,
          user_id,
        };

        const mutateCreateTaskResult = await mutateCreateTask({
          variables: {
            objects: [formDataWithUserId],
          },
          onCompleted: () => {
            toast({
              title: "Task created",
              description: "Task created successfully",
            });
            refetch();

            reset({
              title: "",
              description: "",
              label: "",
            });
          },
        });
      } else {
        console.log("Некорректное значение для username");
      }
    } catch (error) {
      console.log(error, "error");
      toast({
        title: "Error creating task:",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(mutateCreateTaskError, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };

  const closeModal = () => {
    setOpenModalId(null);
    onClose();
  };

  const onUpdate = () => {
    const formData = getValues();

    const variables = {
      id: openModalId,
      title: formData.title,
      description: formData.description,
      updated_at: new Date().toISOString(),
    };

    mutateUpdateTaskStatus({
      variables,
      onCompleted: () => {
        refetch();
      },
    });
  };

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
        {tasksData && (
          <DataTable data={tasksData.tasksCollection.edges} columns={columns} />
        )}
      </div>
    </Layout>
  );
}
