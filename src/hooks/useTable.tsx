import { useCallback, useMemo, useState } from "react";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { useDisclosure } from "@nextui-org/react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { priorities, statuses } from "@/helpers/data/data";
import { useSupabase } from "./useSupabase";

import { Badge } from "@/components/ui/badge";

import {
  gql,
  useQuery,
  useReactiveVar,
  useMutation,
  ApolloError,
} from "@apollo/client";
// @ts-ignore
import { useForm } from "react-hook-form";
import {
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  GET_ALL_TASKS_QUERY,
  GET_RECORDING_TASKS_QUERY,
  GET_ROOM_TASKS_QUERY,
  GET_USER_TASKS_QUERY,
  MUTATION_TASK_UPDATE,
  TASKS_COLLECTION_QUERY,
} from "@/graphql/query";
import { useToast } from "@/components/ui/use-toast";
import { setIsEditing, setOpenModalId } from "@/apollo/reactive-store";

type UseTableProps = {
  username: string;
  user_id?: string | string[] | undefined;
  workspace_id?: string | string[] | undefined;
  room_id?: string | string[] | undefined;
  recording_id?: string | string[] | undefined;
};

const useTable = ({
  username,
  user_id,
  workspace_id,
  room_id,
  recording_id,
}: UseTableProps) => {
  const { toast } = useToast();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { getTaskById } = useSupabase();
  const openModalId = useReactiveVar(setOpenModalId);
  const isEditing = useReactiveVar(setIsEditing);

  let tasksQuery = TASKS_COLLECTION_QUERY;

  let queryVariables = {
    user_id,
    room_id,
    recording_id,
    workspace_id,
  };

  if (!recording_id) {
    tasksQuery = GET_RECORDING_TASKS_QUERY;
    delete queryVariables?.recording_id;
  }

  if (!room_id && !recording_id) {
    tasksQuery = GET_ROOM_TASKS_QUERY;
    delete queryVariables?.recording_id;
    delete queryVariables?.room_id;
  }

  if (!recording_id && !room_id && !workspace_id) {
    tasksQuery = GET_USER_TASKS_QUERY;
    delete queryVariables?.workspace_id;
    delete queryVariables?.recording_id;
    delete queryVariables?.room_id;
  }

  if (!recording_id && !room_id && !workspace_id && !user_id) {
    tasksQuery = GET_ALL_TASKS_QUERY;
    delete queryVariables?.workspace_id;
    delete queryVariables?.recording_id;
    delete queryVariables?.room_id;
    delete queryVariables?.user_id;
  }

  const {
    loading,
    error: tasksError,
    data,
    refetch,
  } = useQuery(tasksQuery, {
    fetchPolicy: "network-only",
    variables: {
      user_id,
      room_id,
      recording_id,
      workspace_id,
    },
  });
  if (tasksError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(tasksError.message);
  }

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

  const openModal = useCallback(
    async (cardId: string) => {
      setOpenModalId(cardId);
      const card = await getTaskById(cardId);
      setValue("title", card?.title);
      setValue("description", card?.description);
      setValue("label", card?.label);
      onOpen();
      setIsEditing(true);
    },
    [getTaskById, onOpen, setOpenModalId, setValue]
  );

  const onCreate = useCallback(async () => {
    try {
      const formData = getValues();

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
  }, [
    getValues,
    mutateCreateTask,
    mutateCreateTaskError,
    refetch,
    reset,
    toast,
    user_id,
  ]);

  const onUpdate = useCallback(() => {
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
  }, [mutateUpdateTaskStatus, openModalId, refetch, getValues]);

  const closeModal = useCallback(() => {
    setOpenModalId(null);
    onClose();
  }, [onClose]);

  const onDelete = useCallback(
    (id: string) => {
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
    },
    [deleteTask, refetch, closeModal]
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: any) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: any) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: any) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorFn: (row: any) => {
          return row.node.id;
        },
        id: "id",
        header: "id",
        cell: (info: any) => info.getValue(),
      },

      {
        accessorFn: (row: any) => {
          return row.node.title;
        },
        id: "title",
        header: "Title",
        cell: ({ row }: any) => {
          return (
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue("title")}
              </span>
              {row.original.node.label && (
                // @ts-ignore
                <Badge variant="outline">{row.original.node.label}</Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorFn: (row: any) => {
          return row.node.description;
        },
        id: "description",
        header: "Description",
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: "priority",
        header: ({ column }: any) => {
          return <DataTableColumnHeader column={column} title="Priority" />;
        },
        accessorFn: (row: any) => {
          return row.node.priority;
        },
        cell: ({ row }: any) => {
          const priority = priorities.find(
            (priority) => priority.value === row.original.node.priority
          );
          if (!priority) {
            return null;
          }

          return (
            <div className="flex items-center">
              {priority.icon && (
                <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{priority.label}</span>
            </div>
          );
        },
        filterFn: (row: any, id: any, value: any) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "status",
        header: ({ column }: any) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        accessorFn: (row: any) => {
          return row.node.status;
        },
        filterFn: (row: any, id: any, value: any) => {
          return value.includes(row.getValue(id));
        },
        cell: ({ row }: any) => {
          const status = statuses.find(
            (status: any) =>
              status.value.toLowerCase() ===
              row.original.node.status.toLowerCase()
          );

          if (!status) {
            return null;
          }

          return (
            <div className="flex w-[100px] items-center">
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{status.label}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }: any) => (
          <DataTableRowActions
            row={row}
            onDelete={onDelete}
            onClickEdit={() => {
              setIsEditing(true);
              setOpenModalId(row.original.node.id);
              openModal(row.original.node.id);
            }}
          />
        ),
      },
    ],
    [onDelete, openModal]
  );

  return {
    data,
    loading,
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
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    setIsEditing,
  };
};

export { useTable };
