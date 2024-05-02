"use client";
import Image from "next/image";
import React from "react";
import { useMotionValue } from "framer-motion";
import { PassportArray } from "@/types";

type AnimatedTooltipCommonProps = {
  items: PassportArray;
  onClick: (passport_id: number) => void;
};

export const AnimatedTooltipCommon = ({
  items,
  onClick,
}: AnimatedTooltipCommonProps) => {
  const x = useMotionValue(0);

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
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
      {items &&
        items.map((item, idx) => (
          <div
            className="-mr-4 relative group rounded-full"
            key={item.node.user_id}
            onClick={() => {
              onClick(item.node.passport_id);
            }}
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
