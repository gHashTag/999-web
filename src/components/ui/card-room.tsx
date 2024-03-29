import { forwardRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/types";
import { BackgroundGradient } from "./background-gradient";

import { Spacer } from "@nextui-org/react";

interface CardProps {
  node: {
    id: string;
    title: string;
    description: string;
  };
  onClick?: () => void;
}

const CardRoom = forwardRef<HTMLDivElement, CardProps>(({ node, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <BackgroundGradient className="rounded-[222px] sm:p-1">
        <div className="bg-stone-950 rounded-[17px]">
          <div
            className="text-2xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"
            style={{ paddingTop: 10, paddingLeft: 10, textAlign: "center" }}
          >
            {node?.title}
          </div>
          <div>
            <div
              className="text-1xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
              style={{
                padding: 10,
                paddingBottom: 10,
                color: "rgb(87 83 78)",
                textAlign: "center",
              }}
            >
              {node?.description}
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Spacer x={40} />
      <div id={node?.id.toString()} />
    </div>
  );
});

CardRoom.displayName = "CardRoom";

export default CardRoom;
