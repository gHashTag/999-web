import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// @ts-ignore
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import MeetModal from "@/components/ui/meet-modal";
// @ts-ignore
import { useDisclosure } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import { createRoom } from "@/utils/edge-functions";
import { SelectRoom } from "@/components/ui/select-room";
import { ROOMS_COLLECTION_QUERY } from "@/graphql/query";
import { useQuery, useReactiveVar } from "@apollo/client";
import { CardRoomT } from "@/types";
import CardRoom from "@/components/ui/card-room";
import { DataTable } from "@/components/table/data-table";
import { __DEV__ } from "../_app";
import { useTable } from "@/hooks/useTable";
import { setLoading } from "@/apollo/reactive-store";

const MeetsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const loading = useReactiveVar(setLoading);
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");
  // const { data: userInfo } = useQuery(CURRENT_USER);
  // console.log(userInfo, "userInfo");

  const workspace_id = router.query.workspace_id as string;

  const userName = __DEV__ ? "koshey999nft" : username;
  const userId = __DEV__ ? "ec0c948a-2b96-4ccd-942f-0a991d78a94f" : user_id;

  const {
    loading: tableLoading,
    data,
    columns,
  } = useTable({
    username: userName || "",
    user_id: userId || "",
    workspace_id,
  });
  console.log(username, "username");
  console.log(user_id, "user_id");
  console.log(workspace_id, "workspace_id");

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch,
  } = useQuery(ROOMS_COLLECTION_QUERY, {
    variables: {
      workspace_id,
    },
  });

  useEffect(() => {
    if (!username) {
      router.push("/");
    }
    refetch();
  }, [refetch, router, username]);

  const [openModalId, setOpenModalId] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const onCreateMeet = async () => {
    setLoading(true);
    const formData = getValues();

    const lang = navigator.language.substring(0, 2);

    try {
      if (username && user_id) {
        const response = await createRoom({
          user_id,
          username,
          workspace_id,
          name: formData.name,
          type: openModalId,
          token: formData.token,
          chat_id: formData.chat_id,
          lang,
        });

        if (response) {
          toast({
            title: "Success",
            description: `${response.rooms.name} created`,
          });
          router.push(`/workspace_id/${response.rooms.room_id}`);
          setLoading(false);
        }
      } else {
        console.log("Username not a found");
      }
    } catch (error) {
      if (error) {
        toast({
          title: "Error creating room",
          variant: "destructive",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        reset({
          title: "",
        });
      }
    }
  };

  const setOpenModalType = async (type: string) => {
    onOpen();
    setOpenModalId(type);
  };
  // console.log(roomsData, "roomsData");
  return (
    <Layout loading={loading || roomsLoading || tableLoading}>
      <>
        {isOpen && (
          <MeetModal
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            onCreate={onCreateMeet}
            control={control}
            handleSubmit={handleSubmit}
            getValues={getValues}
            setValue={setValue}
          />
        )}
        <SelectRoom setOpenModalType={setOpenModalType} />
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-1"
          style={{ padding: 20 }}
        >
          {roomsData?.roomsCollection.edges.map((room: CardRoomT) => (
            <CardRoom
              node={{
                id: room.node.id,
                title: room.node.name,
                description: room.node.type,
              }}
              onClick={() =>
                router.push(`/${workspace_id}/${room.node.room_id}`)
              }
              key={room.node.id}
            />
          ))}
          {/* https://a46ffbba421b.ngrok.app/d696abd8-3b7a-46f2-907f-5342a2b533a0/6617f3b8f22c5c6a76021925
          https://a46ffbba421b.ngrok.app/d696abd8-3b7a-46f2-907f-5342a2b533a0/6617f31ff22c5c6a76021913 */}
        </div>
        <div
          style={{
            padding: 20,
            paddingTop: 50,
            paddingBottom: 200,
          }}
        >
          {data && (
            <DataTable data={data.tasksCollection.edges} columns={columns} />
          )}
        </div>
      </>
    </Layout>
  );
};

export default MeetsPage;
