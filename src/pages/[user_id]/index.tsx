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

  const goToOffice = (workspace_id: string) => {
    router.push(`/${user_id}/${workspace_id}`);
    localStorage.setItem("workspace_id", workspace_id);
  };

  const onCreateNewWorkspace = () => {
    setValue("title", "");
    setValue("description", "");
    onOpen();
    setIsEditing(false);
  };

  return (
    <Layout loading={loading}>
      <main className="flex flex-col items-center justify-between p-14">
        {loading && <Spinner size="lg" />}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-10  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20 text-center">
              Workspaces
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", top: 60, right: 30 }}>
          <Button onClick={onCreateNewWorkspace}>Create workspace</Button>
        </div>

        {!loading && (
          <CanvasRevealEffectDemo
            officeData={workspaceNode || []}
            onClick={(workspace_id) => goToOffice(workspace_id)}
          />
        )}
        <div style={{ padding: "10px" }} />
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
