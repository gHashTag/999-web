"use client";
import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/utils/cn";

import {
  SubmitHandler,
  FieldValues,
  UseFormHandleSubmit,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

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

export function TaskForm({
  id,
  title,
  description,
  priority,
  status,
  handleSubmitTask,
  watchTask,
  setValueTask,
  onUpdateTask,
}: {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  handleSubmitTask: UseFormHandleSubmit<FieldValues>;
  watchTask: UseFormWatch<FieldValues>;
  setValueTask: UseFormSetValue<FieldValues>;
  onUpdateTask: (id: number) => void;
}) {
  const watchedTitle = watchTask("title", title);
  const watchedDescription = watchTask("description", description);
  const watchedPriority = watchTask("priority", priority);
  const watchedStatus = watchTask("status", status);

  const [isEdit, setIsEdit] = useState(false);

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
                    <SelectItem value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setValueTask("status", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={watchedStatus} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(({ value }) => (
                    <SelectItem value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ButtonAnimate
              onClick={() => setTimeout(() => setIsEdit(false), 1000)}
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

            <ButtonAnimate onClick={() => setIsEdit(true)}>Edit</ButtonAnimate>
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
