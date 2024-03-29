"use client";
import React from "react";
import Layout from "@/components/layout";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

const GET_ROOM_ASSETS = gql`
  query RoomAssetsCollection($recording_id: String!) {
    room_assetsCollection(filter: { recording_id: { eq: $recording_id } }) {
      edges {
        node {
          id
          title
          summary_short
          transcription
          recording_id
        }
      }
    }
  }
`;

const RecordingPage = () => {
  const router = useRouter();
  const { recording_id } = router.query;

  const { loading, error, data } = useQuery(GET_ROOM_ASSETS, {
    variables: { recording_id },
  });

  const asset = data?.room_assetsCollection?.edges[0]?.node;
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
      <Layout loading={loading}>
        {!loading && data && (
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
              </div>
            </TracingBeam>
          </div>
        )}
      </Layout>
    </>
  );
};

export default RecordingPage;
