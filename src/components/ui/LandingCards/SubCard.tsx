import React from "react";
import Image from "next/image";
import LandingIcons from "@components/assets/LandingIcons";
import Link from "next/link";
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
        {/* <div className="border rounded-lg border-custom-1 p-4 flex flex-col cursor-pointer hover:bg-[#fff]/50 transition duration-300 ease-in-out"> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <Image
            src={`/images/${img}`}
            alt={title ?? "landing-card"}
            width={400}
            height={400}
            className="object-contain"
            style={{ marginBottom: "20px" }}
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
      {/* </div> */}
    </a>
  );
};
export default React.memo(SubCard);
