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
import { useUser } from "@/hooks/useUser";

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

function InviteMemberModal({
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
  const { user_id, workspace_id, room_id, recording_id } = useUser();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button onClick={onOpen}>{isEditing ? "Edit" : "Create"}</Button>
      <CustomModalContent>
        {(onClose: any) => (
          <>
            <ModalHeader>
              <span>{isEditing ? "Edit" : "Invite Member"}</span>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(isEditing ? onUpdate : onCreate)}>
                <Label htmlFor="text">username</Label>
                <div style={{ padding: 5 }} />
                <Controller
                  name="username"
                  control={control}
                  render={({ field }: any) => (
                    <Input
                      placeholder="Enter username"
                      className="w-full h-15"
                      {...field}
                      onChange={(e) => {
                        setValue("username", e.target.value);
                        setValue("user_id", user_id);
                        setValue("workspace_id", workspace_id);
                        setValue("room_id", room_id);
                        setValue("recording_id", recording_id);
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
                {isEditing ? "Save" : "Invite"}
              </Button>
            </ModalFooter>
          </>
        )}
      </CustomModalContent>
    </Modal>
  );
}

export default InviteMemberModal;
