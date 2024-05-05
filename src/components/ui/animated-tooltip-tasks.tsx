"use client";
import Image from "next/image";
import React from "react";
import { useMotionValue } from "framer-motion";
import { Passport } from "@/types";

type AnimatedTooltipTasksProps = {
  assigneeItems?: Passport[];
  onClick: (item: Passport) => void;
  handleClickPlus: () => void;
  isVisiblePlus?: boolean;
  isRoom?: boolean;
};

export const AnimatedTooltipTasks = ({
  assigneeItems,
  onClick,
  handleClickPlus,
  isVisiblePlus = true,
}: AnimatedTooltipTasksProps) => {
  const x = useMotionValue(0);
  console.log(assigneeItems, "assigneeItems");
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const handleClick = (item: Passport) => {
    console.log(item, "item");
    onClick(item);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        className="-mr-4 relative group rounded-full"
        style={{
          right: 8,
        }}
        onClick={() => handleClickPlus()}
      >
        {isVisiblePlus && (
          <img src="/icon-plus.svg" height={50} width={50} alt="plus" />
        )}
      </div>
      {assigneeItems &&
        assigneeItems.map((item: Passport) => (
          <div
            className="-mr-4 relative group rounded-full"
            key={item.node.photo_url}
            onClick={() => handleClick(item)}
          >
            <Image
              onMouseMove={handleMouseMove}
              height={50}
              width={50}
              src={item.node.photo_url || ""}
              alt="avatar"
              className="object-cover !m-0 !p-0 object-top rounded-full border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
            />
          </div>
        ))}
    </div>
  );
};
