"use client";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/moving-border";
import { useReactiveVar } from "@apollo/client";

import { Spinner } from "@/components/ui/spinner";

import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-effect-demo";

import WorkspaceModal from "@/components/modal/WorkspaceModal";

import { DataTable } from "@/components/table/data-table";

import { useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  setHeaderName,
  setIsEditing,
  setOpenModalId,
  setVisibleHeader,
} from "@/apollo/reactive-store";

import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";

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
    onCreate,
    onDelete,
    onUpdate,
    setValue,
    control,
    handleSubmit,
    getValues,
  } = useWorkspace();
  const openModalId = useReactiveVar(setOpenModalId);
  const isEditing = useReactiveVar(setIsEditing);

  useEffect(() => {
    if (!username) {
      router.push("/");
    } else {
      setVisibleHeader(true);
      setHeaderName("Workspaces");
    }
  }, [router, username]);

  const {
    tasksData,
    tasksLoading,
    onCreateNewTask,
    columns,
    isOpen,
    onOpen,
    onOpenChange,
  } = useTasks();

  const goToOffice = (workspace_id: string, workspace_name: string) => {
    router.push(`/${user_id}/${workspace_id}`);
    localStorage.setItem("workspace_id", workspace_id);
    localStorage.setItem("workspace_name", workspace_name);
  };

  const onCreateNewWorkspace = () => {
    setValue("title", "");
    setValue("description", "");
    onOpen();
    setIsEditing(false);
  };

  return (
    <Layout loading={tasksLoading || workspacesLoading}>
      <main className="flex flex-col items-center justify-between">
        {tasksLoading && workspacesLoading && <Spinner size="lg" />}

        <div style={{ position: "absolute", top: 75, right: 70 }}>
          <Button onClick={onCreateNewWorkspace}>Create workspace</Button>
        </div>

        {!tasksLoading && (
          <CanvasRevealEffectDemo
            officeData={workspacesData || []}
            onClick={(workspace_id, workspace_name) =>
              goToOffice(workspace_id, workspace_name)
            }
          />
        )}
        <div style={{ padding: "10px" }} />
        <div style={{ position: "absolute", top: 600, right: 70 }}>
          <Button onClick={onCreateNewTask}>Create task</Button>
        </div>
        {tasksData && <DataTable data={tasksData} columns={columns} />}
        <>
          {isOpen && (
            <WorkspaceModal
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
        </>
        <div style={{ padding: "100px" }} />
      </main>
    </Layout>
  );
}
