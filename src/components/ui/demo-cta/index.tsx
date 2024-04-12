import { useEffect, useRef } from "react";
import useClickOutside from "@lib/hooks/use-click-outside";
import { useReactiveVar } from "@apollo/client";
import { visibleSignInVar } from "@/apollo/reactive-store";

import { TLoginButton, TLoginButtonSize, TUser } from "react-telegram-auth";
import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/router";
import { __DEV__ } from "@/pages/_app";

const DemoButton = () => {
  const visible = useReactiveVar(visibleSignInVar);

  const router = useRouter();
  const { createSupabaseUser } = useSupabase();

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

  const handleTelegramResponse = async (user: TUser) => {
    const user_id = await createSupabaseUser(user);
    router.push(`/${user_id}`);
  };

  return (
    <>
      {visible && (
        <TLoginButton
          botName={`${__DEV__ ? "vasilev_dmitrii_bot" : "dao999nft_dev_bot"}`}
          buttonSize={TLoginButtonSize.Large}
          lang="en"
          usePic={true}
          cornerRadius={20}
          onAuthCallback={handleTelegramResponse}
          requestAccess={"write"}
          // additionalClasses={"css-class-for-wrapper"}
        />
      )}
    </>
  );
};

export default DemoButton;
