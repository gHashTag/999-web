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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WorkspaceModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  isEditing: boolean;
  control: any;
  handleSubmit: any;
  getValues: any;
  setValue: any;
};

const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
`;

function WorkspaceModal({
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
}: WorkspaceModalType) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button onClick={onOpen}>
        {isEditing ? "Edit Workspace" : "Create Workspace"}
      </Button>
      <CustomModalContent>
        {(onClose: any) => (
          <>
            <ModalHeader>
              <span>{isEditing ? "Edit Workspace" : "Create Workspace"}</span>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(isEditing ? onUpdate : onCreate)}>
                <Label htmlFor="text">Title</Label>
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

                <Label htmlFor="text">Description</Label>
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
              </form>
            </ModalBody>
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent
                onClick={() => {
                  console.log("click");
                }}
              >
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select> */}
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

export default WorkspaceModal;
