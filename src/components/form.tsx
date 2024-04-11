/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import cn from "classnames";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import LoadingDots from "./loading-dots";
import styleUtils from "./utils.module.css";
import styles from "./form.module.css";

import { useReactiveVar } from "@apollo/client";
import {
  openWeb3ModalVar,
  setInviteCode,
  setUserId,
  visibleSignInVar,
} from "@/apollo/reactive-store";

import Captcha, { useCaptcha } from "./captcha";

import { useSupabase } from "@/hooks/useSupabase";

type FormState = "default" | "loading" | "error";

type Props = {
  sharePage?: boolean;
};

export default function Form({ sharePage }: Props) {
  const { toast } = useToast();

  const visible = useReactiveVar(visibleSignInVar);
  const workspace_id = useReactiveVar(setUserId);
  const inviteCode = useReactiveVar(setInviteCode);

  const [errorMsg, setErrorMsg] = useState("");
  const [errorTryAgain, setErrorTryAgain] = useState(false);
  const [focused, setFocused] = useState(false);
  const [formState, setFormState] = useState<FormState>("default");
  const router = useRouter();
  const {
    ref: captchaRef,
    execute: executeCaptcha,
    reset: resetCaptcha,
    isEnabled: isCaptchaEnabled,
  } = useCaptcha();

  const { checkUsername } = useSupabase();
  const inputRef = useRef(null);

  useEffect(() => {
    if (workspace_id) {
      router.push(`/${workspace_id}/wallet`);
    }
    if (inputRef.current) {
      (inputRef.current as any)?.focus();
    }
  }, []);

  const handleRegister = useCallback(async () => {
    if (inviteCode) {
      const isInviterExist = await checkUsername(inviteCode);
      if (isInviterExist) {
        visibleSignInVar(true);
      } else {
        setErrorMsg("Invite code not correct");
        setFormState("error");
        setTimeout(() => setFormState("default"), 2000);
        toast({
          variant: "destructive",
          title: "Closed access",
          description:
            "This content is available to registered users only. Enter the invite code to access it.",
        });
        return;
      }
    }
  }, [inviteCode]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (formState === "default") {
        setFormState("loading");

        if (isCaptchaEnabled) {
          return executeCaptcha();
        }

        return handleRegister();
      } else {
        setFormState("default");
      }
    },
    [executeCaptcha, formState, isCaptchaEnabled, handleRegister]
  );

  const onTryAgainClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      setFormState("default");
      setErrorTryAgain(true);
      resetCaptcha();
    },
    [resetCaptcha]
  );

  return formState === "error" ? (
    <div
      className={cn(styles.form, {
        [styles["share-page"]]: sharePage,
      })}
    >
      <div className={styles["form-row"]}>
        <div className={cn(styles["input-label"], styles.error)}>
          <div className={cn(styles.input, styles["input-text"])}>
            {errorMsg}
          </div>
          <Button
            type="button"
            className={cn(styles.submit, styles.register, styles.error)}
            onClick={onTryAgainClick}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <>
      {!visible ? (
        <form
          className={cn(styles.form, {
            [styles["share-page"]]: sharePage,
            [styleUtils.appear]: !errorTryAgain,
            [styleUtils["appear-fifth"]]: !errorTryAgain && !sharePage,
            [styleUtils["appear-third"]]: !errorTryAgain && sharePage,
          })}
          onSubmit={onSubmit}
        >
          <div className={styles["form-row"]}>
            <label
              htmlFor="email-input-field"
              className={cn(styles["input-label"], {
                [styles.focused]: focused,
              })}
            >
              <input
                ref={inputRef}
                className={styles.input}
                autoComplete="off"
                type="text"
                id="email-input-field"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter invite code"
                aria-label="Your invite code address"
                required
              />
            </label>
            <Button
              type="submit"
              className={cn(styles.submit, styles.register, styles[formState])}
              disabled={formState === "loading"}
            >
              {formState === "loading" ? (
                <LoadingDots size={4} />
              ) : (
                <p className={styles["register-text"]}>Register</p>
              )}
            </Button>
          </div>
          <Captcha ref={captchaRef} onVerify={handleRegister} />
        </form>
      ) : null}
    </>
  );
}
