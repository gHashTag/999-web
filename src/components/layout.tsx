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
"use client";
import Link from "next/link";
import cn from "classnames";
import { useRouter } from "next/router";
// import { SkipNavContent } from "@reach/skip-nav";
// import { NAVIGATION } from "@lib/constants";
import styles from "./layout.module.css";
import Logo from "./icons/icon-logo";
import MobileMenu from "./mobile-menu";

import React, { useEffect } from "react";

import DemoButton from "@/components/ui/demo-cta";
import {
  // NavigationMenu,
  // NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
// import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useQuery, useReactiveVar } from "@apollo/client";
import {
  setActiveRoute,
  // setHeaderName,
  // setVisibleHeader,
} from "@/apollo/reactive-store";
import { Spinner } from "@/components/ui/spinner";
// import { cache } from "@/pages/_app";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
  isLive?: boolean;
  loading: boolean;
};

type CustomLinkProps = {
  route: string;
  pathname: string;
  legacyBehavior: boolean;
  passHref: boolean;
  activeMenuButton: string;
  name: string;
  navigationMenuTriggerStyle: () => string;
  setActiveRoute: (route: string) => void;
};

const CustomLink = ({
  route,
  pathname,
  legacyBehavior,
  passHref,
  activeMenuButton,
  name,
  navigationMenuTriggerStyle,
  setActiveRoute,
}: CustomLinkProps) => (
  <a onClick={() => setActiveRoute(route)}>
    <Link
      href={{
        pathname: pathname,
      }}
      legacyBehavior={legacyBehavior}
      passHref={passHref}
    >
      <NavigationMenuLink
        className={navigationMenuTriggerStyle()}
        style={activeMenuButton === route ? { color: "#f6ff00" } : {}}
      >
        {name.toUpperCase()}
      </NavigationMenuLink>
    </Link>
  </a>
);

export default function Layout({
  children,
  className,
  hideNav,
  layoutStyles,
  loading,
  isLive = false,
}: Props) {
  const router = useRouter();
  // const { data } = useQuery(CURRENT_USER);

  // const readCache = () => {
  //   cache.writeQuery({
  //     query: CURRENT_USER,
  //     data: {
  //       isLoggedIn: !!localStorage.getItem("user_id"),
  //       user_id: localStorage.getItem("user_id"),
  //       user_name: localStorage.getItem("user_name"),
  //       first_name: localStorage.getItem("first_name"),
  //       last_name: localStorage.getItem("last_name"),
  //     },
  //   });
  // };

  // useEffect(() => {
  //   readCache();
  //   if (data && !data.isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [data]);
  // const headerName = useReactiveVar(setHeaderName);
  const activeMenuButton = useReactiveVar(setActiveRoute);

  const activeRoute = router.asPath;
  const { user_id, photo_url, firstName, lastName, username } = useUser();

  const isAuthorized = !!username;

  const shortName = `${(firstName && firstName[0]) || ""}${
    (lastName && lastName[0]) || ""
  }`;

  const mainButtonRoute = activeRoute !== "/" ? `/${username}/${user_id}` : "/";

  return (
    <>
      <div className={styles.background}>
        {!hideNav && (
          <header className={cn(styles.header)}>
            <div className={styles["header-logos"]}>
              {isAuthorized && <MobileMenu key={router.asPath} />}
              <Link href={mainButtonRoute} className={styles.logo}>
                <Logo />
              </Link>
            </div>
            <div>
              {/* <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    {visibleHeader && (
                      <>
                        <CustomLink
                          route="office"
                          pathname={`/${user_id}`}
                          legacyBehavior
                          passHref
                          activeMenuButton={activeMenuButton}
                          name="Office"
                          navigationMenuTriggerStyle={
                            navigationMenuTriggerStyle
                          }
                          setActiveRoute={setActiveRoute}
                        />
                        <CustomLink
                          route="wallet"
                          pathname={`/wallet`}
                          legacyBehavior
                          passHref
                          activeMenuButton={activeMenuButton}
                          name="Wallet"
                          navigationMenuTriggerStyle={
                            navigationMenuTriggerStyle
                          }
                          setActiveRoute={setActiveRoute}
                        />
                      </>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> */}
            </div>

            <div
              style={
                activeRoute
                  ? { position: "absolute", top: 20, right: 40 }
                  : { marginRight: "80px" }
              }
            >
              {activeRoute === "/" && <DemoButton />}
            </div>
            {activeRoute !== "/" && (
              <div className={styles["header-logos"]}>
                <Link href={`/${username}`} className={styles.logo}>
                  <Avatar>
                    <AvatarImage src={photo_url || ""} />
                    <AvatarFallback>{shortName}</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            )}
          </header>
        )}
        {/* <ViewSource /> */}
        <div className={styles.page}>
          <main className={styles.main} style={layoutStyles}>
            {/* <SkipNavContent /> */}
            {loading ? (
              <Spinner size="lg" />
            ) : (
              <div className={cn(styles.full, className)}>{children}</div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
