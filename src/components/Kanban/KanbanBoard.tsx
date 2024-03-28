import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  // @ts-ignore
} from "@dnd-kit/core";

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "./Column";
import { Board, BoardData, StatusMap, Task, TasksArray } from "@/types";
import { Button } from "@/components/ui/moving-border";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TaskModal from "./TaskModal";
import {
  gql,
  useQuery,
  useReactiveVar,
  useMutation,
  ApolloError,
} from "@apollo/client";

import { useDisclosure } from "@nextui-org/react";
import { setUserId } from "@/apollo/reactive-store";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { useSupabase } from "@/hooks/useSupabase";

const TASKS_COLLECTION_QUERY = gql`
  query GetTasks($user_id: UUID!) {
    tasksCollection(filter: { and: [{ user_id: { eq: $user_id } }] }) {
      edges {
        node {
          id
          user_id
          created_at
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          order
        }
      }
    }
  }
`;

// const TASK_BY_ID_QUERY = gql`
//   query GetTaskById($id: BigInt!) {
//     tasksCollection(filter: { id: { eq: $id } }) {
//       edges {
//         node {
//           id
//           user_id
//           created_at
//           title
//           description
//           updated_at
//           due_date
//           priority
//           assigned_to
//           labels
//           completed_at
//           is_archived
//           status
//         }
//       }
//     }
//   }
// `;

const CREATE_TASK_MUTATION = gql`
  mutation CreateTasks($objects: [tasksInsertInput!]!) {
    insertIntotasksCollection(objects: $objects) {
      records {
        id
        user_id
        created_at
        title
        description
        updated_at
        due_date
        priority
        assigned_to
        labels
        completed_at
        is_archived
        status
        order
      }
    }
  }
`;

const MUTATION_TASK_UPDATE = gql`
  mutation updatetasksCollection(
    $id: BigInt!
    $status: BigInt!
    $title: String!
    $description: String!
    $updated_at: Datetime!
    $order: BigInt!
  ) {
    updatetasksCollection(
      filter: { id: { eq: $id } }
      set: {
        status: $status
        updated_at: $updated_at
        title: $title
        description: $description
        order: $order
      }
    ) {
      records {
        id
        user_id
        title
        description
        status
        due_date
        assigned_to
        completed_at
        is_archived
        updated_at
        created_at
        labels
        priority
        order
      }
    }
  }
`;

const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($filter: tasksFilter!, $atMost: Int!) {
    deleteFromtasksCollection(filter: $filter, atMost: $atMost) {
      records {
        id
        title
      }
    }
  }
`;

function KanbanBoard() {
  const { toast } = useToast();
  const user_id = localStorage.getItem("user_id");
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const { loading, error, data, refetch } = useQuery(TASKS_COLLECTION_QUERY, {
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
  // if (deleteTaskError instanceof ApolloError) {
  //   // Обработка ошибки ApolloError
  //   console.log(deleteTaskError.message);
  // }
  const { getTaskById } = useSupabase();
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  // console.log(boardData, "boardData");
  const [isEditing, setIsEditing] = useState(false);
  const [card, setCard] = useState<Task>();

  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const statusToColumnName: Record<number, string> = {
    1: "To Do",
    2: "In Progress",
    3: "Review",
    4: "Done",
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
          });
        },
      });
    } catch (error) {
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

  const transformTasksToBoardData = useCallback(
    (tasksFromServer: TasksArray): BoardData[] => {
      const board: Board = {
        "To Do": [],
        "In Progress": [],
        Review: [],
        Done: [],
      };

      tasksFromServer.forEach((task) => {
        const columnName = statusToColumnName[task.node.status];
        if (columnName && board[columnName]) {
          board[columnName].push({
            __typename: task.__typename,
            node: {
              ...task.node,
            },
          });
        }
      });

      // Добавляем сортировку для каждого столбца
      Object.keys(board).forEach((columnName) => {
        board[columnName].sort((a, b) => a.node.order - b.node.order);
      });

      const newData = Object.entries(board).map(([title, cards]) => ({
        id: title,
        title,
        cards,
      }));

      return newData;
    },
    []
  );

  useEffect(() => {
    if (data) {
      const newData = transformTasksToBoardData(data.tasksCollection.edges);
      setBoardData(newData);
    }
  }, [data]);

  const findColumn = (unique: string | null) => {
    if (!unique || !boardData) {
      return null;
    }

    if (boardData.some((c) => String(c.id) === String(unique))) {
      return boardData.find((c) => String(c.id) === String(unique)) ?? null;
    }

    const id = String(unique);
    const itemWithColumnId = boardData.flatMap((card: BoardData) => {
      const columnId = card.id;
      return card.cards?.map((i: Task) => ({
        itemId: i.node.id,
        columnId: columnId,
      }));
    });

    const columnId = itemWithColumnId.find(
      (i) => String(i?.itemId) === id
    )?.columnId;
    return boardData.find((c) => String(c.id) === String(columnId)) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);

    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }

    setBoardData((prevState: BoardData[]) => {
      if (!prevState) {
        return [];
      }
      const activeItems = activeColumn.cards;
      const overItems = overColumn.cards;
      const activeIndex = activeItems
        ? activeItems.findIndex((i) => String(i.node.id) === activeId)
        : -1;
      const overIndex = overItems
        ? overItems.findIndex((i) => String(i.node.id) === overId)
        : -1;

      const newIndex = () => {
        const putOnBelowLastItem =
          overItems && overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0
          ? overIndex + modifier
          : (overItems ? overItems.length : 0) + 1;
      };
      return prevState?.map((c) => {
        if (c.id === activeColumn.id) {
          c.cards = activeItems
            ? activeItems.filter((i) => String(i.node.id) !== activeId)
            : [];
          return c;
        } else if (c.id === overColumn.id) {
          c.cards = [
            ...(overItems ? overItems.slice(0, newIndex()) : []),
            ...(activeItems ? [activeItems[activeIndex]] : []),
            ...(overItems ? overItems.slice(newIndex(), overItems.length) : []),
          ];
          return c;
        } else {
          return c;
        }
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }

    function getColumnStatus(columnId: string): number {
      const statusMap: StatusMap = {
        "To Do": 1,
        "In Progress": 2,
        Review: 3,
        Done: 4,
      };
      return statusMap[columnId] || 1;
    }

    let newStatus: number;

    if (activeColumn.id !== overColumn.id) {
      newStatus = getColumnStatus(overColumn.id.toString());
    }

    const updateTasksOrder = async (
      updatedTasks: { id: string; order: number }[]
    ) => {
      try {
        const updatePromises = updatedTasks.map((task) =>
          mutateUpdateTaskStatus({
            variables: {
              id: task.id,
              status: newStatus,
              updated_at: new Date().toISOString(),
              order: task.order,
            },
          })
        );

        await Promise.all(updatePromises);
        console.log("Все задачи успешно обновлены");
      } catch (error) {
        console.error("Ошибка при обновлении задач:", error);
      }
    };

    const activeIndex = activeColumn.cards
      ? activeColumn.cards.findIndex((i) => String(i.node.id) === activeId)
      : -1;
    const overIndex = overColumn.cards
      ? overColumn.cards.findIndex((i) => String(i.node.id) === overId)
      : -1;
    if (activeIndex !== overIndex) {
      setBoardData((prevState) => {
        if (!prevState) {
          return [];
        }
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            if (overColumn.cards) {
              // Сохраняем состояние до перемещения
              const beforeMove = overColumn.cards.map((card) => card.node.id);
              console.log("До перемещения:", beforeMove);

              // Выполняем перемещение
              column.cards = arrayMove(
                overColumn.cards,
                activeIndex,
                overIndex
              );

              // Сохраняем состояние после перемещения
              const afterMove = column.cards.map((card) => card.node.id);
              console.log("После перемещения:", afterMove);

              const updatedTasks = afterMove.map((id, index) => ({
                id,
                order: index,
              }));
              setTimeout(() => {
                updateTasksOrder(updatedTasks); // updatedData - это новые данные, которые вы хотите установить
              }, 30000);
            }
            return column;
          } else {
            return column;
          }
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openModal = async (cardId: string) => {
    setOpenModalId(cardId);
    const card = await getTaskById(cardId);
    setCard(card);
    setValue("title", card?.title);
    setValue("description", card?.description);
    onOpen();
    setIsEditing(true);
  };

  const closeModal = () => {
    setOpenModalId(null);
    onClose();
  };

  const onDelete = () => {
    openModalId &&
      deleteTask({
        variables: {
          filter: {
            id: {
              eq: Number(openModalId),
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

  const onCreateNewTask = () => {
    setValue("title", "");
    setValue("description", "");
    onOpen();
    setIsEditing(false);
  };

  return (
    <div style={{ paddingLeft: 40, paddingTop: 40 }}>
      <div style={{ position: "absolute", top: 100, right: 30 }}>
        <Button onClick={onCreateNewTask}>Create task</Button>
      </div>
      {isOpen && (
        <TaskModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          onCreate={onCreate}
          onDelete={onDelete}
          onUpdate={onUpdate}
          control={control}
          handleSubmit={handleSubmit}
          getValues={getValues}
          setValue={setValue}
          isEditing={isEditing}
          card={card}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
          {boardData &&
            boardData.map((value: BoardData) => {
              if (value.cards) {
                return (
                  <div key={value.id}>
                    <text> </text>
                    <Column
                      key={value.id}
                      id={value.id}
                      title={value.title}
                      cards={value.cards}
                      openModal={openModal}
                    />
                  </div>
                );
              }
            })}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
//https://codesandbox.io/p/sandbox/dnd-kit-kanban-board-1df69n?
