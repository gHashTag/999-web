"use client";
import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useTasks } from "@/hooks/useTasks";

import { TaskForm } from "@/components/ui/task-form";
import { setHeaderName } from "@/apollo/reactive-store";

const TaskPage = () => {
  const {
    tasksData,
    tasksLoading,
    onUpdateTask,
    handleSubmitTask,
    watchTask,
    setValueTask,
  } = useTasks({});
  const router = useRouter();
  const { task_id } = router.query;

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
      </Layout>
    </>
  );
};

export default TaskPage;
