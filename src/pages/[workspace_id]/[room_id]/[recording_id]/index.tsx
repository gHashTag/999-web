"use client";
import React from "react";
import Layout from "@/components/layout";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "@/pages/_app";
import { useTable } from "@/hooks/useTable";
import { GET_ROOM_ASSETS } from "@/graphql/query";

const RecordingPage = () => {
  const router = useRouter();
  const { recording_id } = router.query;

  const {
    loading: assetsLoading,
    error,
    data: assetsData,
  } = useQuery(GET_ROOM_ASSETS, {
    variables: { recording_id },
  });

  const asset = assetsData?.room_assetsCollection?.edges[0]?.node;

  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");

  const workspace_id = localStorage.getItem("workspace_id");
  const room_id = localStorage.getItem("room_id");

  const userName = __DEV__ ? "koshey999nft" : username;

  const workspaceId = __DEV__
    ? "54dc9d0e-dd96-43e7-bf72-02c2807f8977"
    : workspace_id;

  const roomId = __DEV__ ? "6601894fe4bed726368e290b" : room_id;

  const recordingIdString = router.query.recording_id as string;

  const { loading, data, columns } = useTable({
    username: userName || "",
    user_id: user_id || "",
    workspace_id: workspaceId || "",
    room_id: roomId || "",
    recording_id: recordingIdString || "",
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
      <Layout loading={loading || assetsLoading}>
        {!loading && assetsData && (
          <div
            className="flex-col mt-10"
            style={{
              paddingRight: 20,
              paddingLeft: 20,
              paddingBottom: 70,
            }}
          >
            <TracingBeam className="px-6">
              <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                <div className="mb-10">
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
                {data && (
                  <DataTable
                    data={data.tasksCollection.edges}
                    columns={columns}
                  />
                )}
              </div>
            </TracingBeam>
          </div>
        )}
      </Layout>
    </>
  );
};

export default RecordingPage;
