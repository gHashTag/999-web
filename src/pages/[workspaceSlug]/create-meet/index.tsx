import { useState } from "react";
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
import { CURRENT_USER, ROOMS_COLLECTION_QUERY } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { CardRoomT } from "@/types";
import CardRoom from "@/components/ui/card-room";

const MeetsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: userInfo } = useQuery(CURRENT_USER);
  const {
    data: roomsData,
    loading: roomsLoading,
    refetch,
  } = useQuery(ROOMS_COLLECTION_QUERY, {
    variables: {
      user_id: userInfo?.user_id,
    },
  });

  const [loading, setLoading] = useState(false);
  const [openModalId, setOpenModalId] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const onCreateMeet = async () => {
    setLoading(true);
    const formData = getValues();
    console.log(formData, "formData");
    const lang = navigator.language.substring(0, 2);
    console.log(lang);
    try {
      const response = await createRoom(
        formData.name,
        openModalId,
        formData.token,
        formData.chat_id,
        lang
      );

      if (response) {
        toast({
          title: "Success",
          description: `${response.rooms.name} created`,
        });
        router.push(`/workspaceSlug/create-meet/${response.rooms.room_id}`);
        setLoading(false);
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

  return (
    <Layout loading={loading || roomsLoading}>
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
                router.push(`/workspaceSlug/create-meet/${room.node.room_id}`)
              }
              key={room.node.id}
            />
          ))}
        </div>
      </>
    </Layout>
  );
};

export default MeetsPage;
