import React from "react";
import Image from "next/image";
import LandingIcons from "@components/assets/LandingIcons";
import { BackgroundGradient } from "@/components/ui/background-gradient";

type SubCardProps = {
  title: string;
  img: string;
  onClick: () => void;
  isDisabled?: boolean;
};

const SubCard: React.FC<SubCardProps> = ({
  title,
  img,
  onClick,
  isDisabled,
}) => {
  return (
    <a
      onClick={isDisabled ? () => {} : onClick}
      className={`${
        isDisabled
          ? "cursor-not-allowed"
          : "cursor-pointer transition duration-300 ease-in-out"
      }`}
    >
      <BackgroundGradient>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Image
            src={`/images/${img}`}
            alt={title ?? "landing-card"}
            width={500}
            height={300}
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="flex items-center justify-center">
          {LandingIcons[title]}
        </div>
        <div
          className="flex items-center justify-center text-slate-900 text-base font-medium mt-2"
          style={{ marginBottom: 20, fontSize: 20 }}
        >
          {title}
        </div>
      </BackgroundGradient>
    </a>
  );
};
export default React.memo(SubCard);
