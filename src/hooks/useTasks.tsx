import { useToast } from "@/components/ui/use-toast";
import {
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  GET_TASKS_BY_RECORDING_ID,
  MUTATION_TASK_STATUS_UPDATE,
  MUTATION_TASK_UPDATE,
  GET_TASKS_BY_USER_ID,
  TASKS_COLLECTION_QUERY,
  GET_PUBLIC_ROOM_TASKS_QUERY,
  GET_ROOM_TASKS_WORKSPACE_ID_QUERY,
  GET_TASKS_BY_NOT_EQ_USER_ID,
} from "@/graphql/query.tasks";
import { useRouter } from "next/router";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useDisclosure } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import {
  FieldValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { setEditTask, setOpenModalId } from "@/apollo/reactive-store";
import { useUser } from "./useUser";
import { AssignedTo, PassportNode, TasksArray } from "@/types";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Checkbox } from "@radix-ui/react-checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { priorities, statuses } from "@/helpers/data/data";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { captureExceptionSentry } from "@/utils/sentry";

const useTasks = (): UseTasksReturn => {
  const {
    username,
    user_id,
    workspace_id,
    workspace_type,
    room_id,
    recording_id,
  } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [openModalTaskId, setOpenModalTaskId] = useState<string>("");

  const { control, handleSubmit, getValues, setValue, reset, watch } =
    useForm();

  let queryVariables = {};
  let query = GET_TASKS_BY_USER_ID;

  // console.log(workspace_type, "workspace_type");
  // console.log(user_id, "user_id");
  // console.log(workspace_id, "workspace_id");

  if (!recording_id && !room_id && !workspace_id) {
    // console.log("tasksQuery :::1");
    query = TASKS_COLLECTION_QUERY;
    queryVariables = {
      user_id,
      // id: localStorage.getItem("id"),
    };
  } else if (
    !room_id &&
    !recording_id &&
    workspace_id &&
    workspace_type === "Fire"
  ) {
    // console.log("tasksQuery :::2");
    query = TASKS_COLLECTION_QUERY;
    queryVariables = {
      workspace_id,
      user_id,
    };
  } else if (
    !room_id &&
    !recording_id &&
    workspace_id &&
    workspace_type === "Water"
  ) {
    // console.log("tasksQuery Water");
    query = GET_TASKS_BY_NOT_EQ_USER_ID;
    queryVariables = {
      user_id,
    };
  } else if (
    !room_id &&
    !recording_id &&
    workspace_id &&
    workspace_type === "Copper pipes"
  ) {
    // console.log("tasksQuery Copper pipes");
    query = GET_PUBLIC_ROOM_TASKS_QUERY;
  } else if (!recording_id && room_id && workspace_id) {
    // console.log("tasksQuery :::3");
    query = TASKS_COLLECTION_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
    };
  } else if (recording_id && !room_id && !workspace_id) {
    // console.log("tasksQuery :::4");
    query = GET_TASKS_BY_RECORDING_ID;
    queryVariables = {
      recording_id,
    };
  } else if (recording_id && room_id && workspace_id) {
    // console.log("tasksQuery :::5");
    query = GET_TASKS_BY_RECORDING_ID;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
      recording_id,
    };
  } else {
    console.log("Workspace ID is undefined");
    // Дополнительная логика для случая, когда workspace_id равен undefined
  }

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery(query, {
    fetchPolicy: "network-only",
    variables: queryVariables,
    skip: !queryVariables,
  });

  const onClickEdit = (
    isEditing: boolean,
    id: string,
    workspace_id: string,
    room_id: string
  ) => {
    setOpenModalTaskId(id);
    setEditTask(true);
    localStorage.setItem("workspace_id", workspace_id);
    localStorage.setItem("room_id", room_id);
    router.push(`/${username}/${user_id}/${workspace_id}/${room_id}/0/${id}`);
  };

  if (tasksError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log("tasksError", tasksError.message);
  }
  const [mutateUpdateTaskStatus, { error: mutateUpdateTaskStatusError }] =
    useMutation(MUTATION_TASK_STATUS_UPDATE, {
      variables: {
        username,
      },
    });

  if (mutateUpdateTaskStatusError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateUpdateTaskStatusError.message);
  }

  const [mutateUpdateTask, { error: mutateUpdateTaskError }] = useMutation(
    MUTATION_TASK_UPDATE,
    {
      variables: {
        username,
      },
    }
  );
  if (mutateUpdateTaskError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateUpdateTaskError.message);
  }

  const [mutateCreateTask, { error: mutateCreateTaskError }] =
    useMutation(CREATE_TASK_MUTATION);
  if (mutateCreateTaskError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log("mutateCreateTaskError", mutateCreateTaskError.message);
  }

  const [deleteTask, { error: deleteTaskError }] =
    useMutation(DELETE_TASK_MUTATION);

  const onCreateNewTask = (
    workspace_id?: string,
    room_id?: string,
    recording_id?: string
  ) => {
    setValue("title", "");
    setValue("description", "");
    setValue("label", "");
    setValue("is_public", false);
    setValue("cost", 0);
    workspace_id && localStorage.setItem("workspace_id", workspace_id);
    room_id && localStorage.setItem("room_id", room_id);
    recording_id && localStorage.setItem("recording_id", recording_id);
    onOpen();
    setEditTask(false);
  };

  const onCreateTask = useCallback(async () => {
    try {
      const formData = getValues();

      const formDataWithUserId = {
        ...formData,
        user_id,
        workspace_id,
        room_id,
        recording_id,
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
            priority: "",
            status: "",
            is_public: false,
            cost: 0,
          });
        },
      });
    } catch (error) {
      captureExceptionSentry("Error creating task", "useTasks");
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

  const onUpdateTaskStatus = useCallback(
    async (id: string) => {
      const formData = getValues();

      const variables = {
        id,
        title: formData.title,
        description: formData.description,
        updated_at: new Date().toISOString(),
      };

      await mutateUpdateTaskStatus({
        variables,
        onCompleted: () => {
          refetchTasks();
        },
      });
    },
    [mutateUpdateTaskStatus, openModalTaskId, refetchTasks, getValues]
  );

  const onUpdateTask = useCallback(
    async (id: string) => {
      const formData = getValues();

      const variables = {
        id,
        title: formData.title,
        description: formData.description,
        updated_at: new Date().toISOString(),
        priority: formData.priority,
        status: formData.status,
        is_public: formData.is_public,
        cost: formData.cost,
      };

      await mutateUpdateTask({
        variables,
        onCompleted: () => {
          refetchTasks();
        },
      });
    },
    [mutateUpdateTaskStatus, openModalTaskId, refetchTasks, getValues]
  );

  const updateTask = useCallback(
    async (task_id: string, assigned_to: AssignedTo[]) => {
      const formData = getValues();
      const variables = {
        id: task_id,
        title: formData.title,
        description: formData.description,
        updated_at: new Date().toISOString(),
        priority: formData.priority,
        status: formData.status,
        is_public: formData.is_public,
        cost: formData.cost,
        assigned_to: JSON.stringify(assigned_to),
      };

      await mutateUpdateTask({
        variables,
        onCompleted: () => {
          refetchTasks();
        },
      });
    },
    [mutateUpdateTaskStatus, openModalTaskId, refetchTasks, getValues]
  );

  const onDeleteTask = useCallback(
    (id: string) => {
      deleteTask({
        variables: {
          filter: {
            id: {
              eq: id,
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

  const onEditTask = (id: string) => {
    // const isOwner = task_user_id === user_id;
    setEditTask(false);
    localStorage.setItem("header_name", `Task #${id}`);
    router.push(`/${username}/${user_id}/${workspace_id}/0/0/${id}`);
  };

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
        cell: ({ row }: any) => (
          <div onClick={() => onEditTask(row.original.node.id)}>
            {row.getValue("id")}
          </div>
        ),
      },
      {
        accessorFn: (row: any) => {
          return row.node.title;
        },
        id: "title",
        header: "Title",
        cell: ({ row }: any) => {
          return (
            <div
              className="flex space-x-2"
              onClick={() => onEditTask(row.original.node.id)}
            >
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
        cell: ({ row }: any) => (
          <div onClick={() => onEditTask(row.original.node.id)}>
            {row.getValue("description")}
          </div>
        ),
      },
      {
        accessorFn: (row: any) => {
          return row.node.is_public;
        },
        id: "is_public",
        header: "Public",
        cell: ({ row }: any) => (
          <div onClick={() => onEditTask(row.original.node.id)}>
            {row.getValue("is_public") ? "true" : "false"}
          </div>
        ),
      },
      {
        accessorFn: (row: any) => {
          return row.node.cost;
        },
        id: "cost",
        header: "Cost",
        cell: ({ row }: any) => (
          <div onClick={() => onEditTask(row.original.node.id)}>
            {row.getValue("cost")}
          </div>
        ),
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
            <div
              className="flex items-center"
              onClick={() => onEditTask(row.original.node.id)}
            >
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
            <div
              className="flex w-[100px] items-center"
              onClick={() => onEditTask(row.original.node.id)}
            >
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{status.label}</span>
            </div>
          );
        },
      },
      {
        accessorFn: (row: any) => {
          return row.node.cost;
        },
        id: "assignee",
        header: "Assignee",
        cell: ({ row }: any) => {
          console.log(row, "row");
          const assigned_to = JSON.parse(
            row?.original?.node?.assigned_to || "[]"
          );
          console.log("assigned_to", assigned_to);
          return (
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex" }}>
                {/* {assigned_to &&
                  assigned_to.map((item: any, index: number) => (
                    <Avatar
                      key={index}
                      className="h-8 w-8"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <AvatarImage
                        src={item.photo_url || ""}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: index,
                        }}
                      />
                    </Avatar>
                  ))} */}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }: any) => {
          const isOwnerTask = row.original.node.user_id === user_id;
          return (
            isOwnerTask && (
              <DataTableRowActions
                row={row}
                onDelete={onDeleteTask}
                onClickEdit={onClickEdit}
              />
            )
          );
        },
      },
    ],
    [onClickEdit, onDeleteTask]
  );

  return {
    tasksData: tasksData?.tasksCollection?.edges,
    tasksLoading,
    tasksError,
    refetchTasks,
    isOpenModalTask: isOpen,
    onOpenModalTask: onOpen,
    onOpenChangeModalTask: onOpenChange,
    onCreateTask,
    onDeleteTask,
    onUpdateTask,
    updateTask,
    onUpdateTaskStatus,
    setValueTask: setValue,
    openModalTaskId,
    setOpenModalTaskId,
    controlTask: control,
    handleSubmitTask: handleSubmit,
    getValuesTask: getValues,
    onCreateNewTask,
    columns,

    resetTask: reset,
    watchTask: watch,
  };
};

type UseTasksReturn = {
  tasksData: TasksArray;
  tasksLoading: boolean;
  tasksError: any;
  refetchTasks: () => void;
  isOpenModalTask: boolean;
  onOpenModalTask: () => void;
  onOpenChangeModalTask: () => void;
  onCreateTask: () => void;
  onUpdateTask: (id: string) => void;
  updateTask: (task_id: string, assigned_to: PassportNode[]) => void;
  onUpdateTaskStatus: (id: string) => void;
  onDeleteTask: (id: string) => void;
  openModalTaskId: string;
  setOpenModalTaskId: (id: string) => void;
  controlTask: any;
  getValuesTask: any;
  onCreateNewTask: (
    workspace_id?: string,
    room_id?: string,
    recording_id?: string
  ) => void;
  columns: any;
  resetTask: any;
  handleSubmitTask: UseFormHandleSubmit<FieldValues, undefined>;
  watchTask: UseFormWatch<FieldValues>;
  setValueTask: UseFormSetValue<FieldValues>;
};

export { useTasks };
