"use client";
import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/utils/cn";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler, FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import { ButtonAnimate } from "./button-animate";

export function SignupFormDemo({
  first_name,
  last_name,
  designation,
  position,
  company,
  logout,
  onSubmit,
}: {
  first_name: string;
  last_name: string;
  designation: string;
  position: string;
  company: string;
  logout: () => void;
  onSubmit: (data: FieldValues) => void;
}) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      designation: designation,
      position: position,
      company: company,
    },
  });
  const watchedDesignation = watch("designation", designation);
  const watchedFirstName = watch("first_name", first_name);
  const watchedLastName = watch("last_name", last_name);
  const watchedCompany = watch("company", company);
  const watchedPosition = watch("position", position);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("Watch update:", value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitDesctination: SubmitHandler<FieldValues> = (
    data: FieldValues
  ) => {
    console.log(data, "onSubmitDesctination");
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent dark:bg-transparent">
      <form className="my-8" onSubmit={handleSubmit(onSubmitDesctination)}>
        {isEdit ? (
          <>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  type="text"
                  defaultValue=""
                  value={watchedFirstName}
                  onChange={(e) => setValue("first_name", e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  type="text"
                  defaultValue=""
                  value={watchedLastName}
                  onChange={(e) => setValue("last_name", e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer>
              <Label htmlFor="last_name">Company</Label>
              <Input
                id="company"
                type="text"
                defaultValue=""
                value={watchedCompany}
                onChange={(e) => setValue("company", e.target.value)}
              />
            </LabelInputContainer>
            <div style={{ padding: "10px" }} />
            <LabelInputContainer>
              <Label htmlFor="last_name">Position</Label>
              <Input
                id="position"
                type="text"
                defaultValue=""
                value={watchedPosition}
                onChange={(e) => setValue("position", e.target.value)}
              />
            </LabelInputContainer>
            <div style={{ padding: "15px" }} />
            <Textarea
              defaultValue=""
              value={watchedDesignation}
              className="min-h-[100px] flex-1 p-4 md:min-h-[300px] lg:min-h-[300px]"
              onChange={(e) => setValue("designation", e.target.value)}
            />
            <div style={{ padding: "15px" }} />

            <ButtonAnimate
              onClick={() => setTimeout(() => setIsEdit(false), 1000)}
            >
              Save
            </ButtonAnimate>
          </>
        ) : (
          <div className="ounded-md border border-input bg-transparent px-6 py-6 rounded-md">
            <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
              {first_name} {last_name}
            </h2>
            <p className="text-neutral-600 text-xl max-w-full mt-2 dark:text-yellow-300">
              {company}
            </p>
            <p className="text-neutral-600 text-xl max-w-full mt-2 dark:text-cyan-300">
              {position}
            </p>

            <p className="text-neutral-600 text-md max-w-full mt-2 dark:text-neutral-300">
              {designation}
              {/* {designation.split("\n").map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))} */}
            </p>
            <div style={{ padding: "15px" }} />
            <ButtonAnimate onClick={() => setIsEdit(true)}>Edit</ButtonAnimate>
            <div style={{ padding: "10px" }} />
            <ButtonAnimate onClick={logout}>Logout</ButtonAnimate>
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
