import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import MeetModal from "@/components/ui/meet-modal";
import { useDisclosure } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import { createRoom } from "@/utils/edge-functions";
import { SelectRoom } from "@/components/ui/select-room";

const CreateRoom = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [openModalId, setOpenModalId] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const onCreateMeet = async () => {
    setLoading(true);
    const formData = getValues();
    try {
      const response = await createRoom(formData.name, openModalId);
      console.log("🚀 ~ onCreateMeet ~ response:", response);
      if (response) {
        localStorage.setItem("name", response.name);
        localStorage.setItem("room_id", response.room_id);
        setLoading(false);

        toast({
          title: "Success",
          description: `${response.name} created`,
        });
        router.back();
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
    <Layout loading={loading}>
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
      </>
    </Layout>
  );
};

export default CreateRoom;
