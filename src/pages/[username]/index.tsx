"use client";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

import { useReactiveVar } from "@apollo/client";

import { Spinner } from "@/components/ui/spinner";

import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-effect-demo";

import WorkspaceModal from "@/components/modal/WorkspaceModal";

import { DataTable } from "@/components/table/data-table";

import { useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { setIdTask, setVisibleHeader } from "@/apollo/reactive-store";

import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";
import TaskModal from "@/components/modal/TaskModal";
import { Button } from "@/components/ui/moving-border";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { BreadcrumbWithCustomSeparator } from "@/components/ui/breadcrumb-with-custom-separator";

export type updateUserDataType = {
  user_id: string;
  first_name: string;
  last_name: string;
  designation: string;
};

export default function Office() {
  const router = useRouter();

  const { username, user_id } = useUser();

  const {
    workspacesData,
    workspacesLoading,
    workspacesError,
    isOpenModalWorkspace,
    onOpenModalWorkspace,
    onOpenChangeModalWorkspace,
    onCreateWorkspace,
    onDeleteWorkspace,
    onUpdateWorkspace,
    setValueWorkspace,
    controlWorkspace,
    handleSubmitWorkspace,
    getValuesWorkspace,
    openModalWorkspaceId,
    isEditingWorkspace,
    setIsEditingWorkspace,
    welcomeMenu,
  } = useWorkspace();

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      setVisibleHeader(true);
      localStorage.setItem("workspace_id", "");
      localStorage.setItem("workspace_name", "");
      localStorage.setItem("room_name", "");
      localStorage.setItem("room_id", "");
      localStorage.setItem("recording_id", "");
      localStorage.setItem("recording_name", "");
    }
  }, [router, username]);

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
    getValuesTask: getValues,
    onCreateNewTask,
    columns,
    openModalTaskId,
    setOpenModalTaskId,
    isEditingTask,
  } = useTasks();

  const id_task = useReactiveVar(setIdTask);

  useEffect(() => {
    if (id_task) {
      setOpenModalTaskId(id_task);
    }
  }, [id_task, setOpenModalTaskId]);

  const goToOffice = (
    type: string,
    workspace_id: string,
    workspace_name: string
  ) => {
    router.push(`/${username}/${workspace_id}`);
    localStorage.setItem("workspace_id", workspace_id);
    localStorage.setItem("workspace_name", workspace_name);
    localStorage.setItem("type", type);
  };

  const onCreateNewWorkspace = () => {
    setValueWorkspace("title", "");
    setValueWorkspace("description", "");
    onOpenModalWorkspace();
    setIsEditingWorkspace(false);
  };

  return (
    <Layout loading={tasksLoading || workspacesLoading}>
      <main className="flex flex-col items-center justify-between">
        {/* <TextRevealCard text="Workspaces" revealText="Workspaces" /> */}
        <BreadcrumbWithCustomSeparator username={username} />

        {tasksLoading && workspacesLoading && <Spinner size="lg" />}

        {/* <div style={{ position: "absolute", top: 75, right: 70 }}>
          <Button onClick={onCreateNewWorkspace}>Create workspace</Button>
        </div> */}

        {!tasksLoading && (
          <CanvasRevealEffectDemo
            officeData={welcomeMenu || []}
            onClick={(type, workspace_id, workspace_name) =>
              goToOffice(type, workspace_id, workspace_name)
            }
          />
        )}

        {/* <div style={{ alignSelf: "flex-end", paddingRight: "75px" }}>
          <Button onClick={() => onCreateNewTask()}>Create task</Button>
        </div> */}
        {tasksData && <DataTable data={tasksData} columns={columns} />}

        <>
          {isOpenModalWorkspace && (
            <WorkspaceModal
              isOpen={isOpenModalWorkspace}
              onOpen={onOpenModalWorkspace}
              onOpenChange={onOpenChangeModalWorkspace}
              onCreate={onCreateWorkspace}
              onDelete={() =>
                openModalWorkspaceId && onDeleteWorkspace(openModalWorkspaceId)
              }
              onUpdate={onUpdateWorkspace}
              control={controlWorkspace}
              handleSubmit={handleSubmitWorkspace}
              getValues={getValuesWorkspace}
              setValue={setValueWorkspace}
              isEditing={isEditingWorkspace}
            />
          )}

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
              getValues={getValues}
              setValue={setValueTask}
              isEditing={isEditingTask}
            />
          )}
        </>
        <div style={{ padding: "100px" }} />
      </main>
    </Layout>
  );
}
