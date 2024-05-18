"use client";
import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
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
  } = useTasks();
  const router = useRouter();
  const { task_id } = router.query as { task_id: string };

  useEffect(() => {
    localStorage.setItem("is_owner", "false");
  }, [router]);

  return (
    <>
      <Layout loading={tasksLoading}>
        {tasksData &&
          tasksData
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
                  // assigned_to={node.assigned_to}
                />
              );
            })}

        <div style={{ padding: "100px" }} />
      </Layout>
    </>
  );
};

export default TaskPage;
