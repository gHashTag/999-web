"use client";
import Image from "next/image";
import React from "react";
import { useMotionValue } from "framer-motion";
import { PassportArray, AssigneeArray } from "@/types";

type AnimatedTooltipCommonProps = {
  passportItems?: PassportArray;
  assigneeItems?: AssigneeArray[];
  onAssigneeClick?: (user_id: string) => void;
  onClick?: (passport_id: number) => void;
  handleClickPlus: () => void;
};

export const AnimatedTooltipCommon = ({
  passportItems,
  assigneeItems,
  onClick,
  onAssigneeClick,
  handleClickPlus,
}: AnimatedTooltipCommonProps) => {
  const x = useMotionValue(0);

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const handleClick = (item: any) => {
    onAssigneeClick
      ? onAssigneeClick(item.node.user_id)
      : onClick && onClick(item.node.passport_id);
  };

  const items = passportItems || assigneeItems;

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
        <img src="/icon-plus.svg" height={50} width={50} alt="plus" />
      </div>
      {items &&
        items.map((item, idx) => (
          <div
            className="-mr-4 relative group rounded-full"
            key={item.node.user_id}
            onClick={() => handleClick(item)}
          >
            <Image
              onMouseMove={handleMouseMove}
              height={50}
              width={50}
              src={item.node.photo_url}
              alt={item.node.username}
              className="object-cover !m-0 !p-0 object-top rounded-full border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
            />
          </div>
        ))}
    </div>
  );
};
