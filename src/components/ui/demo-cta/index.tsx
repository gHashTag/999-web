import styles from "./index.module.css";
import cn from "classnames";
import { useEffect, useState, useRef } from "react";
import useClickOutside from "@lib/hooks/use-click-outside";
import * as Dialog from "@radix-ui/react-dialog";
import { CrossIcon } from "@100mslive/react-icons";
import InfoIcon from "@components/icons/icon-info";
import DemoModal from "../demo-modal";
import { useToast } from "@/components/ui/use-toast";
import { useReactiveVar } from "@apollo/client";
import { visibleSignInVar, openIntroModalVar } from "@/apollo/reactive-store";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

const DemoButton = () => {
  const visible = useReactiveVar(visibleSignInVar);
  const openIntroModal = useReactiveVar(openIntroModalVar);

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById("cta-btn");
      el?.classList.add("show-overlay");
      const tooltip = document.getElementById("cta-tooltip");
      tooltip?.classList.add("fade-in");
    }, 3000);
  }, []);
  const ctaRef = useRef(null);
  const clickedOutside = () => {
    const el = document.getElementById("cta-btn");
    const tooltip = document.getElementById("cta-tooltip");
    tooltip?.remove();
    el?.classList.remove("show-overlay");
  };
  useClickOutside(ctaRef, clickedOutside);

  const handleRegister = async () => {
    openIntroModalVar(!openIntroModal);
  };

  return (
    <Dialog.Root open={openIntroModal} onOpenChange={handleRegister}>
      <Dialog.Overlay className={cn(styles["overlay"])} />
      {visible && (
        <Dialog.Trigger asChild>
          <button
            ref={ctaRef}
            id="cta-btn"
            className={cn(styles["cta-btn"])}
            onClick={handleRegister}
          >
            Sign In
          </button>
        </Dialog.Trigger>
      )}
      <div id="cta-tooltip" className={cn(styles["tooltip"])}>
        <InfoIcon />
        Click here to demo
      </div>
      <Dialog.Content className={cn(styles["content"], "dialog-animation")}>
        <Dialog.Close asChild className={cn(styles["close-btn"])}>
          <button>
            <CrossIcon />
          </button>
        </Dialog.Close>
        <DemoModal />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DemoButton;
