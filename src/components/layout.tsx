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
import { SkipNavContent } from "@reach/skip-nav";
import { NAVIGATION } from "@lib/constants";
import styles from "./layout.module.css";
import Logo from "./icons/icon-logo";
import MobileMenu from "./mobile-menu";

import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import DemoButton from "@/components/ui/demo-cta";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useQuery, useReactiveVar } from "@apollo/client";
import { setActiveRoute, visibleHeaderVar } from "@/apollo/reactive-store";
import { Spinner } from "@/components/ui/spinner";
import { cache } from "@/pages/_app";
// import { CURRENT_USER } from "@/graphql/query";

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
  isLive?: boolean;
  loading: boolean;
};

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
  const visibleHeader = useReactiveVar(visibleHeaderVar);
  const activeMenuButton = useReactiveVar(setActiveRoute);

  const activeRoute = router.asPath;

  return (
    <>
      <div className={styles.background}>
        {!hideNav && (
          <header className={cn(styles.header)}>
            <div className={styles["header-logos"]}>
              <MobileMenu key={router.asPath} />
              <Link href="/" className={styles.logo}>
                <Logo />
              </Link>
            </div>
            <div className={styles.menu}>
              <NavigationMenu>
                <NavigationMenuList>
                  {NAVIGATION.map(({ name, route }) => (
                    <NavigationMenuItem key={name}>
                      {visibleHeader && (
                        <a onClick={() => setActiveRoute(route)}>
                          <Link
                            href={{
                              pathname: `/workspaceSlug${route}`,
                            }}
                            legacyBehavior
                            passHref
                          >
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                              style={
                                activeMenuButton === route
                                  ? { color: "#f6ff00" }
                                  : {}
                              }
                            >
                              {name.toUpperCase()}
                            </NavigationMenuLink>
                          </Link>
                        </a>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
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
          </header>
        )}
        {/* <ViewSource /> */}
        <div className={styles.page}>
          <main className={styles.main} style={layoutStyles}>
            <SkipNavContent />
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
