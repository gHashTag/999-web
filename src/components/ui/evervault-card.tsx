import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useCopyToClipboard } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { SITE_URL } from "@/pages/_app";
import { PassportArray } from "@/types";

type EvervaultCardProps = {
  text: string;
  type: string;
  className?: string;
  inviteToMeet: (type: string) => void;
  inviteHostCode: string;
  inviteMemberCode: string;
  inviteGuestCode: string;
  onOpenModalPassport: () => void;
  passportData: PassportArray;
};

export const EvervaultCard = ({
  text,
  type,
  className,
  inviteToMeet,
  inviteHostCode,
  inviteMemberCode,
  inviteGuestCode,
  onOpenModalPassport,
  passportData,
}: EvervaultCardProps) => {
  const router = useRouter();
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [copiedText, copy] = useCopyToClipboard();
  const [randomString, setRandomString] = useState("");
  const { toast } = useToast();
  const { user_id, workspace_id, room_id } = useUser();

  useEffect(() => {
    let str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        // console.log("Copied!", { text });
        toast({
          title: "Copied!",
          description: `${text} copied`,
        });
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast({
          title: "Error",
          variant: "destructive",
          description: `${error}`,
        });
      });
  };

  const handleClick = async () => {
    // Определение targetPath в зависимости от типа

    console.log(SITE_URL, "SITE_URL");
    if (
      router.pathname !==
      `/${user_id}/${workspace_id}/${room_id}/meet/${inviteHostCode}`
    ) {
      if (type === "guest") {
        handleCopy(
          `${SITE_URL}/${user_id}/${workspace_id}/${room_id}/meet/${inviteGuestCode}`
        );
        inviteToMeet(type);
      } else if (type === "member") {
        inviteToMeet(type);
        onOpenModalPassport();
      } else if (type === "host") {
        inviteToMeet(type);
      }
    }
  };

  const href =
    type === "host"
      ? `/${user_id}/${workspace_id}/${room_id}/meet/${inviteHostCode}`
      : router.asPath;

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className="cursor-pointer border border-black/[0.2] dark:border-yellow-500/[0.2] flex flex-col items-start max-w-sm container mx-auto px-4 md:px-6 lg:px-8 p-4 relative h-[13rem]"
      >
        <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-yellow-500 text-black" />
        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-yellow-500 text-black" />
        <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-yellow-500 text-black" />
        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-yellow-500 text-black" />
        <div
          style={{ width: 320, height: 170 }}
          className={cn(
            "p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative",
            className
          )}
        >
          <div
            onMouseMove={onMouseMove}
            className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
          >
            <CardPattern
              mouseX={mouseX}
              mouseY={mouseY}
              randomString={randomString}
            />
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative h-44 w-44  rounded-full flex items-center justify-center text-white font-bold text-4xl">
                <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
                <span className="dark:text-white text-black z-20 text-center">
                  {text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export function CardPattern({ mouseX, mouseY, randomString, onClick }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="absolute inset-0 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500 to-white-700 opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay  group-hover/card:opacity-100"
        style={style}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
