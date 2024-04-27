"use client";
import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/pages/_app";
import { Button } from "@/components/ui/moving-border";

import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";
import TaskModal from "@/components/modal/TaskModal";
import { BreadcrumbWithCustomSeparator } from "@/components/ui/breadcrumb-with-custom-separator";
import { useAssets } from "@/hooks/useAssets";

const RecordingPage = () => {
  const router = useRouter();
  const { username, workspace_id, room_id, room_name } = useUser();
  const { recording_id } = router.query;

  const { assetLoading, assetData, asset, assetError } = useAssets();

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
    getValuesTask,
    onCreateNewTask,
    columns,
    openModalTaskId,
    setOpenModalTaskId,
    isEditingTask,
  } = useTasks();

  useEffect(() => {
    localStorage.setItem("recording_id", recording_id as string);
  }, [recording_id]);

  function HighlightName({ text }: { text: string }) {
    const [name, ...message] = text.split(":");
    const restOfMessage = message.join(":");

    return (
      <span>
        <strong className="text-yellow-500">{name}</strong>
        {restOfMessage}
      </span>
    );
  }
  return (
    <>
      <Layout loading={tasksLoading || assetLoading}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginRight: 20,
            paddingTop: 30,
            flexDirection: "column",
          }}
        >
          <BreadcrumbWithCustomSeparator
            username={username}
            workspace_id={workspace_id}
            room_id={room_id}
            record_id={recording_id as string}
            room_name={room_name}
          />
          <div style={{ padding: 15 }} />
        </div>
        {!tasksLoading && assetData && (
          <div className="flex-col mt-10">
            <TracingBeam className="px-6">
              <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                <div className="mb-1">
                  <p className={twMerge("text-4xl mb-4")}>{asset?.title}</p>
                  <p className={twMerge("text-xl mb-4")}>
                    {asset?.summary_short}
                  </p>

                  <div className="text-sm prose prose-sm dark:prose-invert">
                    {asset?.transcription
                      .split("\n")
                      .map((line: string, index: number) => (
                        <React.Fragment key={index}>
                          <HighlightName text={line} />
                          <br />
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            </TracingBeam>
          </div>
        )}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "70px",
          }}
        >
          <Button
            onClick={() =>
              onCreateNewTask(workspace_id, room_id, recording_id as string)
            }
          >
            Create task
          </Button>
        </div> */}
        {tasksData && <DataTable data={tasksData} columns={columns} />}
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
            getValues={getValuesTask}
            setValue={setValueTask}
            isEditing={isEditingTask}
          />
        )}
        <div style={{ padding: "100px" }} />
      </Layout>
    </>
  );
};

export default RecordingPage;
