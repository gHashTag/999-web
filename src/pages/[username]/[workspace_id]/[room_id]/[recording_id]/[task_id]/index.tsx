"use client";
import React from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useTasks } from "@/hooks/useTasks";
import { usePassport } from "@/hooks/usePassport";
import { TaskForm } from "@/components/ui/task-form";
import { useUser } from "@/hooks/useUser";
import InviteMemberModal from "@/components/modal/InviteMemberModal";

const TaskPage = () => {
  const { workspace_id, room_id } = useUser();
  const {
    tasksData,
    tasksLoading,
    onUpdateTask,
    handleSubmitTask,
    watchTask,
    setValueTask,
  } = useTasks();
  const router = useRouter();
  const { task_id } = router.query;
  const {
    passportData,
    passportLoading,
    passportError,
    isOpenModalPassport,
    onOpenModalPassport,
    onOpenChangeModalPassport,
    onCreatePassport,
    onDeletePassport,
    onUpdatePassport,
    setValuePassport,
    controlPassport,
    handleSubmitPassport,
    getValuesPassport,
    openModalPassportId,
    isEditingPassport,
  } = usePassport({
    room_id,
    workspace_id,
  });
  console.log(isOpenModalPassport, "isOpenModalPassport");

  return (
    <>
      <Layout loading={tasksLoading}>
        {!tasksLoading &&
          tasksData // @ts-ignore FIX ME
            .filter(({ node }) => node.id === task_id)
            .map(({ node }) => {
              return (
                <TaskForm
                  key={node.id}
                  user_id={node.user_id}
                  id={node.id}
                  title={node.title}
                  description={node.description}
                  priority={node.priority || "low"}
                  status={node.status || "todo"}
                  is_public={node.is_public}
                  cost={node.cost}
                  created_at={node.created_at}
                  handleSubmitTask={handleSubmitTask}
                  watchTask={watchTask}
                  setValueTask={setValueTask}
                  onUpdateTask={onUpdateTask}
                />
              );
            })}

        <div style={{ padding: "100px" }} />
        {isOpenModalPassport && (
          <InviteMemberModal
            isOpen={isOpenModalPassport}
            onOpen={onOpenModalPassport}
            onOpenChange={onOpenChangeModalPassport}
            onCreate={onCreatePassport}
            onDelete={() =>
              openModalPassportId && onDeletePassport(openModalPassportId)
            }
            onUpdate={onUpdatePassport}
            control={controlPassport}
            handleSubmit={handleSubmitPassport}
            getValues={getValuesPassport}
            setValue={setValuePassport}
            isEditing={isEditingPassport}
          />
        )}
      </Layout>
    </>
  );
};

export default TaskPage;
