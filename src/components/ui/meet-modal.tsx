import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // @ts-ignore
} from "@nextui-org/react";
// @ts-ignore
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// @ts-ignore
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
      style={{ marginBottom: 300 }}
    >
      <Button onClick={onOpen}>Create</Button>
      <CustomModalContent>
        {(onClose: any) => (
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
                  render={({ field }: any) => (
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
              </form>
            </ModalBody>
            <RightAlignedFooter>
              <Button
                color="warning"
                // @ts-ignore
                variant="ghost"
                onClick={() => {
                  onCreate();
                  onClose();
                }}
              >
                Create
              </Button>
            </RightAlignedFooter>
          </>
        )}
      </CustomModalContent>
    </Modal>
  );
}

export default MeetModal;
