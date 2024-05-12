import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import {
  Controller,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { RoomEdge, RoomNode } from "@/types";
import { FormValues } from "@/hooks/useRooms";

const RightAlignedFooter = styled(ModalFooter)`
  display: flex;
  justify-content: flex-end;
`;

const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-radius: 15px;
`;

type Modal = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  control: any;
  handleSubmit: any;
  setValue: any;
  isEditing: boolean;
  watchRoom: UseFormWatch<FormValues>;
  roomsItem?: RoomNode;
  getValues: () => FieldValues;
  registerRoom?: UseFormRegister<FormValues>;
};

function MeetModal({
  isOpen,
  onOpen,
  onOpenChange,
  control,
  handleSubmit,
  setValue,
  onCreate,
  onUpdate,
  onDelete,
  isEditing,
  watchRoom,
  roomsItem,
  getValues,
  registerRoom,
}: Modal) {
  const [error, setError] = useState("");

  const handleFormSubmit = (onClose: () => void) => {
    const data = getValues();
    console.log(data, "data");

    // Проверка на заполненность всех полей перед отправкой
    if (!data.name || !data.token || !data.chat_id) {
      setError("Please fill in all fields before submitting");
      return;
    } else {
      setError("");
      isEditing ? onUpdate() : onCreate();
      onClose();
    }
  };

  useEffect(() => {
    const subscription = watchRoom((value: any, { name, type }: any) => {
      console.log("Watch update:", value, name);
    });
    if (isEditing && roomsItem) {
      setValue("id", roomsItem.id);
      setValue("name", roomsItem.name);
      setValue("token", roomsItem.token);
      setValue("chat_id", roomsItem.chat_id);
    }
    return () => subscription.unsubscribe();
  }, [watchRoom]);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      style={{ marginBottom: 200 }}
    >
      <Button onClick={onOpen}>Create</Button>
      <CustomModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <span> {isEditing ? "Edit Meet" : "Create Meet"}</span>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(isEditing ? onUpdate : onCreate)}>
                <Label htmlFor="text" style={{ paddingLeft: 5 }}>
                  Title
                </Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter your title"
                      className="w-full h-15"
                      {...field}
                      onChange={(e) => {
                        setValue("name", e.target.value);
                      }}
                    />
                  )}
                />
                <div style={{ padding: 10 }} />
                <Label htmlFor="text" style={{ paddingLeft: 5 }}>
                  Telegram bot token
                </Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="token"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Here is the token for bot"
                      className="w-full h-15"
                      {...field}
                      onChange={(e) => {
                        setValue("token", e.target.value);
                      }}
                    />
                  )}
                />
                <div style={{ padding: 10 }} />
                <Label htmlFor="text" style={{ paddingLeft: 5 }}>
                  Telegram chat id
                </Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="chat_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Here is the chat id for bot"
                      className="w-full h-15"
                      {...field}
                      onChange={(e) => {
                        setValue("chat_id", e.target.value);
                      }}
                    />
                  )}
                />
              </form>
              {error && (
                <p style={{ paddingLeft: 5 }} className="text-sm text-red-500">
                  {error}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              {isEditing && (
                // @ts-ignore
                <Button color="warning" variant="ghost" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button
                color="warning"
                onClick={() => {
                  handleFormSubmit(onClose);
                }}
              >
                {isEditing ? "Save" : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </CustomModalContent>
    </Modal>
  );
}

export default MeetModal;
