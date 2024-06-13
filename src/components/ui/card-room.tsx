import { forwardRef } from "react";
import { BackgroundGradient } from "./background-gradient";

import { Spacer } from "@nextui-org/react";
import { RoomInfoT } from "@/types";

interface CardProps {
  room: RoomInfoT | undefined;
  room_id: string | undefined;
  username: string | undefined;
  is_owner?: boolean | undefined;
  onClick?: () => void;
}

const CardRoom = ({
  room,
  room_id,
  username,
  is_owner,
  onClick,
}: CardProps) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <BackgroundGradient className="rounded-[222px] sm:p-1">
        <div
          className="rounded-[17px]"
          style={{ backgroundColor: "var(--main-background)" }}
        >
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
                paddingBottom: 5,
                color: "rgb(87 83 78)",
                textAlign: "center",
              }}
            >
              {room?.type}
            </div>
            <div
              className="text-1xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
              style={{
                color: "rgb(87 83 78)",
                textAlign: "center",
                paddingBottom: 30,
              }}
            >
              telegram id: {String(room?.chat_id)}
              {/* {room_id && <div>room_id: {room_id}</div>} */}
              {/* {username && <div>username: {username}</div>}
              <div>is_owner: {JSON.stringify(is_owner)}</div> */}
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
