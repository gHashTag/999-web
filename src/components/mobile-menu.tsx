import { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cn from "classnames";
import { NAVIGATION } from "@lib/constants";
import { useOverlayTriggerState } from "@react-stately/overlays";
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayContainer,
} from "@react-aria/overlays";
import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import { useButton } from "@react-aria/button";
import styles from "./mobile-menu.module.css";
import { useReactiveVar } from "@apollo/client";
import { setUserId } from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";

function ModalDialog(
  props: Parameters<typeof useOverlay>[0] &
    Parameters<typeof useDialog>[0] & { closeMenu: () => void }
) {
  const { username } = useUser();
  const router = useRouter();
  const user_id = localStorage.getItem("user_id");
  const activeRoute = router.asPath;

  const ref = useRef<HTMLElement | null>(null);
  const { modalProps } = useModal();
  const { overlayProps } = useOverlay(props, ref);
  const { dialogProps } = useDialog(props, ref);

  usePreventScroll();

  return (
    <div className={styles["nav-overlay"]}>
      <FocusScope contain restoreFocus autoFocus>
        <nav
          className={styles.nav}
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
        >
          <Link
            href={{
              pathname: `/${username}/${user_id}`,
            }}
            className={cn(styles["nav-item"], {
              [styles["nav-active"]]: activeRoute.startsWith(
                `/${username}/${user_id}`
              ),
            })}
            onClick={() => {
              props.closeMenu();
            }}
          >
            Office
          </Link>
          <Link
            href={{
              pathname: `/${username}`,
            }}
            className={cn(styles["nav-item"], {
              [styles["nav-active"]]: activeRoute.startsWith(`/${username}`),
            })}
            onClick={() => {
              props.closeMenu();
            }}
          >
            Wallet
          </Link>
        </nav>
      </FocusScope>
    </div>
  );
}

export default function Overlay() {
  const state = useOverlayTriggerState({});
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(
    {
      onPress: () => (state.isOpen ? state.close() : state.open()),
    },
    ref
  );

  const closeMenu = () => {
    state.close();
  };

  return (
    <>
      <button
        aria-label="Mobile Menu"
        type="button"
        className={styles.button}
        {...buttonProps}
        ref={ref}
      >
        {state.isOpen ? (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
            className={styles.icon}
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
            className={styles.icon}
          >
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </svg>
        )}
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={(...props) => state.close(...props)}
            closeMenu={closeMenu}
          />
        </OverlayContainer>
      )}
    </>
  );
}
