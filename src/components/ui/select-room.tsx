import * as React from "react";
import SubCard from "@/components/ui/LandingCards/SubCard";

const cardsCreateRoom = [
  {
    title: "Video Meeting",
    img: "Video Meeting.png",
    onClickType: "meets",
    isDisabled: false,
  },
  {
    title: "Audio Spaces",
    img: "Audio Spaces.png",
    onClickType: "audio-spaces",
    isDisabled: false,
  },
  {
    title: "Token-gated Room",
    img: "Token-gated Room.png",
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
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-1 mt-6">
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
