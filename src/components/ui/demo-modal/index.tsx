import { ArrowRightIcon } from "@100mslive/react-icons";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

import IconLogo from "@/components/icons/icon-logo";
import { useSupabase } from "@/hooks/useSupabase";
import { openWeb3ModalVar, openIntroModalVar } from "@/apollo/reactive-store";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { useToast } from "@/components/ui/use-toast";

const data = [
  {
    name: "DAO",
    roleName: "DAO",
    role: "backstage",
    desc: ` This role is for DAO (Decentralized Autonomous Organizations) organizers. The role has full control and can add or remove members, invite them to the team, remove them from the team, and perform other administrative functions.`,
  },
  // {
  //   name: "Speaker",
  //   roleName: "speaker",
  //   role: "stage",
  //   desc: " This one is self explanatory. Use this role for folks who are going to be the main guests of the session. Speakers can also invite attendees on the stage, and respond to public chat messages.",
  // },
  {
    name: "Member",
    roleName: "Member",
    role: "viewer",
    desc: `This is the most basic role: he can see and hear everything that happens in his DAO, cannot share his audio and video, and can also leave messages in the public chat section.`,
  },
];

const DemoModal = () => {
  const [stage, setStage] = React.useState(``);
  const { toast } = useToast();

  const router = useRouter();

  React.useEffect(() => {
    if (router.query.slug) {
      setStage(router.query.slug as string);
    }
  }, [router]);

  return (
    <div className="font-sans">
      <p className="text-[32px] font-semibold my-0">
        Welcome to the DAO 999 NFT
      </p>
      <div>
        <p className="text-gray-300 text-[15px] my-0">
          A new era in the financial world opens today with the launch of the
          DAO 999 NFT digital avatar bank. This is a unique financial
          institution where immortality is now not only a concept, but a
          reality.
        </p>
        {data.map((m) => (
          <div
            className="flex md:flex-row flex-col justify-between py-4"
            style={{ borderBottom: "1px solid #323232" }}
            key={`${m.roleName}-${m.name}`}
          >
            <div className="text-left max-w-xs">
              <span className={`badge ${m.roleName}-badge`}>{m.roleName}</span>
              <p className="text-gray-300 text-xs">{m.desc}</p>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center mt-4 ">
          Powered by{" "}
          <IconLogo
            width="50"
            height="50"
            backgroundColor="var(--brand)"
            foregroundColor="black"
          />
          dao999nft
        </div>
      </div>
    </div>
  );
};

export default DemoModal;

export const CopyButton = ({ text = "" }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    if (!copied) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };
  return (
    <div className="relative">
      {copied ? (
        <p className="absolute top-10 left-0 flex bg-gray-600 justify-center  rounded-lg w-48 p-2">
          Copied to clipboard!
        </p>
      ) : null}
      <Button variant="secondary" onClick={copy}>
        Invite
      </Button>
    </div>
  );
};
