// TaskModal.js

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
import { cn } from "@/utils/cn";
import { InputMultiline } from "../ui/input-multiline";

type Modal = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  isEditing: boolean;
  card: any;
  control: any;
  handleSubmit: any;
  getValues: any;
  setValue: any;
};

const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
`;

function TaskModal({
  isOpen,
  onOpen,
  onOpenChange,
  onCreate,
  onUpdate,
  onDelete,
  control,
  handleSubmit,
  setValue,
  isEditing,
  card,
}: Modal) {
  // console.log(isOpen, "isOpen");
  // console.log(card?.title, "card?.title");
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button onClick={onOpen}>
        {isEditing ? "Edit Task" : "Create Task"}
      </Button>
      <CustomModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <span>{isEditing ? "Edit task" : "Create task"}</span>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(isEditing ? onUpdate : onCreate)}>
                <Label htmlFor="text">Title</Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter your title"
                      className="w-full h-15"
                      {...field}
                      onChange={(e) => {
                        setValue("title", e.target.value);
                      }}
                    />
                  )}
                />
                <div style={{ padding: 10 }} />

                <Label htmlFor="text">Description</Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <InputMultiline
                      placeholder="Enter your description"
                      {...field}
                      onChange={(e) => {
                        setValue("description", e.target.value);
                      }}
                    />
                  )}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              {isEditing && (
                <Button color="warning" variant="ghost" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button
                color="warning"
                variant="ghost"
                onClick={() => {
                  isEditing ? onUpdate() : onCreate();
                  onClose();
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

export default TaskModal;
{
  /* <Modal
isOpen={openModalId === card.node.id}
onOpenChange={closeModal}
>
<CustomModalContent>
  <ModalHeader>
    <span>Edit task</span>
  </ModalHeader>
  <ModalBody>
    <form onSubmit={handleSubmit(onUpdate)}>
      <Label htmlFor="text">Title</Label>
      <div style={{ padding: 5 }} />
      <Controller
        name="title"
        control={control}
        defaultValue={card.node.title}
        render={({ field }) => (
          <Input
            placeholder="Enter your title"
            className="w-full h-15"
            {...field}
            onChange={(e) => {
              setValue("title", e.target.value);
            }}
          />
        )}
      />
      <div style={{ padding: 10 }} />

      <Label htmlFor="text">Description</Label>
      <div style={{ padding: 5 }} />
      <Controller
        name="description"
        control={control}
        defaultValue={card.node.description}
        render={({ field }) => (
          <Input
            placeholder="Enter your description"
            className="w-full"
            {...field}
            onChange={(e) => {
              setValue("description", e.target.value);
            }}
          />
        )}
      />
    </form>
  </ModalBody>
  <ModalFooter>
    <Button color="warning" variant="ghost" onClick={onDelete}>
      Delete
    </Button>
    <Button color="warning" variant="ghost" onClick={onUpdate}>
      Save
    </Button>
  </ModalFooter>
</CustomModalContent>
</Modal> */
}
