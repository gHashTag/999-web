import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styled from "styled-components";

type Modal = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onCreate: () => void;
  control: any;
  handleSubmit: any;
  getValues: any;
  setValue: any;
};

const RightAlignedFooter = styled(ModalFooter)`
  display: flex;
  justify-content: flex-end;
`;

const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-radius: 15px;
`;

function MeetModal({
  isOpen,
  onOpen,
  onOpenChange,
  control,
  handleSubmit,
  setValue,
  onCreate,
}: Modal) {
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
              <span>Create</span>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onCreate)}>
                <Label htmlFor="text">Title</Label>
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
                <Label htmlFor="text">Telegram bot token</Label>
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
                <Label htmlFor="text">Telegram chat id</Label>
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                onClick={() => {
                  onCreate();
                  onClose();
                }}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </CustomModalContent>
    </Modal>
  );
}

export default MeetModal;
