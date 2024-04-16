"use client";
import React from "react";
import Layout from "@/components/layout";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/pages/_app";
import { Button } from "@/components/ui/moving-border";
import { GET_ROOM_ASSETS } from "@/graphql/query";

import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/hooks/useUser";

const TaskPage = () => {
  const router = useRouter();
  const { task_id } = router.query;

  const { workspace_id, room_id } = useUser();

  const { tasksData, tasksLoading, columns, onCreateNewTask } = useTasks({
    task_id,
  });

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
      <Layout loading={tasksLoading}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "70px",
          }}
        ></div>
        Task: {task_id}
        <div style={{ padding: "100px" }} />
      </Layout>
    </>
  );
};

export default TaskPage;
