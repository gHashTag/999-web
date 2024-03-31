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

import { DataTableRowActions } from "../../../components/table/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/moving-border";
import TaskModal from "@/components/Kanban/TaskModal";
import { useSupabase } from "@/hooks/useSupabase";
import { priorities, statuses } from "@/helpers/data/data";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default function Tasks() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const user_id = localStorage.getItem("user_id");
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const { getTaskById } = useSupabase();
  const { loading, error, data, refetch } = useQuery(TASKS_COLLECTION_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      user_id,
    },
  });

  const {
    loading: tasksLoading,
    error: tasksError,
    data: tasksData,
    refetch: tasksRefetch,
  } = useQuery(TASKS_COLLECTION_QUERY, {
    variables: {
      user_id,
    },
  });

  // const { data: taskById, error: taskByIdError } = useQuery(TASK_BY_ID_QUERY, {
  //   variables: { id: openModalId },
  //   client: apolloClient,
  // });
  // if (taskByIdError instanceof ApolloError) {
  //   // Обработка ошибки ApolloError
  //   console.log(taskByIdError.message);
  // }
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [mutateUpdateTaskStatus, { error: mutateUpdateTaskStatusError }] =
    useMutation(MUTATION_TASK_UPDATE, {
      variables: {
        user_id,
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
    console.log(mutateCreateTaskError.message);
  }

  const [deleteTask, { error: deleteTaskError }] = useMutation(
    DELETE_TASK_MUTATION,
    {
      variables: {
        user_id,
      },
    }
  );

  const columns = useMemo(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }: any) => (
      //     <Checkbox
      //       checked={
      //         table.getIsAllPageRowsSelected() ||
      //         (table.getIsSomePageRowsSelected() && "indeterminate")
      //       }
      //       onCheckedChange={(value: any) =>
      //         table.toggleAllPageRowsSelected(!!value)
      //       }
      //       aria-label="Select all"
      //       className="translate-y-[2px]"
      //     />
      //   ),
      //   cell: ({ row }: any) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       onCheckedChange={(value: any) => row.toggleSelected(!!value)}
      //       aria-label="Select row"
      //       className="translate-y-[2px]"
      //     />
      //   ),
      //   enableSorting: false,
      //   enableHiding: false,
      // },
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
      // {
      //   accessorKey: "priority",
      //   header: ({ column }) => {
      //     return <DataTableColumnHeader column={column} title="Priority" />;
      //   },
      //   accessorFn: (row: any) => {
      //     return row.node.priority;
      //   },
      //   cell: ({ row }) => {
      //     const priority = priorities.find(
      //       (priority) => priority.value === row.original.node.priority
      //     );
      //     if (!priority) {
      //       return null;
      //     }

      //     return (
      //       <div className="flex items-center">
      //         {priority.icon && (
      //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
      //         )}
      //         <span>{priority.label}</span>
      //       </div>
      //     );
      //   },
      //   filterFn: (row, id, value) => {
      //     return value.includes(row.getValue(id));
      //   },
      // },
      // {
      //   accessorKey: "status",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title="Status" />
      //   ),
      //   cell: ({ row }) => {
      //     const status = statuses.find(
      //       (status) => status.value === row.original.node.status
      //     );

      //     if (!status) {
      //       return null;
      //     }

      //     return (
      //       <div className="flex w-[100px] items-center">
      //         {status.icon && (
      //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
      //         )}
      //         <span>{status.label}</span>
      //       </div>
      //     );
      //   },
      //   filterFn: (row, id, value) => {
      //     return value.includes(row.getValue(id));
      //   },
      // },
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
    []
  );

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
      const formDataWithUserId = {
        ...formData,
        user_id,
      };

      const mutateCreateTaskResult = await mutateCreateTask({
        variables: {
          objects: [formDataWithUserId],
        },
        onCompleted: () => {
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
  };

  const closeModal = () => {
    setOpenModalId(null);
    onClose();
  };

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

  const openModal = async (cardId: string) => {
    setOpenModalId(cardId);
    const card = await getTaskById(cardId);
    setValue("title", card?.title);
    setValue("description", card?.description);
    setValue("label", card?.label);
    onOpen();
    setIsEditing(true);
  };

  // console.log(tasksData, "tasksData");
  // const data = useMemo(() => [tasksData.tasksCollection.edges], []);
  return (
    <Layout loading={loading}>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          {/* <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div> */}
          {/* <div className="flex items-center space-x-2">
            <UserNav />
          </div> */}
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
