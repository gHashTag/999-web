"use client";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/moving-border";
import { useQuery } from "@apollo/client";

import { Spinner } from "@/components/ui/spinner";

import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-effect-demo";
import { WORKSPACES_COLLECTION_QUERY } from "@/graphql/query";
import WorkspaceModal from "@/components/modal/WorkspaceModal";

import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/pages/_app";
import { useTable } from "@/hooks/useTable";
import { useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";

export type updateUserDataType = {
  user_id: string;
  first_name: string;
  last_name: string;
  designation: string;
};

export default function Office() {
  const router = useRouter();
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!username) {
      router.push("/");
    }
  }, [router, username]);

  const userName = __DEV__ ? "koshey999nft" : username;
  const userId = __DEV__ ? "ec0c948a-2b96-4ccd-942f-0a991d78a94f" : user_id;

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

  if (workspacesError) return <p>Error : {workspacesError.message}</p>;

  const workspaceNode = workspacesData?.workspacesCollection?.edges;

  const {
    loading,
    data,
    setValue,
    openModalId,
    isEditing,
    columns,
    isOpen,
    control,
    handleSubmit,
    getValues,
    onOpen,
    onOpenChange,
    setIsEditing,
  } = useTable({
    username: userName || "",
    user_id: userId || "",
  });

  const { onCreate, onDelete, onUpdate } = useWorkspace(
    userName || "",
    userId || ""
  );

  const goToOffice = (workspace_id: string) => {
    router.push(`/${workspace_id}`);
    localStorage.setItem("workspace_id", workspace_id);
  };

  const onCreateNewWorkspace = () => {
    setValue("title", "");
    setValue("description", "");
    onOpen();
    setIsEditing(false);
  };

  return (
    <Layout loading={loading || workspacesLoading}>
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
      </main>
    </Layout>
  );
}
