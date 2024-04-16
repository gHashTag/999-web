import { forwardRef } from "react";
import { BackgroundGradient } from "./background-gradient";

import { Spacer } from "@nextui-org/react";
import { RoomNode } from "@/types";

interface CardProps {
  room: RoomNode;
  onClick?: () => void;
}

const CardRoom = ({ room, onClick }: CardProps) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <BackgroundGradient className="rounded-[222px] sm:p-1">
        <div className="rounded-[17px]" style={{ backgroundColor: "#0c0a09" }}>
          <div
            className="text-2xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl font-semibold"
            style={{
              paddingTop: 30,
              paddingLeft: 10,
              paddingRight: 10,
              textAlign: "center",
            }}
          >
            {room?.name}
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
              {room?.type}
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Spacer x={40} />
    </div>
  );
};

CardRoom.displayName = "CardRoom";

export default CardRoom;
