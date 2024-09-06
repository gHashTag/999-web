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

import cn from "classnames";
import VercelLogo from "@components/icons/icon-platform";
import styles from "./footer.module.css";
import {
  COPYRIGHT_HOLDER,
  SITE_NAME,
  // CODE_OF_CONDUCT,
  LEGAL_URL,
  REPO,
} from "@lib/constants";
import Link from "next/link";
import IconLogo from "@/components/icons/icon-logo";

export function HostedByVercel() {
  return (
    <div className="flex items-center justify-center mt-4 ">
      Powered by{" "}
      <IconLogo
        width="50"
        height="50"
        backgroundColor="var(--accents-1)"
        foregroundColor="black"
      />
      NeuroCalls 
    </div>
  );
}

export default function Footer() {
  return (
    <footer className={cn(styles.footer)}>
      <div style={{ paddingBottom: 50, color: "gray" }}>
        Copyright © {`${new Date().getFullYear()} `}{" "}
        {COPYRIGHT_HOLDER || `${SITE_NAME}.`} All rights reserved.
      </div>
    </footer>
  );
}
