"use client";
import React from "react";
import Layout from "@/components/layout";

import { useRouter } from "next/router";

import { useTasks } from "@/hooks/useTasks";

import { TaskForm } from "@/components/ui/task-form";

const TaskPage = () => {
  const router = useRouter();
  const { task_id } = router.query;

  const {
    tasksData,
    tasksLoading,
    onUpdateTask,
    handleSubmitTask,
    watchTask,
    setValueTask,
  } = useTasks({
    task_id: task_id as string,
  });

  return (
    <>
      <Layout loading={tasksLoading}>
        {!tasksLoading &&
          tasksData.map(({ node }) => {
            console.log(node.priority, "node.priority");
            return (
              <TaskForm
                key={node.id}
                id={node.id}
                title={node.title}
                description={node.description}
                priority={node.priority || "low"}
                status={node.status || "todo"}
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
