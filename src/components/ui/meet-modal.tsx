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

const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                variant="ghost"
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
