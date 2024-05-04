import * as React from "react";
import SubCard from "@/components/ui/LandingCards/SubCard";

const cardsCreateRoom = [
  {
    title: "Video Space",
    img: "https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/images/Rooms/Video%20Space.png",
    onClickType: "video-space",
    isDisabled: false,
  },
  {
    title: "Audio Space",
    img: "https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/images/Rooms/Audio%20Space.png",
    onClickType: "audio-space",
    isDisabled: false,
  },
  {
    title: "Token-gated",
    img: "https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/images/Rooms/Token-gated.png",
    onClickType: "token-gated",
    isDisabled: true,
  },
];

const SelectRoom = ({
  setOpenModalType,
}: {
  setOpenModalType: (type: string) => void;
}) => {
  return (
    <>
      <div
        className="flex-col"
        style={{
          paddingTop: 10,
          paddingRight: 80,
          paddingLeft: 80,
        }}
      >
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-3 mt-6">
          {cardsCreateRoom.map((card) => (
            <SubCard
              key={card.title}
              title={card.title}
              img={card.img}
              onClick={() => setOpenModalType(card.onClickType)}
              isDisabled={card.isDisabled}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export { SelectRoom };
