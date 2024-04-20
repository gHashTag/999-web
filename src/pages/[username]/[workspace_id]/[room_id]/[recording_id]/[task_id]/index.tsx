"use client";
import React from "react";
import Layout from "@/components/layout";

import { useTasks } from "@/hooks/useTasks";

import { TaskForm } from "@/components/ui/task-form";

const TaskPage = () => {
  const {
    tasksData,
    tasksLoading,
    onUpdateTask,
    handleSubmitTask,
    watchTask,
    setValueTask,
  } = useTasks({});

  return (
    <>
      <Layout loading={tasksLoading}>
        {!tasksLoading &&
          tasksData.map(({ node }) => {
            return (
              <TaskForm
                key={node.id}
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
