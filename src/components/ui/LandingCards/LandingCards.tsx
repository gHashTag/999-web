import React from "react";

import { cn } from "@helpers/utils";
import Image from "next/image";
import { useRouter } from "next/router";

type CardsProps = {
  type?: string;
  title?: string;
  children: JSX.Element;
  className?: string;
  url?: string;
};

const LandingCards: React.FC<CardsProps> = ({
  children,
  title,
  type,
  className,
  url,
}) => {
  const { push } = useRouter();

  return (
    <div
      className={cn(
        "flex p-6 rounded-lg border border-custom-1 w-full",
        className
      )}
      onClick={() => {
        if (url) push(url);
      }}
    >
      <div className="flex items-center gap-5">
        {type && (
          <Image
            src={`/images/${type}.png`}
            alt={type ?? "landing- card"}
            width={40}
            height={40}
            className="object-contain"
          />
        )}
        <div
          className="text-xl font-medium text-rgb-2"
          style={{ color: "lime" }}
        >
          {title}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
};
export default React.memo(LandingCards);
