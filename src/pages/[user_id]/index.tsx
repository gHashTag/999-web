"use client";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/moving-border";
import { useQuery, useReactiveVar } from "@apollo/client";

import { Spinner } from "@/components/ui/spinner";

import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-effect-demo";
import { WORKSPACES_COLLECTION_QUERY } from "@/graphql/query";
import WorkspaceModal from "@/components/modal/WorkspaceModal";

import { DataTable } from "@/components/table/data-table";
import { useTable } from "@/hooks/useTable";
import { useEffect, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  setHeaderName,
  setIsEditing,
  setOpenModalId,
  setVisibleHeader,
} from "@/apollo/reactive-store";

export type updateUserDataType = {
  user_id: string;
  first_name: string;
  last_name: string;
  designation: string;
};

export default function Office() {
  const router = useRouter();
  const username = localStorage.getItem("username") || "";
  const user_id = localStorage.getItem("user_id") || "";
  const { onCreate, onDelete, onUpdate } = useWorkspace(user_id, username);
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
    loading,
    data,
    setValue,
    columns,
    isOpen,
    control,
    handleSubmit,
    onCreateNewTask,
    getValues,
    onOpen,
    onOpenChange,
  } = useTable({
    username,
    user_id,
  });

  const {
    data: workspacesData,
    loading: workspacesLoading,
    error: workspacesError,
    refetch: workspacesRefetch,
  } = useQuery(WORKSPACES_COLLECTION_QUERY, {
    variables: {
      user_id,
    },
  });
  console.log(workspacesError, "workspacesError");
  if (workspacesError) return <p>Error : {workspacesError.message}</p>;

  const workspaceNode = workspacesData?.workspacesCollection?.edges;

  const goToOffice = (workspace_id: string, workspace_name: string) => {
    console.log(workspace_name, "workspace_name");
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
    <Layout loading={loading}>
      <main className="flex flex-col items-center justify-between">
        {loading && <Spinner size="lg" />}

        <div style={{ position: "absolute", top: 75, right: 70 }}>
          <Button onClick={onCreateNewWorkspace}>Create workspace</Button>
        </div>

        {!loading && (
          <CanvasRevealEffectDemo
            officeData={workspaceNode || []}
            onClick={(workspace_id, workspace_name) =>
              goToOffice(workspace_id, workspace_name)
            }
          />
        )}
        <div style={{ padding: "10px" }} />
        <div style={{ position: "absolute", top: 600, right: 70 }}>
          <Button onClick={onCreateNewTask}>Create task</Button>
        </div>
        {data && (
          <DataTable data={data.tasksCollection.edges} columns={columns} />
        )}
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
      </main>
    </Layout>
  );
}
