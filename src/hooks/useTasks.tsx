import { useToast } from "@/components/ui/use-toast";
import {
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  MUTATION_TASK_UPDATE,
} from "@/graphql/query";
import {
  ApolloError,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { useDisclosure } from "@nextui-org/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSupabase } from "./useSupabase";
import { setIsEditing, setOpenModalId } from "@/apollo/reactive-store";
import { useUser } from "./useUser";
import { TasksArray } from "@/types";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Checkbox } from "@radix-ui/react-checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { priorities, statuses } from "@/helpers/data/data";

import { Badge } from "@/components/ui/badge";

import {
  GET_ALL_TASKS_QUERY,
  GET_RECORDING_TASKS_QUERY,
  GET_ROOM_TASKS_QUERY,
  GET_USER_TASKS_QUERY,
  TASKS_COLLECTION_QUERY,
} from "@/graphql/query";

type UseTasksReturn = {
  tasksData: TasksArray;
  tasksLoading: boolean;
  tasksError: any;
  refetchTasks: () => void;
  onCreate: () => void;
  onUpdate: () => void;
  onCreateNewTask: () => void;
  deleteTask: any;
  onClickEdit: (isEditing: boolean, id: string) => void;
  isEditing: boolean;
  columns: any;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};
const useTasks = (): UseTasksReturn => {
  const { toast } = useToast();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { getTaskById } = useSupabase();
  const openModalId = useReactiveVar(setOpenModalId);
  const { username, user_id, workspace_id, room_id, recording_id } = useUser();
  console.log(user_id, "user_id");
  const isEditing = useReactiveVar(setIsEditing);

  const { getValues, setValue, reset } = useForm();

  let tasksQuery = GET_USER_TASKS_QUERY;

  let queryVariables;

  if (recording_id && room_id && workspace_id && user_id) {
    tasksQuery = GET_ALL_TASKS_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
      recording_id,
    };
  }

  if (!recording_id) {
    tasksQuery = GET_RECORDING_TASKS_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
    };
  }

  if (!room_id && !recording_id) {
    tasksQuery = GET_ROOM_TASKS_QUERY;
    queryVariables = {
      user_id,
      workspace_id,
    };
  }

  if (!recording_id && !room_id && !workspace_id) {
    tasksQuery = GET_USER_TASKS_QUERY;
    queryVariables = {
      user_id,
    };
  }

  if (!recording_id && !room_id && !workspace_id && !user_id) {
    tasksQuery = GET_ALL_TASKS_QUERY;
  }

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery(tasksQuery, {
    fetchPolicy: "network-only",
    variables: queryVariables,
    skip: !queryVariables,
  });

  const onClickEdit = (isEditing: boolean, id: string) => {
    console.log(isEditing, "isEditing");
    setIsEditing(true);
    setOpenModalId(id);
    openModal(id);
  };

  if (tasksError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log("tasksError", tasksError.message);
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
          refetchTasks();
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
    refetchTasks,
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
        refetchTasks();
      },
    });
  }, [mutateUpdateTaskStatus, openModalId, refetchTasks, getValues]);
  console.log(tasksData, "tasksData");

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
          refetchTasks();
        },
      });
      closeModal();
    },
    [onClose]
  );

  const closeModal = useCallback(() => {
    setOpenModalId(null);
    onClose();
  }, [onClose]);

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
            onClickEdit={onClickEdit}
          />
        ),
      },
    ],
    [onClickEdit, onDelete]
  );

  return {
    tasksData: tasksData?.tasksCollection?.edges,
    tasksLoading,
    tasksError,
    refetchTasks,
    onCreate,
    onUpdate,
    onCreateNewTask,
    deleteTask,
    onClickEdit,
    isEditing,
    columns,
    isOpen,
    onOpen,
    onOpenChange,
  };
};

export { useTasks };
