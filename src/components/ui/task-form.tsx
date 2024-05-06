"use client";
import { Fragment, useEffect } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import {
  SubmitHandler,
  FieldValues,
  UseFormHandleSubmit,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonAnimate } from "./button-animate";
import { priorities, statuses } from "@/helpers/data/data";
import { useReactiveVar } from "@apollo/client";
import { setIsEdit } from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";
import { AnimatedTooltipTasks } from "./animated-tooltip-tasks";
import { usePassport } from "@/hooks/usePassport";
import InviteMemberModal from "../modal/InviteMemberModal";
import { AssignedTo, Passport } from "@/types";

export function TaskForm({
  id,
  title,
  description,
  priority,
  status,
  cost,
  is_public,
  handleSubmitTask,
  watchTask,
  setValueTask,
  onUpdateTask,
  user_id,
  assigned_to,
}: {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  cost: number;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  handleSubmitTask: UseFormHandleSubmit<FieldValues>;
  watchTask: UseFormWatch<FieldValues>;
  setValueTask: UseFormSetValue<FieldValues>;
  onUpdateTask: (id: number) => void;
  user_id: string;
  assigned_to: string;
}) {
  const router = useRouter();
  const task_id: number = Number(router.query.task_id as string);
  const assignedTo = JSON.parse(assigned_to);
  const watchedTitle = watchTask("title", title);
  const watchedDescription = watchTask("description", description);
  const watchedPriority = watchTask("priority", priority);
  const watchedStatus = watchTask("status", status);
  const watchedCost = watchTask("cost", cost);
  const watchedPublic = watchTask("is_public", is_public);

  const isEdit = useReactiveVar(setIsEdit);
  const { user_id: owner_user_id, workspace_id, room_id } = useUser();

  const isOwnerTask = owner_user_id === user_id;

  useEffect(() => {
    localStorage.setItem("is_owner", "false");
    const subscription = watchTask((value, { name, type }) => {
      console.log("Watch update:", value, name);
    });
    return () => subscription.unsubscribe();
  }, [watchTask]);

  const {
    passportData,
    passportLoading,
    passportError,
    isOpenModalPassport,
    onOpenModalPassport,
    onOpenChangeModalPassport,
    onCreatePassport,
    onDeletePassportTask,
    onUpdatePassport,
    setValuePassport,
    controlPassport,
    handleSubmitPassport,
    getValuesPassport,
    openModalPassportId,
    isEditingPassport,
  } = usePassport({
    workspace_id,
    room_id,
    task_id: Number(task_id) as number,
    type: "task",
    assigned_to: assignedTo,
  });

  const onSubmitDestination: SubmitHandler<FieldValues> = (
    data: FieldValues
  ) => {
    onUpdateTask(id);
  };

  const onDeleteAssignee = ({ node }: Passport) => {
    node.passport_id &&
      node.user_id &&
      onDeletePassportTask(node.passport_id, node.user_id);
  };

  const handleClickPlus = async () => {
    onOpenModalPassport();
  };

  return (
    <div className="max-w-2xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent dark:bg-transparent">
      <form className="my-8" onSubmit={handleSubmitTask(onSubmitDestination)}>
        {isEdit ? (
          <div className="ounded-md border border-input bg-transparent px-6 py-6 rounded-md">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={watchedTitle}
                  onChange={(e) => setValueTask("title", e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={watchedDescription}
                  onChange={(e) => setValueTask("description", e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <div style={{ padding: "5px" }} />
            <div
              className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4"
              style={{ justifyContent: "space-between" }}
            >
              <Select
                onValueChange={(value) => setValueTask("priority", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={watchedPriority} />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(({ value }) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id="public-task"
                  checked={watchedPublic}
                  onCheckedChange={() =>
                    setValueTask("is_public", !watchedPublic)
                  }
                />
                <Label htmlFor="public-task">Public</Label>
              </div>

              <Select onValueChange={(value) => setValueTask("status", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={watchedStatus} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(({ value }) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {watchedPublic && (
              <LabelInputContainer>
                <Label htmlFor="cost">Cost, TON</Label>
                <Input
                  id="cost"
                  type="text"
                  defaultValue="0"
                  value={watchedCost}
                  onChange={(e) => setValueTask("cost", e.target.value)}
                />
              </LabelInputContainer>
            )}
            <AnimatedTooltipTasks
              assigneeItems={passportData}
              onClick={onDeleteAssignee}
              handleClickPlus={handleClickPlus}
            />
            {isOpenModalPassport && (
              <InviteMemberModal
                isOpen={isOpenModalPassport}
                onOpen={onOpenModalPassport}
                onOpenChange={onOpenChangeModalPassport}
                onCreate={onCreatePassport}
                onDelete={() =>
                  openModalPassportId &&
                  onDeletePassportTask(openModalPassportId, user_id)
                }
                onUpdate={onUpdatePassport}
                control={controlPassport}
                handleSubmit={handleSubmitPassport}
                getValues={getValuesPassport}
                setValue={setValuePassport}
                isEditing={isEditingPassport}
                type="task"
              />
            )}
            <div style={{ padding: "10px" }} />
            <ButtonAnimate
              onClick={() => {
                setTimeout(() => setIsEdit(isEdit), 1000);
                router.back();
              }}
            >
              Save
            </ButtonAnimate>
          </div>
        ) : (
          <div className="ounded-md border border-input bg-transparent px-6 py-6 rounded-md">
            <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
              {title}
            </h2>

            <p className="text-neutral-600 text-md max-w-full mt-2 dark:text-neutral-300">
              {description &&
                description.split("\n").map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
            </p>
            <div style={{ padding: "5px" }} />
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <Badge variant="outline">{priority}</Badge>
              <Badge variant="outline">{status}</Badge>
            </div>

            {isOwnerTask && (
              <>
                <AnimatedTooltipTasks
                  assigneeItems={passportData}
                  onClick={onDeleteAssignee}
                  handleClickPlus={handleClickPlus}
                />
                <div style={{ padding: "10px" }} />
                <ButtonAnimate onClick={() => setIsEdit(true)}>
                  Edit
                </ButtonAnimate>
              </>
            )}
            {/* 
            <ButtonAnimate onClick={logout}>Logout</ButtonAnimate> */}
          </div>
        )}
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
