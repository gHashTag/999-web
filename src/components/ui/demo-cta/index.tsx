import { useEffect, useRef } from "react";
import useClickOutside from "@lib/hooks/use-click-outside";
import { useReactiveVar } from "@apollo/client";
import { visibleSignInVar, setInviterUserInfo } from "@/apollo/reactive-store";

import { TLoginButton, TLoginButtonSize, TUser } from "react-telegram-auth";
import { createUser } from "@/nextapi/index";
// import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/router";
import { botName } from "@/utils/constants";

const DemoButton = () => {
  const visible = useReactiveVar(visibleSignInVar);
  const userInfo = useReactiveVar(setInviterUserInfo);

  const router = useRouter();
  // const { createSupabaseUser } = useSupabase();

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
    const userDataForBaseRecord = {
      ...user,
      ...userInfo,
      telegram_id: user.id,
    };
    const newUserDataFromBase = await createUser(userDataForBaseRecord);
    localStorage.setItem("username", userDataForBaseRecord.username || "");
    localStorage.setItem("user_id", newUserDataFromBase.user_id || "");
    localStorage.setItem("recording_id", "");
    localStorage.setItem("room_id", "");
    localStorage.setItem("workspace_id", "");
    localStorage.setItem("photo_url", "");
    router.push(`/${user.username}/0`);
  };

  return (
    <>
      {visible && (
        <TLoginButton
          botName={botName}
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
