"use client";
import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
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
import { AnimatedTooltipCommon } from "./animated-tooltip-common";
import { AssigneeArray } from "@/types";
import { usePassport } from "@/hooks/usePassport";

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
}) {
  const router = useRouter();
  const watchedTitle = watchTask("title", title);
  const watchedDescription = watchTask("description", description);
  const watchedPriority = watchTask("priority", priority);
  const watchedStatus = watchTask("status", status);
  const watchedCost = watchTask("cost", cost);
  const watchedPublic = watchTask("is_public", is_public);

  const isEdit = useReactiveVar(setIsEdit);
  const { user_id: owner_user_id } = useUser();
  const { onOpenModalPassport } = usePassport({});

  const isOwnerTask = owner_user_id === user_id;

  useEffect(() => {
    const subscription = watchTask((value, { name, type }) => {
      console.log("Watch update:", value, name);
    });
    return () => subscription.unsubscribe();
  }, [watchTask]);

  const onSubmitDestination: SubmitHandler<FieldValues> = (
    data: FieldValues
  ) => {
    onUpdateTask(id);
  };

  const assigneeData: AssigneeArray[] = [
    {
      node: {
        user_id: "ffefa06b-aee1-40c4-ad9e-d765b9925ef6",
        username: "playom",
        photo_url:
          "https://t.me/i/userpic/320/wZkuwwzkJSSWfV8E14wTQWqKz2SewAT5xNyHL2YbD5k.jpg",
      },
    },
    {
      node: {
        user_id: "ec0c948a-2b96-4ccd-942f-0a991d78a94f",
        username: "koshey999nft",
        photo_url:
          "https://t.me/i/userpic/320/tR0QjJduOxMDGPYL3G5eItFtmnJq4LRa1WPzaQwiBbg.jpg",
      },
    },
    {
      node: {
        user_id: "d1b1080c-d3b5-4108-a77b-404177f7f396",
        username: "reactotron",
        photo_url:
          "https://t.me/i/userpic/320/_vxoj_n4Oe7NSlsleXSnJaSPc7FPd-RCcVpUA-FlSyA.jpg",
      },
    },
  ];

  const onDeleteAssignee = () => {
    console.log("onDeleteAssignee");
  };

  const handleClickPlus = () => {
    console.log("handleClickPlus");
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
                  defaultValue=""
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
                  defaultValue=""
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
            <AnimatedTooltipCommon
              assigneeItems={assigneeData}
              onAssigneeClick={onDeleteAssignee}
              handleClickPlus={handleClickPlus}
            />
            <div style={{ padding: "10px" }} />
            <ButtonAnimate
              onClick={() => {
                setTimeout(() => setIsEdit(false), 1000);
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
              <ButtonAnimate onClick={() => setIsEdit(true)}>
                Edit
              </ButtonAnimate>
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
