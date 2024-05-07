// TaskModal.js

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  //@ts-ignore
} from "@nextui-org/react";
//@ts-ignore
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
//@ts-ignore
import styled from "styled-components";
import { cn } from "@/utils/cn";
import { InputMultiline } from "../ui/input-multiline";
import { useReactiveVar } from "@apollo/client";
import { setEditTask } from "@/apollo/reactive-store";

type Modal = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  control: any;
  handleSubmit: any;
  getValues: any;
  setValue: any;
};

const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-radius: 15px;
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
}: Modal) {
  const isEditingTask = useReactiveVar(setEditTask);
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button onClick={onOpen}>
        {isEditingTask ? "Edit Task" : "Create Task"}
      </Button>
      <CustomModalContent>
        {(onClose: any) => (
          <>
            <ModalHeader>
              <span>{isEditingTask ? "Edit task" : "Create task"}</span>
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(isEditingTask ? onUpdate : onCreate)}
              >
                <Label htmlFor="text" style={{ paddingLeft: 5 }}>
                  Title
                </Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }: any) => (
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

                <Label htmlFor="text" style={{ paddingLeft: 5 }}>
                  Description
                </Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }: any) => (
                    <InputMultiline
                      placeholder="Enter your description"
                      {...field}
                      onChange={(e) => {
                        setValue("description", e.target.value);
                      }}
                    />
                  )}
                />
                <div style={{ padding: 10 }} />
                <Label htmlFor="text" style={{ paddingLeft: 5 }}>
                  Label
                </Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="label"
                  control={control}
                  render={({ field }: any) => (
                    <Input
                      placeholder="Enter your label"
                      className="w-full h-15"
                      {...field}
                      onChange={(e) => {
                        setValue("label", e.target.value);
                      }}
                    />
                  )}
                />
                <div style={{ padding: 10 }} />
              </form>
            </ModalBody>

            <ModalFooter>
              {/* <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent onClick={(e) => e.stopPropagation()}>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select> */}
              {isEditingTask && (
                // @ts-ignore
                <Button color="warning" variant="ghost" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button
                color="warning"
                onClick={() => {
                  isEditingTask ? onUpdate() : onCreate();
                  onClose();
                }}
              >
                {isEditingTask ? "Save" : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </CustomModalContent>
    </Modal>
  );
}

export default TaskModal;
